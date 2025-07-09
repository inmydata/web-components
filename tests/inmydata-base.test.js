import InmydataBase from '../inmydata-base.js';

class InmydataBaseTest extends InmydataBase {  render() {} }

customElements.define('inmydata-base-test', InmydataBaseTest);

describe('InmydataBase', () => {
    let element, instance;
    


    describe('Common Attributes', () => {

        beforeEach(() => {  
            element = document.createElement('inmydata-base-test');
            element.setAttribute('tenant', 'test-tenant');
            document.body.appendChild(element);
        });
    
        afterEach(() => {
            document.body.removeChild(element);
            element.setAttribute('tenant', '');
            element.setAttribute('domain', '');
            element.dispose();
        });
    

        it('requires the tenant attribute', () => {
            expect(() => element.validateTenant("")).toThrow('You must provide a value for the tenant attribute');
        });

        test('url does not contain tenant name if domain is localhost', () => {

            element.setAttribute('domain', 'localhost:53124');
            const url = element.createUrl('/test');
            expect(url.toString()).toMatch(/^https:\/\/localhost:53124\/test/);
        });

        test('url contains tenant name if domain is not localhost', () => { 
            element.setAttribute('domain', 'test-inmydata.com');
            const url = element.createUrl('/test');
            expect(url.toString()).toMatch(/^https:\/\/test-tenant\.test-inmydata\.com\/test/);
        });

        test('should get default common attributes', () => {
            const attrs = element.getCommonAttributes();
            expect(attrs).toEqual({
                tenant: 'test-tenant',
                domain: "inmydata.com",
                width: '100%',
                height: '100%',
                render: true,
                suppressDrilldown: false,
                demo: false
            });
        });

        test('should get custom common attributes', () => {
            element.setAttribute('domain', 'test-inmydata.com');
            const attrs = element.getCommonAttributes();
            expect(attrs.tenant).toBe('test-tenant');
            expect(attrs.domain).toBe('test-inmydata.com');
        });

        test('url contains Suppress Drilldown parameter', () => {
            element.setAttribute('suppress-drilldown', 'true');
            const url = element.createUrl('/test');
            expect(url.toString()).toContain('SuppressDrilldown=true');
        });

        test('url contains demo parameter', () => {
            element.setAttribute('demo', 'true');
            const url = element.createUrl('/test');
            expect(url.toString()).toContain('demo=true');
        });

    });

    describe('URL', () => {
        
        it('points to the production cluster if the domain attribute is not set', () => {
            element.setAttribute('tenant', 'test');  
            expect(element.createUrl('').toString()).toContain('https://test.inmydata.com/');
        } );

        it('points to the domain if the domain attribute is set to test', () => {
            element.setAttribute('tenant', 'test');
            element.setAttribute('domain', 'test-inmydata.com');  
            expect(element.createUrl('').toString()).toContain('https://test.test-inmydata.com/');
        }); 
    });

    describe("Events", () => {
        beforeEach(() => {
            instance = new InmydataBaseTest();
            instance.setAttribute('tenant', 'test-tenant');
            //element = document.createElement('inmydata-base-test');
            //element.setAttribute('tenant', 'test-tenant');
        });
    
        test('event is emitted', () => {
             const dispatchSpy = jest.spyOn(instance,'dispatchEvent');

             const mockPostMessageEvent = {
                origin: 'https://test-tenant.inmydata.com',
                data: 'inmydata.test-event:{"data":"test"}'
            };

            instance.handleMessages();

             // Simulate message event
            window.dispatchEvent(new MessageEvent('message', mockPostMessageEvent));

            expect(dispatchSpy.mock.calls[0][0].type).toEqual('inmydata.test-event');
            expect(dispatchSpy.mock.calls[0][0].detail).toEqual({"data":"test"});


        });

        test('event is not emitted if event name is invalid', () => {
            const dispatchSpy = jest.spyOn(instance,'dispatchEvent');

            let mockErrorFunc = jest.fn(); //mock the error function to suppress the error thrown - it can't be caught as it is thrown out of sync inside the event listener
            let originalErrorFunc = instance.constructor.__proto__.prototype.error;
            instance.constructor.__proto__.prototype.error = mockErrorFunc;

            const mockPostMessageEvent = {
                origin: 'https://xyz.com',
                data: 'invalid-event:{"data":"test"}'
            };

            instance.handleMessages();

            // Simulate message event
            window.dispatchEvent(new MessageEvent('message', mockPostMessageEvent));

            expect(dispatchSpy).not.toHaveBeenCalled();

            instance.constructor.__proto__.prototype.error = originalErrorFunc;
        });



    });

    describe('Error Handling', () => {
        let instance;
        beforeEach(() => {
            instance = new InmydataBaseTest();
        });

        test('should format error message with component name', () => {
            expect(() => instance.error('test error')).toThrow('[inmydata-base-test]: test error');
        });

        test('error is thrown if origin is invalid', () => {
            let mockErrorFunc = jest.fn(); //mock the error function to suppress the error thrown - it can't be caught as it is thrown out of sync inside the event listener
            let originalErrorFunc = instance.constructor.__proto__.prototype.error;
            instance.constructor.__proto__.prototype.error = mockErrorFunc;
        

            const mockPostMessageEvent = {
                origin: 'https://invalid-domain.com',
                data: 'test-event:{"data":"test"}'
            };

                instance.handleMessages();
    
                window.dispatchEvent(new MessageEvent('message', mockPostMessageEvent));
                expect(mockErrorFunc).toHaveBeenCalled();
                

                instance.constructor.__proto__.prototype.error = originalErrorFunc;
         
        });
    });

    describe('Rendering', () => {
        let element;

        beforeEach(() => {  
            element = document.createElement('inmydata-base-test');
            element.setAttribute('tenant', 'test-tenant');
            document.body.appendChild(element);
        });

        afterEach(() => {   
            document.body.removeChild(element);
            element.dispose();
        });

        it ('does not render if render attribute is false', () => {
            element.setAttribute('tenant', 'test');
            element.setAttribute('render', 'false');
            document.body.appendChild(element);
            expect(element.shadowRoot.querySelector('iframe')).toBeNull();
        });
    });
});
