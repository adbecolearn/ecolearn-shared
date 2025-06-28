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
     * User logout
     * @returns {Promise<Object>} Logout response
     */
    async logout() {
        return this.api.post('/auth/logout');
    }

    /**
     * Password reset request
     * @param {string} email User email
     * @returns {Promise<Object>} Reset response
     */
    async requestPasswordReset(email) {
        return this.api.post('/auth/reset-password', { email });
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
     * @param {Object} filters Query filters
     * @returns {Promise<Object>} Chat history
     */
    async getAIChatHistory(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return this.api.get(`/ai/chat/history${queryString ? `?${queryString}` : ''}`);
    }

    /**
     * Get AI model status
     * @returns {Promise<Object>} AI models status
     */
    async getAIModelStatus() {
        return this.api.get('/ai/models/status');
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
