/**
 * 🌱 EcoLearn Carbon Tracker
 * Real-time carbon footprint tracking untuk green computing
 */

import { config } from '../../config/Config.js';

export class CarbonTracker {
    constructor() {
        this.enabled = config.get('CARBON_TRACKING_ENABLED', true);
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.events = [];
        this.metrics = {
            totalEvents: 0,
            totalCarbonGrams: 0,
            totalEnergyJoules: 0,
            sessionDuration: 0
        };
        
        // Carbon coefficients (grams CO2 per unit)
        this.carbonCoefficients = {
            // Network operations
            api_request: 0.5,      // per request
            api_cache_hit: 0.01,   // per cache hit
            page_load: 2.0,        // per page load
            asset_load: 0.1,       // per asset (image, css, js)
            
            // User interactions
            button_click: 0.001,   // per click
            form_submit: 0.01,     // per form submission
            scroll: 0.0001,        // per scroll event
            typing: 0.0001,        // per keystroke
            
            // AI operations
            ai_chat: 5.0,          // per AI interaction
            ai_response: 3.0,      // per AI response
            
            // Data operations
            database_read: 0.1,    // per database read
            database_write: 0.2,   // per database write
            file_upload: 1.0,      // per file upload
            
            // Rendering operations
            dom_update: 0.001,     // per DOM update
            animation: 0.01,       // per animation frame
            chart_render: 0.1      // per chart render
        };

        this.init();
    }

    /**
     * Initialize carbon tracker
     */
    init() {
        if (!this.enabled) return;

        // Track page load
        this.track('page_load', {
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
        });

        // Setup periodic reporting
        this.setupPeriodicReporting();
        
        // Setup page unload tracking
        this.setupUnloadTracking();
        
        // Track performance metrics
        this.trackPerformanceMetrics();
    }

