import {Dictionary} from "typescript-collections";
import {IEnumProvider, ILocalizer} from "..";
import {ITransformProvider} from "./BaseTransformProvider";
import TypeResolver, {TDecoratorConstructor} from "./TypeResolver";

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

export declare type TType = TDecoratorConstructor | IService | object | boolean | number | string;

class ServiceProvider {
    
    private readonly _services: Dictionary<ServiceType, IService | object> = new Dictionary<ServiceType, IService | object>();

    /**
     * Gets the service object of the specified type.
     * @param serviceOrType - A service declaration, service type or service instance.
     * @param resolve - if True then the service callback will be automatically resolved (invoked); if False, then the function will be returned.
     * @returns IService | object | null - A service object of type serviceType or null if there is no service object of type serviceType.
     */
    public getService<TService extends IService | object>(serviceOrType: ServiceType | TType, resolve: boolean = true): TService | null {

        const serviceType: ServiceType = TypeResolver.resolveService(serviceOrType);

        const service: IService | object | undefined = this._services.getValue(serviceType);

        return (service != null)
            ? ((resolve) && (typeof service === "function"))
                ? service(serviceType)
                : service as TService
            : null;
    }

    /**
     * Get service of type serviceType from the IServiceProvider.
     * @param serviceOrType - A service declaration, service type or service instance.
     * @param resolve - if True then the service callback will be automatically resolved (invoked); if False, then the function will be returned.
     * @returns A service object of type serviceType.
     * @exception InvalidOperationException There is no service of type serviceType.
     */
    public getRequiredService<TService extends IService | object>(serviceOrType: ServiceType | TType, resolve: boolean = true): TService {

        const serviceType: ServiceType = TypeResolver.resolveService(serviceOrType);

        const service: TService | null = this.getService<TService>(serviceType, resolve);
        
        if (service == null)
            throw new Error(`InvalidOperationException. There is no service of type "${serviceType}".`);

        return service;
    }

    /**
     * Adds a singleton service of the type specified in serviceType.
     * @param serviceOrType - A service declaration, service type or service instance.
     * @param service - a service instance if service type is specified in first argument
     */
    public addSingleton(serviceOrType: ServiceType | TType, service: object | null | ServiceCallback = null): void {

        const serviceType: ServiceType = TypeResolver.resolveService(serviceOrType);

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