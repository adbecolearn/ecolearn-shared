/**
 * 🔧 EcoLearn Configuration Management
 * Centralized configuration untuk semua micro frontend
 */

export class Config {
    constructor() {
        this.environment = this.detectEnvironment();
        this.config = this.loadConfig();
    }

    /**
     * Detect current environment
     * @returns {string} Environment name
     */
    detectEnvironment() {
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'development';
        } else if (hostname.includes('github.io')) {
            return 'production';
        } else if (hostname.includes('staging')) {
            return 'staging';
        }
        
        return 'production'; // Default to production
    }

    /**
     * Load configuration based on environment
     * @returns {Object} Configuration object
     */
    loadConfig() {
        const baseConfig = {
            // Application Info
            APP_NAME: 'EcoLearn',
            APP_VERSION: '1.0.0',
            
            // Green Computing
            CARBON_TRACKING_ENABLED: true,
            PERFORMANCE_MONITORING: true,
            BUNDLE_SIZE_LIMIT: 100000, // 100KB
            
            // UI Settings
            THEME: 'green',
            LANGUAGE: 'id',
            TIMEZONE: 'Asia/Jakarta',
            
            // Academic Settings
            INSTITUTION_NAME: 'Akademi Digital Bandung',
            EMAIL_DOMAIN: '@digitalbdg.ac.id',
            ACADEMIC_YEAR: '2024/2025',
            CURRENT_SEMESTER: '2024/2025-1',
            
            // Research Settings
            RESEARCH_MODE: true,
            EXPERIMENT_GROUPS: ['openai_gpt4', 'local_llama2', 'hybrid_adaptive', 'control_group'],
            TOTAL_STUDENTS: 300,
            
            // Security
            SESSION_TIMEOUT: 3600000, // 1 hour
            TOKEN_REFRESH_THRESHOLD: 300000, // 5 minutes
            
            // Performance
            API_TIMEOUT: 10000, // 10 seconds
            CACHE_DURATION: 300000, // 5 minutes
            
            // Analytics
            ANALYTICS_ENABLED: true,
            CARBON_ANALYTICS_ENABLED: true,
            RESEARCH_ANALYTICS_ENABLED: true
        };

        const environmentConfigs = {
            development: {
                API_BASE_URL: 'http://localhost:8080',
                DEBUG_MODE: true,
                CARBON_TRACKING_ENABLED: true,
                MOCK_DATA: true,
                LOG_LEVEL: 'debug'
            },
            
            staging: {
                API_BASE_URL: 'https://ecolearn-api-staging.run.app',
                DEBUG_MODE: true,
                CARBON_TRACKING_ENABLED: true,
                MOCK_DATA: false,
                LOG_LEVEL: 'info'
            },
            
            production: {
                API_BASE_URL: 'https://ecolearn-api-xxxxx-as.a.run.app',
                DEBUG_MODE: false,
                CARBON_TRACKING_ENABLED: true,
                MOCK_DATA: false,
                LOG_LEVEL: 'error'
            }
        };

        return {
            ...baseConfig,
            ...environmentConfigs[this.environment]
        };
    }

    /**
     * Get configuration value
     * @param {string} key Configuration key
     * @param {*} defaultValue Default value if key not found
     * @returns {*} Configuration value
     */
    get(key, defaultValue = null) {
        return this.config[key] ?? defaultValue;
    }

    /**
     * Set configuration value (runtime only)
     * @param {string} key Configuration key
     * @param {*} value Configuration value
     */
    set(key, value) {
        this.config[key] = value;
    }

    /**
     * Get all configuration
     * @returns {Object} Complete configuration object
     */
    getAll() {
        return { ...this.config };
    }

    /**
     * Check if feature is enabled
     * @param {string} feature Feature name
     * @returns {boolean} Feature status
     */
    isFeatureEnabled(feature) {
        const featureKey = `${feature.toUpperCase()}_ENABLED`;
        return this.get(featureKey, false);
    }

    /**
     * Get API endpoint URL
     * @param {string} endpoint Endpoint path
     * @returns {string} Complete URL
     */
    getApiUrl(endpoint = '') {
        const baseUrl = this.get('API_BASE_URL');
        return endpoint ? `${baseUrl}${endpoint}` : baseUrl;
    }

    /**
     * Get current environment
     * @returns {string} Environment name
     */
    getEnvironment() {
        return this.environment;
    }

    /**
     * Check if development mode
     * @returns {boolean} Development mode status
     */
    isDevelopment() {
        return this.environment === 'development';
    }

    /**
     * Check if production mode
     * @returns {boolean} Production mode status
     */
    isProduction() {
        return this.environment === 'production';
    }

    /**
     * Get green computing settings
     * @returns {Object} Green computing configuration
     */
    getGreenSettings() {
        return {
            carbonTracking: this.get('CARBON_TRACKING_ENABLED'),
            performanceMonitoring: this.get('PERFORMANCE_MONITORING'),
            bundleSizeLimit: this.get('BUNDLE_SIZE_LIMIT'),
            carbonAnalytics: this.get('CARBON_ANALYTICS_ENABLED')
        };
    }

    /**
     * Get academic settings
     * @returns {Object} Academic configuration
     */
    getAcademicSettings() {
        return {
            institutionName: this.get('INSTITUTION_NAME'),
            emailDomain: this.get('EMAIL_DOMAIN'),
            academicYear: this.get('ACADEMIC_YEAR'),
            currentSemester: this.get('CURRENT_SEMESTER'),
            totalStudents: this.get('TOTAL_STUDENTS')
        };
    }

    /**
     * Get research settings
     * @returns {Object} Research configuration
     */
    getResearchSettings() {
        return {
            researchMode: this.get('RESEARCH_MODE'),
            experimentGroups: this.get('EXPERIMENT_GROUPS'),
            totalStudents: this.get('TOTAL_STUDENTS'),
            analyticsEnabled: this.get('RESEARCH_ANALYTICS_ENABLED')
        };
    }
}

// Create singleton instance
export const config = new Config();

// Export for direct usage
export default config;
