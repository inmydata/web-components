import InmydataBase from './inmydata-base.js';

class InmydataDashboard extends InmydataBase {
    static get observedAttributes() {
        return this.getCommonObservedAttributes().concat(['dashboard-id', 'tab', 'show-toolbar']);
    }

    render() {
        const id = this.getAttribute('dashboard-id') || '';
        const tab = this.getAttribute('tab') || ''; //index of the tab to show, starting at 1 for the leftmost tab.
        const showToolbar = this.getAttribute('show-toolbar') || '';
        const { render } = this.getCommonAttributes();

        const url = this.createUrl("/dashboard");
        if (id.length > 0) url.searchParams.append('DashboardID', id);
        if (tab.length > 0) url.searchParams.append('Tab', tab);
        if (showToolbar.length > 0) url.searchParams.append('ShowToolbar', showToolbar);

        if (render)  this.renderIframe(url, "inmydata Dashboard");
    }

    drilldownHandled(isHandled, dashboardObjectId) {
        this.postMessage(JSON.stringify({DrilldownHandled: isHandled, ID: dashboardObjectId}));
    }
}

export default InmydataDashboard;

customElements.define('inmydata-dashboard', InmydataDashboard);
