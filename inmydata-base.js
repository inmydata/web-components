/**
 * Base class for inmydata custom elements.
 * Provides common functionality for handling attributes, rendering iframes, and message handling.
 */
export default class InmydataBase extends HTMLElement {
    constructor() {
        super();
        // Attach a shadow DOM to the element
        this.attachShadow({ mode: 'open' });
        // Convert the class name to kebab-case (as per the component name) for use in error messages
        this.componentName = this.constructor.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

        this.componentId = this.uuidv4();
    }

    uuidv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
          (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
      }

    /**
     * Called when the element is added to the DOM.
     * Sets up message handling and renders the element.
     */
    connectedCallback() {
        this.handleMessages();

        //delay rendering until another component has logged in ('showLogin = false' means don't render yet).  See listenForLoggedIn() for more details.
        if (this.getCommonAttributes().showLogin === true)
        {
            this._render();
        }
        else
        {
            this.renderPlaceholder();
            this.listenForLoggedIn();
        }

    }

    /**
     * Called when an observed attribute is changed.
     * Re-renders the element.
     */
    attributeChangedCallback(name) {
        if (this._rendered) this.render();
    }

    /**
     * Retrieves common attributes from the element.
     * @returns {Object} An object containing common attributes.
     */
    getCommonAttributes() {
        const renderAttribute = this.getAttribute('render')?.toLowerCase();
        const render = renderAttribute === 'false' || renderAttribute === false  ? false : true;

        return {
            tenant: this.getAttribute('tenant'),
            domain: this.getAttribute('domain') || 'inmydata.com',
            width: this.getAttribute('width') || '100%',
            height: this.getAttribute('height') || '100%',
            render: renderAttribute ? render : true,
            suppressDrilldown: this.getAttribute('suppress-drilldown')|| false,
            demo: this.getAttribute('demo') || false,
            showLogin: this.getAttribute('show-login') === "false" ? false : true,
            modalDialog: this.getAttribute('modal-dialog') === "true" ? true : false
        };
    }

    static getCommonObservedAttributes() {
        return ['tenant','render','suppress-drilldown'];
    }

    /**
     * Validates that the tenant attribute is provided.
     * @param {string} tenant - The tenant attribute value.
     * @throws {TypeError} If the tenant attribute is not provided.
     */
    validateTenant(tenant) {
        if (!tenant) {
            throw new TypeError('You must provide a value for the tenant attribute');
        }
    }

    /**
     * Creates a URL for the iframe source.
     * @param {string} path - The path for the URL.
     * @returns {URL} The constructed URL.
     */
    createUrl(path) {
        const { tenant, domain, suppressDrilldown, demo } = this.getCommonAttributes();
        let url;


        if (domain.toLowerCase().indexOf("localhost") == 0) 
            url = new URL(path,`https://${domain}`);
        else {
            this.validateTenant(tenant);
            url =  new URL(path, `https://${tenant}.${domain}`);
        }

        if (demo){
            //automatically log the user in as the demo user, for the demo tenant only
            url.searchParams.append('demo', demo);
        }

        url.searchParams.append('WebComponentID', this.componentId);

        if (suppressDrilldown) {
            url.searchParams.append('SuppressDrilldown', suppressDrilldown);
        }


        return url;
    }

