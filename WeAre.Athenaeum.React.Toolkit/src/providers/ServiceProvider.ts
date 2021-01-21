import {Dictionary} from "typescript-collections";
import {IEnumProvider, ILocalizer} from "..";
import {ITransformProvider} from "./BaseTransformProvider";

export type ServiceType = string;

export type ServiceCallback = (serviceType: ServiceType) => IService | object | null;

export interface IService {

    /**
     * Gets the Type of the current instance.
     * @returns ServiceType - The exact runtime type of the current instance.
     */
    getType(): ServiceType;
}

export type TService = IService;

class ServiceProvider {
    
    private readonly _services: Dictionary<ServiceType, IService | object> = new Dictionary<ServiceType, IService | object>();
    
    /**
     * Gets the service object of the specified type.
     * @param serviceType - An object that specifies the type of service object to get.
     * @param resolve - if True then the service callback will be automatically resolved (invoked); if False, then the function will be returned.
     * @returns IService | object | null - A service object of type serviceType or null if there is no service object of type serviceType.
     */
    public getService<TService extends IService | object>(serviceType: ServiceType, resolve: boolean = true): TService | null {

        const service: IService | object | undefined = this._services.getValue(serviceType);

        return (service != null)
            ? ((resolve) && (typeof service === "function"))
                ? service(serviceType)
                : service as TService
            : null;
    }

    /**
     * Get service of type serviceType from the IServiceProvider.
     * @param serviceType - An object that specifies the type of service object to get.
     * @param resolve - if True then the service callback will be automatically resolved (invoked); if False, then the function will be returned.
     * @returns A service object of type serviceType.
     * @exception InvalidOperationException There is no service of type serviceType.
     */
    public getRequiredService<TService extends IService | object>(serviceType: ServiceType, resolve: boolean = true): TService {
        
        const service: TService | null = this.getService<TService>(serviceType, resolve);
        
        if (service == null)
            throw new Error(`InvalidOperationException. There is no service of type "${serviceType}".`);

        return service;
    }

    /**
     * Adds a singleton service of the type specified in serviceType.
     * @param serviceOrType - A service instance or service type.
     * @param service - a service instance if service type is specified in first argument
     */
    public addSingleton(serviceOrType: IService | ServiceType | object, service: object | null | ServiceCallback = null): void {

        let serviceType: ServiceType | null = (typeof serviceOrType === "string")
            ? serviceOrType
            : null;

        if (serviceType == null) {
            serviceType = ((serviceOrType as IService).getType)
                ? (serviceOrType as IService).getType()
                : null;
        }

        if (!serviceType)
            throw new Error(`InvalidOperationException. Service type is not specified or cannot be recognized from service instance.`);

        service = (service != null)
            ? service
            : serviceOrType as object;

        this._services.setValue(serviceType, service);
    }

    public getLocalizer(): ILocalizer | null {
        return this.getService(nameof<ILocalizer>());
    }

    public getEnumProvider(): IEnumProvider | null {
        return this.getService(nameof<IEnumProvider>());
    }

    public getTransformProvider(): ITransformProvider | null {
        return this.getService(nameof<ITransformProvider>());
    }
}

export default new ServiceProvider();