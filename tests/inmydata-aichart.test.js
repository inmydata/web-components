import { jest, expect, describe, it, beforeEach, afterEach } from '@jest/globals';
import InmydataAiChart from '../inmydata-aichart.js';
import { hasAnIFrame, correctIFrameSrc, callsFunction, hasCommonObservedAttributes } from './commonTests.js';

describe('InmydataAiChart', () => {
    let element;

    describe('Common functionality', () => {
        beforeEach(() => {
            element = document.createElement('inmydata-aichart');
            element.setAttribute('tenant', 'test');
            document.body.appendChild(element);
        });

        afterEach(() => {
            document.body.removeChild(element);
            element.dispose();
        });

        it('calls createUrl', () => callsFunction('inmydata-aichart', InmydataAiChart.prototype, 'createUrl'));
        it('calls renderIframe', () => callsFunction('inmydata-aichart', InmydataAiChart.prototype, 'renderIframe'));
        it('calls getCommonAttributes', () => callsFunction('inmydata-aichart', InmydataAiChart.prototype, 'getCommonAttributes'));
    });
    
    beforeEach(() => {
        element = document.createElement('inmydata-aichart');
    });
    
    it('has the correct observed attributes', () => {
        const observedAttributes = InmydataAiChart.observedAttributes;
        
        hasCommonObservedAttributes(observedAttributes);

        expect(observedAttributes).toContain('read-only');
        expect(observedAttributes).toContain('show-toolbar');
        expect(observedAttributes).toContain('show-tools');
        expect(observedAttributes).toContain('show-tool-toggle');
        expect(observedAttributes).toContain('suppress-drilldown');
    });
    
    it('has an iframe', () => hasAnIFrame(element));

    it('sets the correct iframe src', () => correctIFrameSrc(element, 'aichart'));

    it('sets the ReadOnly query string parameter with the attribute values', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('read-only', 'true');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('ReadOnly=true');
    });

    it('sets the ShowToolbar query string parameter with the attribute values', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('show-toolbar', 'true');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('ShowToolbar=true');
    });

    it('sets the ShowTools query string parameter with the attribute values', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('show-tools', 'true');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('ShowTools=true');
    });

    it('sets the ShowToolToggle query string parameter with the attribute values', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('show-tool-toggle', 'true');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('ShowToolToggle=true');
    });

    it('sets the SuppressDrilldown query string parameter with the attribute values', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('suppress-drilldown', 'true');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('SuppressDrilldown=true');
    });
});
