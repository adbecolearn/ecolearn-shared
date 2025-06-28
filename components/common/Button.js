/**
 * Green Computing Optimized Button Component
 * Minimal footprint, maximum efficiency
 */

class EcoButton {
  constructor(options = {}) {
    this.options = {
      text: options.text || 'Button',
      type: options.type || 'primary',
      size: options.size || 'medium',
      disabled: options.disabled || false,
      onClick: options.onClick || (() => {}),
      trackCarbon: options.trackCarbon !== false, // Default true
      ...options
    };
    
    this.element = null;
    this.carbonTracker = null;
    
    this.init();
  }

  init() {
    this.createElement();
    this.attachEvents();
    
    if (this.options.trackCarbon) {
      this.initCarbonTracking();
    }
  }

  createElement() {
    this.element = document.createElement('button');
    this.element.className = this.getClasses();
    this.element.textContent = this.options.text;
    this.element.disabled = this.options.disabled;
    
    // Add data attributes for analytics
    this.element.setAttribute('data-component', 'eco-button');
    this.element.setAttribute('data-type', this.options.type);
  }

  getClasses() {
    const baseClass = 'eco-btn';
    const typeClass = `eco-btn--${this.options.type}`;
    const sizeClass = `eco-btn--${this.options.size}`;
    const disabledClass = this.options.disabled ? 'eco-btn--disabled' : '';
    
    return [baseClass, typeClass, sizeClass, disabledClass]
      .filter(Boolean)
      .join(' ');
  }

  attachEvents() {
    this.element.addEventListener('click', (event) => {
      if (this.options.disabled) return;
      
      // Track carbon footprint for interaction
      if (this.carbonTracker) {
        this.carbonTracker.trackInteraction('button_click', {
          type: this.options.type,
          timestamp: Date.now()
        });
      }
      
      this.options.onClick(event);
    });
  }

  async initCarbonTracking() {
    try {
      const { CarbonTracker } = await import('../../utils/green/carbon-tracker.js');
      this.carbonTracker = new CarbonTracker();
    } catch (error) {
      console.warn('Carbon tracking not available:', error);
    }
  }

  // Public methods
  setText(text) {
    this.options.text = text;
    this.element.textContent = text;
  }

  setDisabled(disabled) {
    this.options.disabled = disabled;
    this.element.disabled = disabled;
    this.element.className = this.getClasses();
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.carbonTracker = null;
  }

  render(container) {
    if (container && this.element) {
      container.appendChild(this.element);
    }
    return this.element;
  }
}

export { EcoButton };
export default EcoButton;
