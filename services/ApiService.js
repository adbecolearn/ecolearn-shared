/**
 * 🌐 EcoLearn API Service
 * Centralized API client dengan carbon tracking dan caching
 */

import { config } from '../config/Config.js';
import { CarbonTracker } from '../utils/green/CarbonTracker.js';

export class ApiService {
    constructor() {
        this.baseURL = config.getApiUrl();
        this.timeout = config.get('API_TIMEOUT', 10000);
        this.cache = new Map();
        this.cacheDuration = config.get('CACHE_DURATION', 300000);
        this.carbonTracker = new CarbonTracker();
        
        // Request interceptors
        this.requestInterceptors = [];
        this.responseInterceptors = [];
        
        this.setupDefaultInterceptors();
    }

    /**
     * Setup default request/response interceptors
     */
    setupDefaultInterceptors() {
        // Add auth token to requests
        this.addRequestInterceptor((config) => {
            const token = this.getAuthToken();
            if (token) {
                config.headers = {
                    ...config.headers,
                    'Authorization': `Bearer ${token}`
                };
            }
            return config;
        });

        // Handle auth errors
        this.addResponseInterceptor(
            (response) => response,
            (error) => {
                if (error.status === 401) {
                    this.handleAuthError();
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Add request interceptor
     * @param {Function} interceptor Request interceptor function
     */
    addRequestInterceptor(interceptor) {
        this.requestInterceptors.push(interceptor);
    }

    /**
     * Add response interceptor
     * @param {Function} onSuccess Success interceptor
     * @param {Function} onError Error interceptor
     */
    addResponseInterceptor(onSuccess, onError) {
        this.responseInterceptors.push({ onSuccess, onError });
    }

    /**
     * Apply request interceptors
     * @param {Object} requestConfig Request configuration
     * @returns {Object} Modified request configuration
     */
    applyRequestInterceptors(requestConfig) {
        return this.requestInterceptors.reduce(
            (config, interceptor) => interceptor(config),
            requestConfig
        );
    }

    /**
     * Apply response interceptors
     * @param {Response|Error} response Response or error
     * @param {boolean} isError Whether this is an error response
     * @returns {Promise} Processed response
     */
    async applyResponseInterceptors(response, isError = false) {
        for (const interceptor of this.responseInterceptors) {
            try {
                if (isError && interceptor.onError) {
                    response = await interceptor.onError(response);
                } else if (!isError && interceptor.onSuccess) {
                    response = await interceptor.onSuccess(response);
                }
            } catch (error) {
                console.error('Response interceptor error:', error);
            }
        }
        return response;
    }

    /**
     * Get authentication token
     * @returns {string|null} Auth token
     */
    getAuthToken() {
        return localStorage.getItem('ecolearn_token');
    }

    /**
     * Handle authentication errors
     */
    handleAuthError() {
        localStorage.removeItem('ecolearn_token');
        localStorage.removeItem('ecolearn_user');
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('auth')) {
            window.location.href = '/auth/#login';
        }
    }

    /**
     * Generate cache key
     * @param {string} url Request URL
     * @param {Object} options Request options
     * @returns {string} Cache key
     */
    getCacheKey(url, options = {}) {
        const method = options.method || 'GET';
        const body = options.body ? JSON.stringify(options.body) : '';
        return `${method}:${url}:${body}`;
    }

    /**
     * Get cached response
     * @param {string} cacheKey Cache key
     * @returns {Object|null} Cached response
     */
    getCachedResponse(cacheKey) {
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
            return cached.data;
        }
        this.cache.delete(cacheKey);
        return null;
    }

    /**
     * Set cached response
     * @param {string} cacheKey Cache key
     * @param {Object} data Response data
     */
    setCachedResponse(cacheKey, data) {
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Make HTTP request
     * @param {string} url Request URL
     * @param {Object} options Request options
     * @returns {Promise<Object>} Response data
     */
    async request(url, options = {}) {
        const startTime = Date.now();
        
        try {
            // Prepare request configuration
            let requestConfig = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            };

            // Apply request interceptors
            requestConfig = this.applyRequestInterceptors(requestConfig);

            // Check cache for GET requests
            const cacheKey = this.getCacheKey(url, requestConfig);
            if (requestConfig.method === 'GET') {
                const cached = this.getCachedResponse(cacheKey);
                if (cached) {
                    this.carbonTracker.track('api_cache_hit', { url });
                    return cached;
                }
            }

            // Make request with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
            
            const response = await fetch(fullUrl, {
                ...requestConfig,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Track carbon footprint
            const duration = Date.now() - startTime;
            this.carbonTracker.track('api_request', {
                url,
                method: requestConfig.method,
                duration,
                status: response.status
            });

            // Handle response
            if (!response.ok) {
                const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
                error.status = response.status;
                error.response = response;
                throw error;
            }

            const data = await response.json();
            
            // Apply response interceptors
            const processedData = await this.applyResponseInterceptors(data);

            // Cache GET responses
            if (requestConfig.method === 'GET') {
                this.setCachedResponse(cacheKey, processedData);
            }

            return processedData;

        } catch (error) {
            const duration = Date.now() - startTime;
            
            // Track error
            this.carbonTracker.track('api_error', {
                url,
                method: options.method || 'GET',
                duration,
                error: error.message
            });

            // Apply error interceptors
            await this.applyResponseInterceptors(error, true);
            
            throw error;
        }
    }

    /**
     * GET request
     * @param {string} url Request URL
     * @param {Object} options Request options
     * @returns {Promise<Object>} Response data
     */
    async get(url, options = {}) {
        return this.request(url, { ...options, method: 'GET' });
    }

    /**
     * POST request
     * @param {string} url Request URL
     * @param {Object} data Request body
     * @param {Object} options Request options
     * @returns {Promise<Object>} Response data
     */
    async post(url, data = null, options = {}) {
        return this.request(url, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : null
        });
    }

    /**
     * PUT request
     * @param {string} url Request URL
     * @param {Object} data Request body
     * @param {Object} options Request options
     * @returns {Promise<Object>} Response data
     */
    async put(url, data = null, options = {}) {
        return this.request(url, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : null
        });
    }

    /**
     * DELETE request
     * @param {string} url Request URL
     * @param {Object} options Request options
     * @returns {Promise<Object>} Response data
     */
    async delete(url, options = {}) {
        return this.request(url, { ...options, method: 'DELETE' });
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys())
        };
    }
}

// Create singleton instance
export const apiService = new ApiService();

// Export for direct usage
export default apiService;
