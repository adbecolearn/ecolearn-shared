/**
 * 🔐 EcoLearn Authentication Utilities
 * PASETO-based authentication dengan green computing optimization
 */

import { config } from '../../config/Config.js';
import { apiService } from '../../services/ApiService.js';
import { carbonTracker } from '../green/CarbonTracker.js';

export class AuthUtils {
    constructor() {
        this.tokenKey = 'ecolearn_token';
        this.userKey = 'ecolearn_user';
        this.refreshThreshold = config.get('TOKEN_REFRESH_THRESHOLD', 300000); // 5 minutes
        this.sessionTimeout = config.get('SESSION_TIMEOUT', 3600000); // 1 hour
        
        this.setupTokenRefresh();
    }

    /**
     * Login user dengan email dan password
     * @param {string} email User email
     * @param {string} password User password
     * @returns {Promise<Object>} Login result
     */
    async login(email, password) {
        carbonTracker.track('auth_login_attempt', { email });
        
        try {
            const response = await apiService.post('/auth/login', {
                email,
                password
            });

            if (response.success) {
                await this.setAuthData(response.data.token, response.data.user);
                carbonTracker.track('auth_login_success', {
                    userId: response.data.user.id,
                    role: response.data.user.role
                });

                return {
                    success: true,
                    user: response.data.user,
                    redirectUrl: this.getRedirectUrl(response.data.user.role)
                };
            } else {
                carbonTracker.track('auth_login_failed', {
                    email,
                    reason: response.message
                });

                return {
                    success: false,
                    message: response.message || 'Login failed'
                };
            }
        } catch (error) {
            carbonTracker.track('auth_login_error', { 
                email, 
                error: error.message 
            });
            
            return {
                success: false,
                message: 'Network error. Please try again.'
            };
        }
    }

    /**
     * Register new user
     * @param {Object} userData User registration data
     * @returns {Promise<Object>} Registration result
     */
    async register(userData) {
        carbonTracker.track('auth_register_attempt', { 
            email: userData.email,
            role: userData.role 
        });
        
        try {
            const response = await apiService.post('/auth/register', userData);

            if (response.success) {
                carbonTracker.track('auth_register_success', {
                    userId: response.data.user.id,
                    role: response.data.user.role
                });

                return {
                    success: true,
                    message: 'Registration successful. Please check your email for verification.',
                    user: response.data.user
                };
            } else {
                carbonTracker.track('auth_register_failed', {
                    email: userData.email,
                    reason: response.message
                });

                return {
                    success: false,
                    message: response.message || 'Registration failed'
                };
            }
        } catch (error) {
            carbonTracker.track('auth_register_error', { 
                email: userData.email, 
                error: error.message 
            });
            
            return {
                success: false,
                message: 'Network error. Please try again.'
            };
        }
    }

