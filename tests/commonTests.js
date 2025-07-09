import InmydataBase from '../inmydata-base.js';

export function hasAnIFrame(element) { 
    //return it('has an iframe', () => {
        //element = document.createElement('inmydata-copilot');
        element.setAttribute('tenant', 'test');
        document.body.appendChild(element);
        expect(element.shadowRoot.querySelector('iframe')).not.toBeNull();
    //});
}

export function correctIFrameSrc(element, route) {
    element.setAttribute('tenant', 'test');
    document.body.appendChild(element);
    expect(element.shadowRoot.querySelector('iframe').src).toMatch(new RegExp('^https:\\/\\/test\\.inmydata\\.com/' + regExpEscape(route)));
}   

/**
 * Escapes the given string for use in a regular expression.
 * @param {*} str 
 * @returns 
 */
export function regExpEscape(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
} 


export function iFrameSrcContains(element, toMatch, tenant = 'test', domain) {
    element.setAttribute('tenant', tenant);
    if (domain) element.setAttribute('domain', domain);
    document.body.appendChild(element);
    expect(element.shadowRoot.querySelector('iframe').src).toContain(toMatch);
}

export function callsFunction(elementName, prototype, functionName) {
    const spy = jest.spyOn(prototype, functionName);
    let element = document.createElement(elementName);
    element.setAttribute('tenant', 'test');
    document.body.appendChild(element);
    expect(spy).toHaveBeenCalled();

    document.body.removeChild(element);
    element.dispose();
}

export function callsStaticFunction(elementName, functionName)
{
    const mockStatic = jest.fn();
    const oldStatic = InmydataBase[functionName];
    InmydataBase[functionName] = mockStatic;

    const spy = jest.spyOn(InmydataBase, functionName);
    let element = document.createElement(elementName);
    element.setAttribute('tenant', 'test');
    document.body.appendChild(element);
    expect(mockStatic).toHaveBeenCalled();

    InmydataBase[functionName] = oldStatic;
    document.body.removeChild(element);
    element.dispose();
}

export function hasCommonObservedAttributes(attrs)
{
    expect(attrs).toEqual(expect.arrayContaining(['tenant','render']));
}