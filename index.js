/**
 * 🔧 EcoLearn Shared Libraries - Main Entry Point
 * Green computing utilities untuk semua micro frontend
 */

// ===== CONFIGURATION =====
export { Config, config } from './config/Config.js';

// ===== SERVICES =====
export { ApiService, apiService } from './services/ApiService.js';
export { EcoLearnAPI, ecoLearnAPI } from './services/EcoLearnAPI.js';

// ===== UTILITIES =====
// Green Computing
export { CarbonTracker, carbonTracker } from './utils/green/CarbonTracker.js';

// Authentication
export { AuthUtils, authUtils } from './utils/auth/AuthUtils.js';

// ===== COMPONENTS =====
// Common Components
export { EcoButton } from './components/common/EcoButton.js';

// ===== CONSTANTS =====
export const ECOLEARN_VERSION = '1.0.0';
export const CARBON_BUDGET_PER_SESSION = 10; // grams CO2
export const PERFORMANCE_TARGET = 500; // milliseconds
export const BUNDLE_SIZE_LIMIT = 100000; // bytes (100KB)

// ===== INITIALIZATION =====
/**
 * Initialize EcoLearn shared libraries
 * @param {Object} options Initialization options
 */
export async function initEcoLearn(options = {}) {
    const defaultOptions = {
        carbonTracking: true,
        performanceMonitoring: true,
        debugMode: false,
        ...options
    };

    // Import carbon tracker dynamically to avoid circular dependency
    const { carbonTracker } = await import('./utils/green/CarbonTracker.js');

    // Initialize carbon tracking
    if (defaultOptions.carbonTracking) {
        carbonTracker.track('ecolearn_init', {
            version: ECOLEARN_VERSION,
            options: defaultOptions
        });
    }

    // Setup global error handling
    if (defaultOptions.performanceMonitoring) {
        setupGlobalErrorHandling();
    }

    // Setup performance monitoring
    setupPerformanceMonitoring();

    // Log initialization in debug mode
    if (defaultOptions.debugMode) {
        console.log('🌱 EcoLearn Shared Libraries initialized', {
            version: ECOLEARN_VERSION,
            options: defaultOptions,
            carbonBudget: `${CARBON_BUDGET_PER_SESSION}g CO2`,
            performanceTarget: `${PERFORMANCE_TARGET}ms`,
            bundleSizeLimit: `${BUNDLE_SIZE_LIMIT / 1000}KB`
        });
    }

    return {
        version: ECOLEARN_VERSION,
        carbonTracker,
        config,
        apiService,
        authUtils
    };
}

/**
 * Setup global error handling
 */
function setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
        carbonTracker.track('javascript_error', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    });

    window.addEventListener('unhandledrejection', (event) => {
        carbonTracker.track('promise_rejection', {
            reason: event.reason?.toString() || 'Unknown promise rejection'
        });
    });
}

/**
 * Setup performance monitoring
 */
function setupPerformanceMonitoring() {
    // Monitor page load performance
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            
            carbonTracker.track('page_performance', {
                loadTime,
                domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                firstPaint: timing.responseStart - timing.navigationStart,
                performanceGrade: loadTime < PERFORMANCE_TARGET ? 'good' : 'needs_improvement'
            });
        });
    }

    // Monitor resource loading
    if (window.performance && window.performance.getEntriesByType) {
        window.addEventListener('load', () => {
            const resources = window.performance.getEntriesByType('resource');
            let totalSize = 0;
            
            resources.forEach(resource => {
                if (resource.transferSize) {
                    totalSize += resource.transferSize;
                }
            });
            
            carbonTracker.track('resource_loading', {
                totalResources: resources.length,
                totalSize,
                bundleSizeGrade: totalSize < BUNDLE_SIZE_LIMIT ? 'good' : 'needs_optimization'
            });
        });
    }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Create eco-friendly component with carbon tracking
 * @param {string} componentName Component name
 * @param {Function} componentFactory Component factory function
 * @returns {Function} Wrapped component factory
 */
export function createEcoComponent(componentName, componentFactory) {
    return function(...args) {
        const startTime = Date.now();
        
        carbonTracker.track('component_create_start', {
            component: componentName
        });
        
        const component = componentFactory(...args);
        
        const creationTime = Date.now() - startTime;
        carbonTracker.track('component_create_end', {
            component: componentName,
            creationTime
        });
        
        return component;
    };
}

/**
 * Measure function performance and carbon impact
 * @param {string} functionName Function name
 * @param {Function} fn Function to measure
 * @returns {Function} Wrapped function
 */
export function measureEcoPerformance(functionName, fn) {
    return function(...args) {
        const startTime = Date.now();
        
        try {
            const result = fn.apply(this, args);
            
            // Handle async functions
            if (result && typeof result.then === 'function') {
                return result.finally(() => {
                    const duration = Date.now() - startTime;
                    carbonTracker.track('function_performance', {
                        function: functionName,
                        duration,
                        async: true
                    });
                });
            } else {
                const duration = Date.now() - startTime;
                carbonTracker.track('function_performance', {
                    function: functionName,
                    duration,
                    async: false
                });
                return result;
            }
        } catch (error) {
            const duration = Date.now() - startTime;
            carbonTracker.track('function_error', {
                function: functionName,
                duration,
                error: error.message
            });
            throw error;
        }
    };
}

/**
 * Get current carbon footprint status
 * @returns {Object} Carbon status
 */
export function getCarbonStatus() {
    return carbonTracker.getCarbonBudget();
}

/**
 * Get performance metrics
 * @returns {Object} Performance metrics
 */
export function getPerformanceMetrics() {
    return carbonTracker.getMetrics();
}

/**
 * Check if green computing targets are met
 * @returns {Object} Green computing status
 */
export function getGreenComputingStatus() {
    const carbonStatus = getCarbonStatus();
    const metrics = getPerformanceMetrics();
    
    return {
        carbon: {
            status: carbonStatus.status,
            percentage: carbonStatus.percentage,
            target: 'good'
        },
        performance: {
            status: metrics.sessionDuration < PERFORMANCE_TARGET ? 'good' : 'needs_improvement',
            duration: metrics.sessionDuration,
            target: PERFORMANCE_TARGET
        },
        overall: carbonStatus.status === 'good' && metrics.sessionDuration < PERFORMANCE_TARGET ? 'excellent' : 'good'
    };
}

// ===== AUTO-INITIALIZATION =====
// Auto-initialize when loaded in browser
if (typeof window !== 'undefined') {
    // Initialize with default options
    window.EcoLearn = initEcoLearn();
    
    // Make utilities available globally for debugging
    if (config.isDevelopment()) {
        window.EcoLearnDebug = {
            carbonTracker,
            config,
            apiService,
            authUtils,
            getCarbonStatus,
            getPerformanceMetrics,
            getGreenComputingStatus
        };
    }
}

// Export default initialization function
export default initEcoLearn;
