import {IService, ServiceType, ServiceProvider, ArrayExtensions} from "..";
import {TService} from "../providers/ServiceProvider";

ArrayExtensions();

describe("getRequiredService", function() {


    interface ITestService extends IService {
    }

    type TTestService = TService & {
    }

    class TestService implements TTestService, ITestService {
        getType(): ServiceType {
            return "Service";
        }
    }
    
    test("byService", function () {
        const service = new TestService();
        ServiceProvider.addSingleton(service);
        const result = ServiceProvider.getRequiredService<TestService>("Service");
        expect(result).toEqual(service);
    });
    
    test("byServiceType", function () {
        const serviceType: ServiceType = "Service";
        const service: object = {};
        ServiceProvider.addSingleton(serviceType, service);
        const result: object = ServiceProvider.getRequiredService(serviceType);
        expect(result).toEqual(service);
    });
    
    test("byServiceName", function () {
        const service: object = {};
        ServiceProvider.addSingleton("Service", service);
        const result: object = ServiceProvider.getRequiredService("Service");
        expect(result).toEqual(service);
    });
    
    test("byServiceNameUsingNameOf", function () {
        const service: object = {};
        const serviceName: string = nameof<ITestService>();
        ServiceProvider.addSingleton(serviceName, service);
        const result: object = ServiceProvider.getRequiredService(nameof<ITestService>());
        expect(result).toEqual(service);
        expect("ITestService").toEqual(serviceName);
    });
    
    test("byServiceTypeWithCallback", function () {
        const serviceType: ServiceType = "Service";
        const service: object = {};
        ServiceProvider.addSingleton(serviceType, () => service);
        const result: object = ServiceProvider.getRequiredService(serviceType);
        expect(result).toEqual(service);
    });
    
    test("byServiceNameWithCallback", function () {
        const serviceName: string = "Service";
        const service: object = {};
        ServiceProvider.addSingleton(serviceName, () => service);
        const result: object = ServiceProvider.getRequiredService(serviceName);
        expect(result).toEqual(service);
    });
    
});