    /**
     * Renders an iframe with the specified URL and title.
     * @param {URL} url - The URL for the iframe source.
     * @param {string} title - The title for the iframe.
     */
    renderIframe(url, title) {
        const { width, height, modalDialog } = this.getCommonAttributes();

        const dialogOpen = modalDialog ? `<dialog>` : '';
        const dialogClose = modalDialog ? `</dialog>` : '';
        const closeButton = modalDialog ? `<span role="button" aria-label="Close dialog" class="close-button">X</span>` : '';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    ${this._getHostStyle(width,height)}
                }
                iframe {
                    width: ${width};
                    height: ${height};
                    border: none;
                    margin: 0;
                    padding: 0;
                }
                dialog {
                    width: 90%;
                    height: 90%;
                    padding:10px;
                    overflow: hidden;
                }
                .close-button {
                    float: right;
                    cursor: pointer;
                }
            </style>
            ${dialogOpen}
            ${closeButton}
            <iframe
                src="${url.toString()}"
                title="${title}"
                allow="microphone"
            ></iframe>
            ${dialogClose}
        `;

        if (modalDialog) {
            this.dialog = this.shadowRoot.querySelector('dialog');

            //add an event listener to close the dialog when the escape key is pressed
            const closeOnEscape = (event) => {
                    if (event.key === 'Escape' || event.code === 'Escape') {
                        this.dialog.close();
                        this.emit('inmydata.dialog.close');
                    }
                };

            //add an event listener to close the dialog when the escape key is pressed
            window.addEventListener('keydown', closeOnEscape);

            this.shadowRoot.querySelector('.close-button').addEventListener('click', (e) => {
                 this.dialog.close();
                 this.emit('inmydata.dialog.close');
            });

            this.dialog.close();    
                    }
    }

    /**
     * Sets up message handling for the element.
     * Listens for messages from the iframe and emits custom events.
     */
    handleMessages() {


        window.addEventListener(
            "message",
            this.boundMessageListener,
            false,
        );


    }

    boundMessageListener = this.messageListener.bind(this);

    messageListener(event) {
        const attributes = this.getCommonAttributes();
        const { tenant, domain } = attributes;
        
        // Validate the origin of the message
        if (event.origin.indexOf(`https://${tenant}.${domain}`) !== 0) {
            //this.error("INVALID ORIGIN: " + event.origin);
            return;
        }

        // Parse the message and emit a custom event
        let messageParts = event.data.split(':');
        if (messageParts.length < 2 || messageParts[0].indexOf("inmydata.") != 0) {
            //ensure only inmydata messages are emitted
            return;
        }
        let data = JSON.parse(event.data.replace(messageParts[0] + ':', ''));
        let eventName = messageParts[0];
        this.emit(eventName, data);
    }

    /**
     * Emits a custom event.
     * @param {string} type - The event type.
     * @param {Object} detail - Any details to pass along with the event.
     * @returns {boolean} Whether the event was canceled.
     */
    emit(type, detail = {}) {
        // Create a new event
        let event = new CustomEvent(type.toLowerCase(), {
            bubbles: true,
            cancelable: true,
            detail: detail
        });

        // Dispatch the event
        return this.dispatchEvent(event);
    }

    postMessage(message) {
        const attributes = this.getCommonAttributes();
        const { tenant, domain } = attributes;


        const iframe = this.shadowRoot.querySelector('iframe');
        iframe.contentWindow.postMessage(message, `https://${tenant}.${domain}`);
    }

    refresh() {
        const iframe = this.shadowRoot.querySelector('iframe');
        iframe.src = iframe.src;
    }

    /**
     * Throws an error with a formatted message.
     * @param {string} message - The error message.
     * @throws {Error} The formatted error.
     */
    error(message) {
        throw new Error(`[${this.componentName}]: ${message}`);
    }

    listenForLoggedIn(){
        //listen for 'logged in' events on other components and automatically refresh this component to removed the login prompt
        window.addEventListener("load", () => {
            var thisName = this.tagName.toLowerCase();
            var visId = this.getAttribute('vis-id');
            var dashId = this.getAttribute('dashboard-id'); 
            var visComponents, dashComponents;
            if (thisName != 'inmydata-vis'){
                visComponents = document.querySelectorAll('inmydata-vis'); //other vis components
            }
            else{
                visComponents = document.querySelectorAll('inmydata-vis[vis-id^="' + visId + '"]'); //other vis components
            }
           
            if (thisName != 'inmydata-dashboard'){
                dashComponents = document.querySelectorAll('inmydata-dashboard'); //other dashboard components
            }
            else{
                dashComponents = document.querySelectorAll('inmydata-dashboard[dashboard-id^="' + dashId + '"]'); //other dashboard components
            }
            
            if (thisName != 'inmydata-copilot')
            {
                //only listen for other copilots if this isn't a copilot itself - we're not likely to have two copilots, and they can't be individually identified
                let copilot = document.querySelector('inmydata-copilot'); //other copilot components
                if (copilot) copilot.addEventListener('inmydata.loggedin', (event) => {  
                       // this.refresh();
                       this._render();
                    });
               
            }

            if (thisName != 'inmydata-insights'){
                //only listen for other insights if this isn't an insights itself - we're not likely to have two insights, and they can't be individually identified
                let insight = document.querySelector('inmydata-insights'); //other insight components
       
                if (insight) insight.addEventListener('inmydata.loggedin', (event) => {  
                       // this.refresh();
                       this._render();
                    });
                
            }
            
            visComponents.forEach((vis) => {
                vis.addEventListener('inmydata.loggedin', (event) => {  
                   // this.refresh();
                   this._render();
                });
            });

            dashComponents.forEach((dash) => {
                dash.addEventListener('inmydata.loggedin', (event) => {  
                   // this.refresh();
                   this._render();
                });
            });
        });
    }

    _getHostStyle(width,height) {
        return `
            display: block;
            width: ${width};
            height: ${height};
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
        `;
    }   

    _render() {
        this.removePlaceholder();
        this.render();
        this._rendered = true;
    }

    renderPlaceholder(){
        const { width, height } = this.getCommonAttributes();
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                ${this._getHostStyle(width,height)}
            }

            .inmydata-placeholder {
                height:1em;
                margin:auto;
            }

        </style>
        <div class="inmydata-placeholder">
            Waiting for login...
        </div>
    `;
    }

    removePlaceholder(){
        this.shadowRoot.innerHTML = ``;
    }

    openModal(){
        this.dialog?.showModal();
    }

    closeModal(){
        this.dialog?.close();
    }

    dispose() {
        window.removeEventListener(
            "message",
            this.boundMessageListener,
            false,
        );
    }
}
