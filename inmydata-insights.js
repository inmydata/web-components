import InmydataBase from './inmydata-base.js';

class InmydataInsights extends InmydataBase {
    static get observedAttributes() {
        return this.getCommonObservedAttributes().concat(['subject', 'filter', 'dimensions', 'metrics']);
    }

    render() {
        const subject = this.getAttribute('subject') || '';
        const filter = this.getAttribute('filter') || '';
        const dimensions = this.getAttribute('dimensions') || '';
        const metrics = this.getAttribute('metrics') || '';
        const { render } = this.getCommonAttributes();

        const url = this.createUrl("/insights");
        if (subject.length > 0) url.searchParams.append('Subject', subject);
        if (filter.length > 0) url.searchParams.append('Filter', filter);
        if (dimensions.length > 0) {
            dimensions.split(',').forEach(dimension => {
                url.searchParams.append('Dimension', dimension.trim());
            });
        }
        if (metrics.length > 0) {
            metrics.split(',').forEach(metric => {
                url.searchParams.append('Metric', metric.trim());
            });
        }

        if (render) this.renderIframe(url, "inmydata Insights");
    }
}

export default InmydataInsights;

customElements.define('inmydata-insights', InmydataInsights);
