import InmydataDashboard from '../inmydata-dashboard.js';
import { hasAnIFrame, correctIFrameSrc, callsFunction, hasCommonObservedAttributes } from './commonTests.js';

describe('InmydataDashboard', () => {
    let element;

    describe('Common functionality', () => {
        beforeEach(() => {
            element = document.createElement('inmydata-dashboard');
            element.setAttribute('tenant', 'test');
            document.body.appendChild(element);
        });

        afterEach(() => {
            document.body.removeChild(element);
            element.dispose();
        });

        it('calls createUrl', () => callsFunction('inmydata-dashboard', InmydataDashboard.prototype, 'createUrl'));
        it('calls renderIframe', () => callsFunction('inmydata-dashboard', InmydataDashboard.prototype, 'renderIframe'));
        it('calls getCommonAttributes', () => callsFunction('inmydata-dashboard', InmydataDashboard.prototype, 'getCommonAttributes'));
    });

    beforeEach(() => {
        element = document.createElement('inmydata-dashboard');
    });

    it('has the correct observed attributes', () => {
        const observedAttributes = InmydataDashboard.observedAttributes;
        
        hasCommonObservedAttributes(observedAttributes);

        expect(observedAttributes).toContain('dashboard-id');
        expect(observedAttributes).toContain('tab');
        expect(observedAttributes).toContain('show-toolbar');
    });

    it('has an iframe', () => hasAnIFrame(element));

    it('sets the correct iframe src', () => correctIFrameSrc(element, 'dashboard'));

    it('sets the DashboardID query string parameter with the attribute value', () => {
        element.setAttribute('tenant', 'test');
        element.setAttribute('dashboard-id', 'test-id');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('DashboardID=test-id');
    });

    it('sets the Tab query string parameter with the attribute value', () => {
        element.setAttribute('tenant', 'test');
        element.setAttribute('tab', '2');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('Tab=2');
    });

    it('sets the ShowToolbar query string parameter with the attribute value', () => {
        element.setAttribute('tenant', 'test');
        element.setAttribute('show-toolbar', 'true');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('ShowToolbar=true');
    });
});