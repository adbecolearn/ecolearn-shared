/**
 * Carbon Footprint Tracker for Green Computing
 * Tracks energy usage and carbon emissions
 */

class CarbonTracker {
  constructor(options = {}) {
    this.options = {
      apiEndpoint: options.apiEndpoint || '/api/carbon-tracking',
      batchSize: options.batchSize || 10,
      flushInterval: options.flushInterval || 30000, // 30 seconds
      enableRealTime: options.enableRealTime !== false,
      ...options
    };
    
    this.metrics = [];
    this.sessionId = this.generateSessionId();
    this.startTime = performance.now();
    this.lastFlush = Date.now();
    
    this.init();
  }

  init() {
    this.startPerformanceMonitoring();
    this.setupAutoFlush();
    this.trackPageLoad();
  }

  generateSessionId() {
    return `eco_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  startPerformanceMonitoring() {
    // Monitor CPU usage through performance API
    if ('performance' in window && 'measure' in performance) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackPerformanceEntry(entry);
        }
      });
      
      this.performanceObserver.observe({ 
        entryTypes: ['measure', 'navigation', 'resource'] 
      });
    }
  }

  trackPerformanceEntry(entry) {
    const carbonImpact = this.calculateCarbonImpact(entry);
    
    this.addMetric({
      type: 'performance',
      name: entry.name,
      duration: entry.duration,
      carbonImpact,
      timestamp: Date.now()
    });
  }

  calculateCarbonImpact(entry) {
    // Simplified carbon calculation based on performance metrics
    // Real implementation would use more sophisticated algorithms
    const baseCarbonPerMs = 0.0001; // grams CO2 per millisecond
    const networkMultiplier = entry.transferSize ? entry.transferSize / 1000 : 1;
    
    return (entry.duration * baseCarbonPerMs * networkMultiplier).toFixed(6);
  }

  trackPageLoad() {
    const loadTime = performance.now() - this.startTime;
    const carbonImpact = this.calculatePageLoadCarbon(loadTime);
    
    this.addMetric({
      type: 'page_load',
      duration: loadTime,
      carbonImpact,
      timestamp: Date.now(),
      url: window.location.href
    });
  }

  calculatePageLoadCarbon(loadTime) {
    // Page load carbon calculation
    const basePageCarbon = 0.5; // grams CO2 base
    const timeMultiplier = loadTime / 1000; // seconds
    
    return (basePageCarbon * timeMultiplier).toFixed(6);
  }

  trackInteraction(type, data = {}) {
    const interactionCarbon = this.calculateInteractionCarbon(type);
    
    this.addMetric({
      type: 'interaction',
      interactionType: type,
      carbonImpact: interactionCarbon,
      timestamp: Date.now(),
      ...data
    });
  }

  calculateInteractionCarbon(type) {
    // Different interactions have different carbon costs
    const carbonCosts = {
      'button_click': 0.001,
      'form_submit': 0.005,
      'api_call': 0.01,
      'file_upload': 0.1,
      'video_play': 0.5
    };
    
    return (carbonCosts[type] || 0.001).toFixed(6);
  }

  addMetric(metric) {
    metric.sessionId = this.sessionId;
    this.metrics.push(metric);
    
    // Auto-flush if batch size reached
    if (this.metrics.length >= this.options.batchSize) {
      this.flush();
    }
  }

  setupAutoFlush() {
    setInterval(() => {
      if (this.metrics.length > 0) {
        this.flush();
      }
    }, this.options.flushInterval);
    
    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush(true);
    });
  }

  async flush(isSync = false) {
    if (this.metrics.length === 0) return;
    
    const metricsToSend = [...this.metrics];
    this.metrics = [];
    
    const payload = {
      sessionId: this.sessionId,
      metrics: metricsToSend,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    try {
      if (isSync && navigator.sendBeacon) {
        // Use sendBeacon for synchronous sending on page unload
        navigator.sendBeacon(
          this.options.apiEndpoint,
          JSON.stringify(payload)
        );
      } else {
        await fetch(this.options.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      }
      
      this.lastFlush = Date.now();
    } catch (error) {
      console.warn('Failed to send carbon metrics:', error);
      // Re-add metrics to queue for retry
      this.metrics.unshift(...metricsToSend);
    }
  }

  getTotalCarbon() {
    return this.metrics.reduce((total, metric) => {
      return total + parseFloat(metric.carbonImpact || 0);
    }, 0).toFixed(6);
  }

  getSessionSummary() {
    const totalCarbon = this.getTotalCarbon();
    const sessionDuration = Date.now() - (this.startTime + performance.timeOrigin);
    
    return {
      sessionId: this.sessionId,
      totalCarbon: `${totalCarbon}g CO2`,
      sessionDuration: `${(sessionDuration / 1000).toFixed(2)}s`,
      metricsCount: this.metrics.length,
      lastFlush: new Date(this.lastFlush).toISOString()
    };
  }

  destroy() {
    this.flush(true);
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
  }
}

export { CarbonTracker };
export default CarbonTracker;
