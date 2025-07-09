import InmydataBase from './inmydata-base.js';

class InmydataCopilot extends InmydataBase {


    static get observedAttributes() {
        return this.getCommonObservedAttributes().concat(['subject', 'question']);
    }

    render() {
        const subject = this.getAttribute('subject') || '';
        const question = this.getAttribute('question') || '';
        const { render } = this.getCommonAttributes();

        const url = this.createUrl("/copilot");
        if (subject.length > 0) url.searchParams.append('subject', subject);
        if (question.length > 0) url.searchParams.append('question', question);

        if (render) this.renderIframe(url, "inmydata Copilot");
    }
}

export default InmydataCopilot;

customElements.define('inmydata-copilot', InmydataCopilot);
