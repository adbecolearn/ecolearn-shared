/**
 * 🎓 EcoLearn API Integration
 * Specific API methods untuk EcoLearn ecosystem
 */

import { apiService } from './ApiService.js';
import { config } from '../config/Config.js';

export class EcoLearnAPI {
    constructor() {
        this.api = apiService;
    }

    // ===== AUTHENTICATION ENDPOINTS =====

    /**
     * User login
     * @param {Object} credentials Login credentials
     * @returns {Promise<Object>} Login response
     */
    async login(credentials) {
        return this.api.post('/auth/login', credentials);
    }

    /**
     * User registration
     * @param {Object} userData User registration data
     * @returns {Promise<Object>} Registration response
     */
    async register(userData) {
        return this.api.post('/auth/register', userData);
    }

    /**
     * Refresh authentication token
     * @returns {Promise<Object>} Token refresh response
     */
    async refreshToken() {
        return this.api.post('/auth/refresh');
    }

    /**
     * Verify authentication token
     * @returns {Promise<Object>} Token verification response
     */
    async verifyToken() {
        return this.api.post('/auth/verify');
    }

    /**
     * User logout (client-side only)
     * @returns {Promise<Object>} Logout response
     */
    async logout() {
        // Clear local storage and redirect
        localStorage.removeItem('ecolearn_token');
        localStorage.removeItem('ecolearn_user');
        window.location.href = '/ecolearn-auth/';
        return { success: true, message: 'Logged out successfully' };
    }

    // ===== USER MANAGEMENT ENDPOINTS =====

    /**
     * Get current user profile
     * @returns {Promise<Object>} User profile
     */
    async getCurrentUser() {
        return this.api.get('/users/profile');
    }

    /**
     * Update user profile
     * @param {Object} profileData Profile update data
     * @returns {Promise<Object>} Update response
     */
    async updateProfile(profileData) {
        return this.api.put('/users/profile', profileData);
    }

    /**
     * Get all users (admin only)
     * @param {Object} filters Query filters
     * @returns {Promise<Object>} Users list
     */
    async getUsers(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return this.api.get(`/users${queryString ? `?${queryString}` : ''}`);
    }

    /**
     * Create new user (admin only)
     * @param {Object} userData User data
     * @returns {Promise<Object>} Creation response
     */
    async createUser(userData) {
        return this.api.post('/users', userData);
    }

    /**
     * Update user (admin only)
     * @param {string} userId User ID
     * @param {Object} userData User data
     * @returns {Promise<Object>} Update response
     */
    async updateUser(userId, userData) {
        return this.api.put(`/users/${userId}`, userData);
    }

    /**
     * Delete user (admin only)
     * @param {string} userId User ID
     * @returns {Promise<Object>} Delete response
     */
    async deleteUser(userId) {
        return this.api.delete(`/users/${userId}`);
    }

    // ===== STUDENT ENDPOINTS =====

    /**
     * Get student dashboard data
     * @returns {Promise<Object>} Dashboard data
     */
    async getStudentDashboard() {
        return this.api.get('/students/dashboard');
    }

    /**
     * Get student courses
     * @returns {Promise<Object>} Courses list
     */
    async getStudentCourses() {
        return this.api.get('/students/courses');
    }

    /**
     * Get student progress
     * @param {string} courseId Course ID (optional)
     * @returns {Promise<Object>} Progress data
     */
    async getStudentProgress(courseId = null) {
        const endpoint = courseId ? `/students/progress/${courseId}` : '/students/progress';
        return this.api.get(endpoint);
    }

    /**
     * Get student assignments
     * @param {Object} filters Query filters
     * @returns {Promise<Object>} Assignments list
     */
    async getStudentAssignments(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return this.api.get(`/students/assignments${queryString ? `?${queryString}` : ''}`);
    }

    /**
     * Submit assignment
     * @param {string} assignmentId Assignment ID
     * @param {Object} submissionData Submission data
     * @returns {Promise<Object>} Submission response
     */
    async submitAssignment(assignmentId, submissionData) {
        return this.api.post(`/students/assignments/${assignmentId}/submit`, submissionData);
    }

