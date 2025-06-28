/**
 * 🌱 EcoButton Component
 * Green-optimized button component dengan carbon tracking
 */

import { carbonTracker } from '../../utils/green/CarbonTracker.js';

export class EcoButton {
    constructor(options = {}) {
        this.options = {
            text: 'Button',
            variant: 'primary', // primary, secondary, success, warning, danger
            size: 'medium',     // small, medium, large
            disabled: false,
            loading: false,
            icon: null,
            onClick: null,
            className: '',
            id: null,
            type: 'button',
            ...options
        };
        
        this.element = null;
        this.clickCount = 0;
        this.createButton();
    }

    /**
     * Create button element
     */
    createButton() {
        this.element = document.createElement('button');
        this.element.type = this.options.type;
        
        // Set ID if provided
        if (this.options.id) {
            this.element.id = this.options.id;
        }
        
        // Build CSS classes
        const classes = [
            'eco-btn',
            `eco-btn--${this.options.variant}`,
            `eco-btn--${this.options.size}`,
            this.options.className
        ].filter(Boolean);
        
        this.element.className = classes.join(' ');
        
        // Set initial state
        this.updateContent();
        this.updateState();
        
        // Add event listeners
        this.setupEventListeners();
        
        // Track creation
        carbonTracker.track('component_create', {
            component: 'EcoButton',
            variant: this.options.variant,
            size: this.options.size
        });
    }

    /**
     * Update button content
     */
    updateContent() {
        let content = '';
        
        // Add loading spinner if loading
        if (this.options.loading) {
            content += '<span class="eco-btn__spinner"></span>';
        }
        
        // Add icon if provided
        if (this.options.icon && !this.options.loading) {
            content += `<span class="eco-btn__icon">${this.options.icon}</span>`;
        }
        
        // Add text
        if (this.options.text) {
            content += `<span class="eco-btn__text">${this.options.text}</span>`;
        }
        
        this.element.innerHTML = content;
    }

    /**
     * Update button state
     */
    updateState() {
        // Handle disabled state
        this.element.disabled = this.options.disabled || this.options.loading;
        
        // Update classes based on state
        this.element.classList.toggle('eco-btn--loading', this.options.loading);
        this.element.classList.toggle('eco-btn--disabled', this.options.disabled);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        this.element.addEventListener('click', (event) => {
            if (this.options.disabled || this.options.loading) {
                event.preventDefault();
                return;
            }
            
            this.handleClick(event);
        });
        
        // Add hover tracking for analytics
        this.element.addEventListener('mouseenter', () => {
            carbonTracker.track('button_hover', {
                buttonId: this.options.id,
                variant: this.options.variant,
                text: this.options.text
            });
        });
    }

    /**
     * Handle button click
     * @param {Event} event Click event
     */
    handleClick(event) {
        this.clickCount++;
        
        // Track carbon footprint
        carbonTracker.track('button_click', {
            buttonId: this.options.id,
            variant: this.options.variant,
            text: this.options.text,
            clickCount: this.clickCount
        });
        
        // Add visual feedback
        this.addClickFeedback();
        
        // Call onClick handler if provided
        if (typeof this.options.onClick === 'function') {
            this.options.onClick(event, this);
        }
    }

    /**
     * Add visual click feedback
     */
    addClickFeedback() {
        this.element.classList.add('eco-btn--clicked');
        
        // Remove feedback class after animation
        setTimeout(() => {
            this.element.classList.remove('eco-btn--clicked');
        }, 150);
    }

    /**
     * Set button text
     * @param {string} text New button text
     */
    setText(text) {
        this.options.text = text;
        this.updateContent();
    }

    /**
     * Set button icon
     * @param {string} icon New button icon
     */
    setIcon(icon) {
        this.options.icon = icon;
        this.updateContent();
    }

    /**
     * Set loading state
     * @param {boolean} loading Loading state
     */
    setLoading(loading) {
        this.options.loading = loading;
        this.updateContent();
        this.updateState();
        
        carbonTracker.track('button_loading_state', {
            buttonId: this.options.id,
            loading
        });
    }

    /**
     * Set disabled state
     * @param {boolean} disabled Disabled state
     */
    setDisabled(disabled) {
        this.options.disabled = disabled;
        this.updateState();
    }

    /**
     * Set button variant
     * @param {string} variant New variant
     */
    setVariant(variant) {
        // Remove old variant class
        this.element.classList.remove(`eco-btn--${this.options.variant}`);
        
        // Add new variant class
        this.options.variant = variant;
        this.element.classList.add(`eco-btn--${variant}`);
    }

    /**
     * Get button element
     * @returns {HTMLElement} Button element
     */
    getElement() {
        return this.element;
    }

    /**
     * Append button to parent element
     * @param {HTMLElement} parent Parent element
     */
    appendTo(parent) {
        parent.appendChild(this.element);
        return this;
    }

    /**
     * Remove button from DOM
     */
    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        carbonTracker.track('component_remove', {
            component: 'EcoButton',
            clickCount: this.clickCount
        });
    }

    /**
     * Focus button
     */
    focus() {
        this.element.focus();
    }

    /**
     * Blur button
     */
    blur() {
        this.element.blur();
    }

    /**
     * Get click statistics
     * @returns {Object} Click statistics
     */
    getStats() {
        return {
            clickCount: this.clickCount,
            variant: this.options.variant,
            size: this.options.size,
            disabled: this.options.disabled,
            loading: this.options.loading
        };
    }

    /**
     * Create button from HTML element
     * @param {HTMLElement} element Existing button element
     * @param {Object} options Button options
     * @returns {EcoButton} EcoButton instance
     */
    static fromElement(element, options = {}) {
        const button = new EcoButton({
            text: element.textContent,
            ...options
        });
        
        // Replace existing element
        element.parentNode.replaceChild(button.getElement(), element);
        
        return button;
    }

    /**
     * Create multiple buttons
     * @param {Array} buttonConfigs Array of button configurations
     * @returns {Array} Array of EcoButton instances
     */
    static createMultiple(buttonConfigs) {
        return buttonConfigs.map(config => new EcoButton(config));
    }
}

// Export for direct usage
export default EcoButton;
