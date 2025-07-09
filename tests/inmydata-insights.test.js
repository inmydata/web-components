import InmydataInsights from '../inmydata-insights.js';
import { hasAnIFrame, correctIFrameSrc, callsFunction, hasCommonObservedAttributes } from './commonTests.js';

describe('InmydataInsights', () => {
    let element;

    describe('Common functionality', () => {
        beforeEach(() => {
            element = document.createElement('inmydata-insights');
            element.setAttribute('tenant', 'test');
            document.body.appendChild(element);
        });

        afterEach(() => {
            document.body.removeChild(element);
            element.dispose();
        });

        it('calls createUrl', () => callsFunction('inmydata-insights', InmydataInsights.prototype, 'createUrl'));
        it('calls renderIframe', () => callsFunction('inmydata-insights', InmydataInsights.prototype, 'renderIframe'));
        it('calls getCommonAttributes', () => callsFunction('inmydata-insights', InmydataInsights.prototype, 'getCommonAttributes'));
    });
    
    beforeEach(() => {
        element = document.createElement('inmydata-insights');
    });
    
    it('has the correct observed attributes', () => {
        const observedAttributes = InmydataInsights.observedAttributes;
        
        hasCommonObservedAttributes(observedAttributes);

        expect(observedAttributes).toContain('subject');
        expect(observedAttributes).toContain('filter');
        expect(observedAttributes).toContain('dimensions');
        expect(observedAttributes).toContain('metrics');
    });
    
    it('has an iframe', () => hasAnIFrame(element));

    it('sets the correct iframe src', () => correctIFrameSrc(element, 'insights'));

    it('sets the Subject query string parameter', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('subject', 'testSubject');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('Subject=testSubject');
    });

    it('sets the Filter query string parameter', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('filter', 'testFilter');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('Filter=testFilter');
    });

    it('sets multiple Dimension query string parameters', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('dimensions', 'dim1, dim2');
        document.body.appendChild(element);
        const src = element.shadowRoot.querySelector('iframe').src;
        expect(src).toContain('Dimension=dim1');
        expect(src).toContain('Dimension=dim2');
    });

    it('sets multiple Metric query string parameters', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('metrics', 'metric1, metric2');
        document.body.appendChild(element);
        const src = element.shadowRoot.querySelector('iframe').src;
        expect(src).toContain('Metric=metric1');
        expect(src).toContain('Metric=metric2');
    });
});
