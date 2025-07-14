// Import Jest's expect
import { jest } from '@jest/globals';

// Mock customElements
window.customElements = {
    define: jest.fn(),
    get: jest.fn(),
    whenDefined: jest.fn()
};

// Mock Shadow DOM
if (!window.Element.prototype.attachShadow) {
    window.Element.prototype.attachShadow = function() {
        const div = document.createElement('div');
        this.shadowRoot = div;
        return div;
    };
}

// Add dispose method to Element prototype if it doesn't exist
if (!window.Element.prototype.dispose) {
    window.Element.prototype.dispose = function() {};
}
