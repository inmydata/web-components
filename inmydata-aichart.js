import InmydataBase from './inmydata-base.js';

class InmydataAiChart extends InmydataBase {


    static get observedAttributes() {
        return this.getCommonObservedAttributes().concat(['read-only', 'show-toolbar', 'show-tools', 'show-tool-toggle']);
    }

    render() {
        const readOnly = this.getAttribute('read-only') || '';
        const showToolbar = this.getAttribute('show-toolbar') || '';
        const showTools = this.getAttribute('show-tools') || '';
        const showToolToggle = this.getAttribute('show-tool-toggle') || '';
              const { render } = this.getCommonAttributes();

        const url = this.createUrl("/aichart");
        if (readOnly.length > 0) url.searchParams.append('ReadOnly', readOnly);
        if (showToolbar.length > 0) url.searchParams.append('ShowToolbar', showToolbar);
        if (showTools.length > 0) url.searchParams.append('ShowTools', showTools);
        if (showToolToggle.length > 0) url.searchParams.append('ShowToolToggle', showToolToggle);

        if (render) this.renderIframe(url, "inmydata AI Chart");
    }
}

export default InmydataAiChart;

customElements.define('inmydata-aichart', InmydataAiChart);