    // ===== AI CHAT ENDPOINTS =====

    /**
     * Send message to AI
     * @param {Object} messageData Message data
     * @returns {Promise<Object>} AI response
     */
    async sendAIMessage(messageData) {
        return this.api.post('/ai/chat', messageData);
    }

    /**
     * Get AI chat history
     * @returns {Promise<Object>} Chat history
     */
    async getAIChatHistory() {
        return this.api.get('/ai/history');
    }

    /**
     * Get available AI models
     * @returns {Promise<Object>} AI models list
     */
    async getAIModels() {
        return this.api.get('/ai/models');
    }

    /**
     * Analyze content with AI
     * @param {Object} analysisData Content analysis data
     * @returns {Promise<Object>} Analysis response
     */
    async analyzeContent(analysisData) {
        return this.api.post('/ai/analyze', analysisData);
    }

    /**
     * Configure AI model (admin only)
     * @param {string} modelId Model ID
     * @param {Object} config Model configuration
     * @returns {Promise<Object>} Configuration response
     */
    async configureAIModel(modelId, config) {
        return this.api.put(`/ai/models/${modelId}/config`, config);
    }

    // ===== EDUCATOR ENDPOINTS =====

    /**
     * Get educator dashboard data
     * @returns {Promise<Object>} Dashboard data
     */
    async getEducatorDashboard() {
        return this.api.get('/educators/dashboard');
    }

    /**
     * Get students under educator
     * @param {Object} filters Query filters
     * @returns {Promise<Object>} Students list
     */
    async getEducatorStudents(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return this.api.get(`/educators/students${queryString ? `?${queryString}` : ''}`);
    }

    /**
     * Get educator courses
     * @returns {Promise<Object>} Courses list
     */
    async getEducatorCourses() {
        return this.api.get('/educators/courses');
    }

    /**
     * Create assignment
     * @param {Object} assignmentData Assignment data
     * @returns {Promise<Object>} Creation response
     */
    async createAssignment(assignmentData) {
        return this.api.post('/educators/assignments', assignmentData);
    }

    /**
     * Get assignment submissions
     * @param {string} assignmentId Assignment ID
     * @returns {Promise<Object>} Submissions list
     */
    async getAssignmentSubmissions(assignmentId) {
        return this.api.get(`/educators/assignments/${assignmentId}/submissions`);
    }

    /**
     * Grade assignment submission
     * @param {string} submissionId Submission ID
     * @param {Object} gradeData Grade data
     * @returns {Promise<Object>} Grading response
     */
    async gradeSubmission(submissionId, gradeData) {
        return this.api.put(`/educators/submissions/${submissionId}/grade`, gradeData);
    }

    // ===== ADMIN ENDPOINTS =====

    /**
     * Get admin dashboard data
     * @returns {Promise<Object>} Dashboard data
     */
    async getAdminDashboard() {
        return this.api.get('/admin/dashboard');
    }

    /**
     * Get system health status
     * @returns {Promise<Object>} System health
     */
    async getSystemHealth() {
        return this.api.get('/admin/system/health');
    }

    /**
     * Get system analytics
     * @param {Object} filters Query filters
     * @returns {Promise<Object>} Analytics data
     */
    async getSystemAnalytics(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return this.api.get(`/admin/analytics${queryString ? `?${queryString}` : ''}`);
    }

    /**
     * Export system data
     * @param {Object} exportConfig Export configuration
     * @returns {Promise<Object>} Export response
     */
    async exportSystemData(exportConfig) {
        return this.api.post('/admin/export', exportConfig);
    }

    /**
     * Backup system
     * @returns {Promise<Object>} Backup response
     */
    async backupSystem() {
        return this.api.post('/admin/backup');
    }

    /**
     * Emergency stop all AI models
     * @returns {Promise<Object>} Emergency stop response
     */
    async emergencyStop() {
        return this.api.post('/admin/emergency-stop');
    }

    // ===== RESEARCH ENDPOINTS =====