    /**
     * Generate unique session ID
     * @returns {string} Session ID
     */
    generateSessionId() {
        return `eco_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Track carbon footprint event
     * @param {string} eventType Type of event
     * @param {Object} data Event data
     * @param {number} customCarbon Custom carbon value (optional)
     */
    track(eventType, data = {}, customCarbon = null) {
        if (!this.enabled) return;

        const timestamp = Date.now();
        const carbonGrams = customCarbon || this.calculateCarbon(eventType, data);
        const energyJoules = this.calculateEnergy(carbonGrams);

        const event = {
            sessionId: this.sessionId,
            eventType,
            timestamp,
            data,
            carbonGrams,
            energyJoules,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        this.events.push(event);
        this.updateMetrics(event);

        // Log in development mode
        if (config.isDevelopment()) {
            console.log(`🌱 Carbon Track: ${eventType}`, {
                carbon: `${carbonGrams.toFixed(4)}g CO2`,
                energy: `${energyJoules.toFixed(4)}J`,
                data
            });
        }

        // Send to analytics if enabled
        if (config.get('CARBON_ANALYTICS_ENABLED')) {
            this.sendToAnalytics(event);
        }
    }

    /**
     * Calculate carbon footprint for event
     * @param {string} eventType Event type
     * @param {Object} data Event data
     * @returns {number} Carbon footprint in grams
     */
    calculateCarbon(eventType, data) {
        const baseCarbon = this.carbonCoefficients[eventType] || 0.001;
        
        // Apply multipliers based on data
        let multiplier = 1;
        
        if (data.duration) {
            // Scale by duration (milliseconds to seconds)
            multiplier *= (data.duration / 1000);
        }
        
        if (data.size) {
            // Scale by data size (bytes to KB)
            multiplier *= (data.size / 1024);
        }
        
        if (data.complexity) {
            // Scale by complexity factor
            multiplier *= data.complexity;
        }

        return baseCarbon * multiplier;
    }

    /**
     * Calculate energy consumption
     * @param {number} carbonGrams Carbon footprint in grams
     * @returns {number} Energy in joules
     */
    calculateEnergy(carbonGrams) {
        // Approximate conversion: 1g CO2 ≈ 2.5 joules
        return carbonGrams * 2.5;
    }

    /**
     * Update session metrics
     * @param {Object} event Carbon event
     */
    updateMetrics(event) {
        this.metrics.totalEvents++;
        this.metrics.totalCarbonGrams += event.carbonGrams;
        this.metrics.totalEnergyJoules += event.energyJoules;
        this.metrics.sessionDuration = Date.now() - this.startTime;
    }

    /**
     * Get current session metrics
     * @returns {Object} Session metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            sessionId: this.sessionId,
            averageCarbonPerEvent: this.metrics.totalEvents > 0 
                ? this.metrics.totalCarbonGrams / this.metrics.totalEvents 
                : 0,
            carbonPerMinute: this.metrics.sessionDuration > 0
                ? (this.metrics.totalCarbonGrams / this.metrics.sessionDuration) * 60000
                : 0
        };
    }

    /**
     * Get carbon budget status
     * @returns {Object} Budget status
     */
    getCarbonBudget() {
        const budgetPerSession = 10; // 10g CO2 per session
        const used = this.metrics.totalCarbonGrams;
        const remaining = Math.max(0, budgetPerSession - used);
        const percentage = (used / budgetPerSession) * 100;

        return {
            budget: budgetPerSession,
            used,
            remaining,
            percentage: Math.min(100, percentage),
            status: percentage > 90 ? 'critical' : percentage > 70 ? 'warning' : 'good'
        };
    }

    /**
     * Setup periodic reporting
     */
    setupPeriodicReporting() {
        // Report every 30 seconds
        setInterval(() => {
            if (this.events.length > 0) {
                this.reportMetrics();
            }
        }, 30000);
    }

    /**
     * Setup page unload tracking
     */
    setupUnloadTracking() {
        window.addEventListener('beforeunload', () => {
            this.track('page_unload', {
                sessionDuration: this.metrics.sessionDuration,
                totalEvents: this.metrics.totalEvents
            });
            this.reportMetrics();
        });
    }

    /**
     * Track performance metrics
     */
    trackPerformanceMetrics() {
        // Track when performance API is available
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                const timing = window.performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                
                this.track('performance_load', {
                    loadTime,
                    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                    firstPaint: timing.responseStart - timing.navigationStart
                });
            });
        }
    }

    /**
     * Send event to analytics
     * @param {Object} event Carbon event
     */
    async sendToAnalytics(event) {
        // For now, only track locally to avoid unnecessary API calls
        // Backend analytics are handled separately via /analytics/green endpoint
        if (this.enabled) {
            console.log('🌱 Carbon event tracked locally:', event.type, event.carbonGrams);
        }
    }

    /**
     * Report current metrics
     */
    reportMetrics() {
        const metrics = this.getMetrics();
        const budget = this.getCarbonBudget();
        
        if (config.isDevelopment()) {
            console.group('🌱 Carbon Footprint Report');
            console.log('Session ID:', metrics.sessionId);
            console.log('Total Carbon:', `${metrics.totalCarbonGrams.toFixed(4)}g CO2`);
            console.log('Total Energy:', `${metrics.totalEnergyJoules.toFixed(4)}J`);
            console.log('Events:', metrics.totalEvents);
            console.log('Duration:', `${(metrics.sessionDuration / 1000).toFixed(1)}s`);
            console.log('Budget Status:', budget.status, `(${budget.percentage.toFixed(1)}%)`);
            console.groupEnd();
        }
    }

    /**
     * Reset tracker
     */
    reset() {
        this.events = [];
        this.metrics = {
            totalEvents: 0,
            totalCarbonGrams: 0,
            totalEnergyJoules: 0,
            sessionDuration: 0
        };
        this.startTime = Date.now();
        this.sessionId = this.generateSessionId();
    }

    /**
     * Export session data
     * @returns {Object} Session data
     */
    exportData() {
        return {
            sessionId: this.sessionId,
            startTime: this.startTime,
            events: this.events,
            metrics: this.getMetrics(),
            budget: this.getCarbonBudget()
        };
    }
}

// Create singleton instance
export const carbonTracker = new CarbonTracker();

// Export for direct usage
export default carbonTracker;
