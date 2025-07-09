import InmydataCopilot from '../inmydata-copilot.js';
import { hasAnIFrame, correctIFrameSrc, callsFunction, hasCommonObservedAttributes } from './commonTests.js';

describe('InmydataCopilot', () => {
    let element;

    describe('Common functionality', () => {

        beforeEach(() => {
            element = document.createElement('inmydata-copilot');
            element.setAttribute('tenant', 'test');
            document.body.appendChild(element);
        });

        afterEach(() => {
            document.body.removeChild(element);
            element.dispose();
        });

        it('calls createUrl', () => callsFunction('inmydata-copilot', InmydataCopilot.prototype, 'createUrl'));
        it('calls renderIframe', () => callsFunction('inmydata-copilot', InmydataCopilot.prototype, 'renderIframe'));
        it('calls getCommonAttributes', () => callsFunction('inmydata-copilot', InmydataCopilot.prototype, 'getCommonAttributes'));
        //it('calls getCommonObservedAttributes', () => callsFunction('inmydata-copilot', InmydataCopilot.prototype, 'getCommonObservedAttributes')); //TODO: not sure how to spy on a static method in the base class
    });
    
    beforeEach(() => {
        element = document.createElement('inmydata-copilot');
    });
    
    it('has the correct observed attributes', () => {
        const observedAttributes = InmydataCopilot.observedAttributes;
        
        hasCommonObservedAttributes(observedAttributes);

        expect(observedAttributes).toContain('subject');
        expect(observedAttributes).toContain('question');
    });
    
    it('has an iframe', () => hasAnIFrame(element));

    it('sets the correct iframe src', () => correctIFrameSrc(element, 'copilot'));

    it('sets the Subject query string parameters with the attribute values', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('subject', 'subject');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('subject=subject');
    });

    it('sets the Question query string parameters with the attribute values', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('question', 'question');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('question=question');
    });
});