import InmydataBase from './inmydata-base.js';

class InmydataAiChart extends InmydataBase {


    static get observedAttributes() {
        return this.getCommonObservedAttributes().concat(['read-only', 'show-toolbar', 'show-tools', 'show-tool-toggle','suppress-drilldown']);
    }

    render() {
        const readOnly = this.getAttribute('read-only') || '';
        const showToolbar = this.getAttribute('show-toolbar') || true;
        const showTools = this.getAttribute('show-tools') || true;
        const showToolToggle = this.getAttribute('show-tool-toggle') || true;
        const suppressDrilldown = this.getAttribute('suppress-drilldown') || '';
        
        const { render } = this.getCommonAttributes();

        const url = this.createUrl("/aichart");
        if (readOnly.length > 0) url.searchParams.append('ReadOnly', readOnly);
        if (typeof showToolbar === 'boolean' || showToolbar.length > 0) url.searchParams.append('ShowToolbar', showToolbar);
        if (typeof showTools === 'boolean' || showTools.length > 0) url.searchParams.append('ShowTools', showTools);
        if (typeof showToolToggle === 'boolean' || showToolToggle.length > 0) url.searchParams.append('ShowToolToggle', showToolToggle);
        if (suppressDrilldown.length > 0) url.searchParams.append('SuppressDrilldown', suppressDrilldown);

        if (render) this.renderIframe(url, "inmydata AI Chart");
    }
}

export default InmydataAiChart;

customElements.define('inmydata-aichart', InmydataAiChart);