    /**
     * Logout user
     */
    async logout() {
        const user = this.getCurrentUser();
        
        carbonTracker.track('auth_logout', { 
            userId: user?.id,
            sessionDuration: Date.now() - (user?.loginTime || Date.now())
        });
        
        try {
            await apiService.post('/auth/logout');
        } catch (error) {
            console.warn('Logout API call failed:', error);
        }
        
        this.clearAuthData();
        this.redirectToLogin();
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated() {
        const token = this.getToken();
        const user = this.getCurrentUser();
        
        if (!token || !user) {
            return false;
        }
        
        // Check token expiration
        if (this.isTokenExpired(token)) {
            this.clearAuthData();
            return false;
        }
        
        return true;
    }

    /**
     * Get current user
     * @returns {Object|null} Current user data
     */
    getCurrentUser() {
        try {
            const userData = localStorage.getItem(this.userKey);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    /**
     * Get authentication token
     * @returns {string|null} Auth token
     */
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Set authentication data
     * @param {string} token Auth token
     * @param {Object} user User data
     */
    async setAuthData(token, user) {
        // Add login timestamp
        const userData = {
            ...user,
            loginTime: Date.now()
        };
        
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(userData));
        
        // Setup session timeout
        this.setupSessionTimeout();
    }

    /**
     * Clear authentication data
     */
    clearAuthData() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }

    /**
     * Check if token is expired
     * @param {string} token Auth token
     * @returns {boolean} Expiration status
     */
    isTokenExpired(token) {
        try {
            // PASETO tokens are not JWT, so we check with backend
            // For now, we'll use a simple time-based check
            const user = this.getCurrentUser();
            if (!user || !user.loginTime) {
                return true;
            }
            
            const elapsed = Date.now() - user.loginTime;
            return elapsed > this.sessionTimeout;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    }

    /**
     * Refresh authentication token
     * @returns {Promise<boolean>} Refresh success
     */
    async refreshToken() {
        try {
            const response = await apiService.post('/auth/refresh');
            
            if (response.success) {
                const user = this.getCurrentUser();
                await this.setAuthData(response.token, user);
                
                carbonTracker.track('auth_token_refresh', { 
                    userId: user?.id 
                });
                
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            carbonTracker.track('auth_token_refresh_failed', { 
                error: error.message 
            });
        }
        
        return false;
    }

    /**
     * Setup automatic token refresh
     */
    setupTokenRefresh() {
        setInterval(async () => {
            if (this.isAuthenticated()) {
                const user = this.getCurrentUser();
                const elapsed = Date.now() - (user?.loginTime || 0);
                
                // Refresh token when close to expiration
                if (elapsed > (this.sessionTimeout - this.refreshThreshold)) {
                    const refreshed = await this.refreshToken();
                    if (!refreshed) {
                        this.logout();
                    }
                }
            }
        }, this.refreshThreshold);
    }

    /**
     * Setup session timeout
     */
    setupSessionTimeout() {
        setTimeout(() => {
            if (this.isAuthenticated()) {
                alert('Your session has expired. Please login again.');
                this.logout();
            }
        }, this.sessionTimeout);
    }

    /**
     * Get redirect URL based on user role
     * @param {string} role User role
     * @returns {string} Redirect URL
     */
    getRedirectUrl(role) {
        const roleUrls = {
            student: '/student/',
            educator: '/educator/',
            admin: '/admin/',
            setup: '/setup/'
        };
        
        return roleUrls[role] || '/student/';
    }

    /**
     * Redirect to login page
     */
    redirectToLogin() {
        const currentUrl = window.location.href;
        const loginUrl = '/auth/#login';
        
        // Add return URL for redirect after login
        if (!currentUrl.includes('/auth/')) {
            const returnUrl = encodeURIComponent(currentUrl);
            window.location.href = `${loginUrl}?return=${returnUrl}`;
        } else {
            window.location.href = loginUrl;
        }
    }

    /**
     * Check user role
     * @param {string} requiredRole Required role
     * @returns {boolean} Role check result
     */
    hasRole(requiredRole) {
        const user = this.getCurrentUser();
        return user && user.role === requiredRole;
    }

    /**
     * Check user permissions
     * @param {string} permission Required permission
     * @returns {boolean} Permission check result
     */
    hasPermission(permission) {
        const user = this.getCurrentUser();
        if (!user || !user.permissions) {
            return false;
        }
        
        return user.permissions.includes(permission);
    }

    /**
     * Validate academic email
     * @param {string} email Email address
     * @returns {boolean} Validation result
     */
    isValidAcademicEmail(email) {
        const academicDomain = config.get('EMAIL_DOMAIN', '@digitalbdg.ac.id');
        return email.toLowerCase().endsWith(academicDomain.toLowerCase());
    }

    /**
     * Get user's experiment group
     * @returns {string|null} Experiment group
     */
    getExperimentGroup() {
        const user = this.getCurrentUser();
        return user?.experimentGroup || null;
    }

    /**
     * Check if user is in research mode
     * @returns {boolean} Research mode status
     */
    isResearchMode() {
        return config.get('RESEARCH_MODE', false) && this.getCurrentUser();
    }
}

// Create singleton instance
export const authUtils = new AuthUtils();

// Export for direct usage
export default authUtils;
