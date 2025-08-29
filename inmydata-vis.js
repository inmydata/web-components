import InmydataBase from './inmydata-base.js';

class InmydataVis extends InmydataBase {


    static get observedAttributes() {
        return this.getCommonObservedAttributes().concat(['vis-id', 'copilot-sequence', 'copilot-session', 'read-only', 'show-toolbar', 'show-tools', 'show-tool-toggle', 'subject', 'insight-id', 'insight-signature', 'question']);
    }

    render() {
        const id = this.getAttribute('vis-id') || '';
        const copilotSequence = this.getAttribute('copilot-sequence') || '';
        const copilotSession = this.getAttribute('copilot-session') || '';
        const readOnly = this.getAttribute('read-only') || false;
        const showToolbar = this.getAttribute('show-toolbar') || true;
        const showTools = this.getAttribute('show-tools') || true;
        const showToolToggle = this.getAttribute('show-tool-toggle') || true;
        const subject = this.getAttribute('subject') || '';
        const insightId = this.getAttribute('insight-id') || '';
        const insightSignature = this.getAttribute('insight-signature') || '';
        const question = this.getAttribute('question') || '';

        const { render } = this.getCommonAttributes();


        const url = this.createUrl("/vis");
        if (id.length > 0) url.searchParams.append('ID', id);
        if (copilotSequence.length > 0) url.searchParams.append('CopilotSequence', copilotSequence);
        if (copilotSession.length > 0) url.searchParams.append('CopilotSession', copilotSession);
        if (readOnly.length > 0) url.searchParams.append('ReadOnly', readOnly);
        if (showToolbar.length > 0) url.searchParams.append('ShowToolbar', showToolbar);
        if (showTools.length > 0) url.searchParams.append('ShowTools', showTools);
        if (showToolToggle.length > 0) url.searchParams.append('ShowToolToggle', showToolToggle);
        if (subject.length > 0) url.searchParams.append('Subject', subject);
        if (insightId.length > 0) url.searchParams.append('InsightID', insightId);
        if (insightSignature.length > 0) url.searchParams.append('InsightSignature', insightSignature);
        if (question.length > 0) url.searchParams.append('Question', question);

        if (render) this.renderIframe(url);
    }

    drilldownHandled(isHandled) {
        this.postMessage(JSON.stringify({DrilldownHandled: isHandled, ID: this.getAttribute('vis-id')}));
    }
}

export default InmydataVis;

customElements.define('inmydata-vis', InmydataVis);
