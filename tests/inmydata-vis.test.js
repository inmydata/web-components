import InmydataVis from '../inmydata-vis.js';
import { hasAnIFrame, correctIFrameSrc, callsFunction, hasCommonObservedAttributes } from './commonTests.js';

describe('InmydataVis', () => {
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

        it('calls createUrl', () => callsFunction('inmydata-vis', InmydataVis.prototype, 'createUrl'));
        it('calls renderIframe', () => callsFunction('inmydata-vis', InmydataVis.prototype, 'renderIframe'));
        it('calls getCommonAttributes', () => callsFunction('inmydata-vis', InmydataVis.prototype, 'getCommonAttributes'));
    });
    
    beforeEach(() => {
        element = document.createElement('inmydata-vis');
    });
    
    it('has the correct observed attributes', () => {
        const observedAttributes = InmydataVis.observedAttributes;
        
        hasCommonObservedAttributes(observedAttributes);

        expect(observedAttributes).toContain('subject');
        expect(observedAttributes).toContain('question');
        expect(observedAttributes).toContain('vis-id');
        expect(observedAttributes).toContain('copilot-sequence');
        expect(observedAttributes).toContain('copilot-session'); 
        expect(observedAttributes).toContain('read-only');
        expect(observedAttributes).toContain('show-toolbar');
        expect(observedAttributes).toContain('show-tools');
        expect(observedAttributes).toContain('show-tool-toggle');
        expect(observedAttributes).toContain('insight-id');
        expect(observedAttributes).toContain('insight-signature');
    });
    
    it('has an iframe', () => hasAnIFrame(element));

    it('sets the correct iframe src', () => correctIFrameSrc(element, 'vis'));

    it('sets the ID query string parameter with the attribute values', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('vis-id', 'id');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('ID=id');
    });

    it('sets the CopilotSequence query string parameter with the attribute values', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('copilot-sequence', '1');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('CopilotSequence=1');
    });

    it('sets the CopilotSession query string parameter with the attribute values', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('copilot-session', 'session1');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('CopilotSession=session1');
    });

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

    it('sets the Subject query string parameter with the attribute values', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('subject', 'test');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('Subject=test');
    });

    it('sets the InsightID query string parameter with the attribute values', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('insight-id', 'insight1');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('InsightID=insight1');
    });

    it('sets the InsightSignature query string parameter with the attribute values', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('insight-signature', 'sig123');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('InsightSignature=sig123');
    });

    it('sets the Question query string parameter with the attribute values', () => {     
        element.setAttribute('tenant', 'test');
        element.setAttribute('question', 'test');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe').src).toContain('Question=test');
    });

    test('message posted to iframe when handleDrilldown is called', () => {
        const postMessageSpy = jest.spyOn(element, 'postMessage');
        element.setAttribute('tenant', 'test');
        element.setAttribute('vis-id', 'id');
        document.body.appendChild(element);
        try
        {
            element.drilldownHandled(true);
        }
        catch (e)
        {
            console.log(e);
        }
        //TODO: would rather spy on window.postMessage, but contentWindow is null 
        expect(postMessageSpy).toHaveBeenCalledWith(JSON.stringify({DrilldownHandled:true, ID: 'id'}));
    });
});