    /**
     * Get research data
     * @param {Object} filters Query filters
     * @returns {Promise<Object>} Research data
     */
    async getResearchData(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return this.api.get(`/research/data${queryString ? `?${queryString}` : ''}`);
    }

    /**
     * Get experiment groups performance
     * @returns {Promise<Object>} Performance data
     */
    async getExperimentGroupsPerformance() {
        return this.api.get('/research/experiment-groups/performance');
    }

    /**
     * Generate research report
     * @param {Object} reportConfig Report configuration
     * @returns {Promise<Object>} Report response
     */
    async generateResearchReport(reportConfig) {
        return this.api.post('/research/reports/generate', reportConfig);
    }

    // ===== CARBON TRACKING ENDPOINTS =====

    /**
     * Get carbon metrics
     * @param {Object} filters Query filters
     * @returns {Promise<Object>} Carbon metrics
     */
    async getCarbonMetrics(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return this.api.get(`/carbon/metrics${queryString ? `?${queryString}` : ''}`);
    }

    /**
     * Track carbon footprint
     * @param {Object} carbonData Carbon tracking data
     * @returns {Promise<Object>} Tracking response
     */
    async trackCarbon(carbonData) {
        return this.api.post('/carbon/track', carbonData);
    }

    /**
     * Get carbon leaderboard
     * @returns {Promise<Object>} Leaderboard data
     */
    async getCarbonLeaderboard() {
        return this.api.get('/carbon/leaderboard');
    }

    // ===== ANALYTICS ENDPOINTS =====

    /**
     * Get learning progress analytics
     * @returns {Promise<Object>} Learning progress data
     */
    async getLearningProgress() {
        return this.api.get('/analytics/progress');
    }

    /**
     * Get green computing metrics
     * @returns {Promise<Object>} Green metrics data
     */
    async getGreenMetrics() {
        return this.api.get('/analytics/green');
    }

    /**
     * Get detailed learning analytics
     * @returns {Promise<Object>} Learning analytics data
     */
    async getLearningAnalytics() {
        return this.api.get('/analytics/learning');
    }

    /**
     * Get system analytics (admin only)
     * @returns {Promise<Object>} System analytics data
     */
    async getSystemAnalytics() {
        return this.api.get('/analytics/system');
    }

    // ===== COURSE ENDPOINTS =====

    /**
     * Get available courses
     * @returns {Promise<Object>} Courses list
     */
    async getCourses() {
        return this.api.get('/courses');
    }

    /**
     * Create new course (educator/admin only)
     * @param {Object} courseData Course data
     * @returns {Promise<Object>} Course creation response
     */
    async createCourse(courseData) {
        return this.api.post('/courses', courseData);
    }

    /**
     * Enroll in course
     * @param {string} courseId Course ID
     * @returns {Promise<Object>} Enrollment response
     */
    async enrollCourse(courseId) {
        return this.api.post('/courses/enroll', { course_id: courseId });
    }

    /**
     * Get user enrollments
     * @returns {Promise<Object>} Enrollments list
     */
    async getEnrollments() {
        return this.api.get('/courses/enrollments');
    }

    /**
     * Update course progress
     * @param {string} enrollmentId Enrollment ID
     * @param {number} progress Progress percentage
     * @param {number} energyUsed Energy used (optional)
     * @returns {Promise<Object>} Progress update response
     */
    async updateProgress(enrollmentId, progress, energyUsed = 0) {
        return this.api.put('/courses/progress', {
            enrollment_id: enrollmentId,
            progress: progress,
            energy_used: energyUsed
        });
    }

    // ===== UTILITY METHODS =====

    /**
     * Health check
     * @returns {Promise<Object>} Health status
     */
    async healthCheck() {
        return this.api.get('/health');
    }

    /**
     * Get API version
     * @returns {Promise<Object>} Version info
     */
    async getVersion() {
        return this.api.get('/version');
    }
}

// Create singleton instance
export const ecoLearnAPI = new EcoLearnAPI();

// Export for direct usage
export default ecoLearnAPI;
