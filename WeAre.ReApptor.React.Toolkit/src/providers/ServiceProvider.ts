import {Dictionary} from "typescript-collections";
import {ITransformProvider} from "./BaseTransformProvider";
import {ILocalizer} from "../localization/BaseLocalizer";
import {IEnumProvider} from "./BaseEnumProvider";
import TypeResolver, {ITypeResolver, TDecoratorConstructor} from "./TypeResolver";
import Singleton from "./Singleton";

/**
 * A service type.
 */
export type ServiceType = string;

export type ServiceCallback = (serviceType: ServiceType) => IService | object | null;

/**
 * A service.
 */
export interface IService {

    /**
     * @returns The exact runtime {@link ServiceType} of the services current instance.
     */
    getType(): ServiceType;
}

export type TService = IService;

/**
 * A type which can be resolved to a service during runtime.
 */
export declare type TType = TDecoratorConstructor | IService | object | boolean | number | string;

class ServiceProvider implements IService {

    private readonly _services: Dictionary<ServiceType, object | IService | ServiceCallback> = new Dictionary<ServiceType, object | IService | ServiceCallback>();

    private set(serviceType: ServiceType, service: IService | object | ServiceCallback): void {
        this._services.setValue(serviceType, service);
    }

    private get(serviceType: ServiceType): object | IService | ServiceCallback | undefined {
        return this._services.getValue(serviceType);
    }

    /**
     * Resolves service type.
     * @param serviceOrType - A service declaration, service type or service instance.
     * @returns ServiceType - A service type.
     */
    public resolveServiceType(serviceOrType: ServiceType | TType): ServiceType {
        const typeResolver: ITypeResolver = this.getTypeResolver();

        return (typeof serviceOrType === "string")
            ? serviceOrType
            : typeResolver.resolve(serviceOrType);
    }

    /**
     * Gets the service object of the specified type.
     * @param serviceOrType - A service declaration, service type or service instance.
     * @param resolve - if True then the service callback will be automatically resolved (invoked); if False, then the function will be returned.
     * @returns IService | object | null - A service object of type serviceType or null if there is no service object of type serviceType.
     */
    public getService<TService extends IService | object>(serviceOrType: ServiceType | TType, resolve: boolean = true): TService | null {

        const serviceType: ServiceType = this.resolveServiceType(serviceOrType);

        const service: object | IService | ServiceCallback | undefined = this.get(serviceType);

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

        const serviceType: ServiceType = this.resolveServiceType(serviceOrType);

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

        const serviceType: ServiceType = this.resolveServiceType(serviceOrType);

        service = (service != null)
            ? service
            : serviceOrType as object;

        this.set(serviceType, service);
    }

    /**
     * @return An {@link ITypeResolver}.
     */
    public getTypeResolver(): ITypeResolver {
        const serviceType: string = nameof<ITypeResolver>();
        const service: ITypeResolver | null = this.get(serviceType) as ITypeResolver;
        if (service != null) {
            return service;
        }
        this.set(serviceType, TypeResolver);
        return TypeResolver;
    }

    /**
     * @return An {@link ILocalizer}, or null if no {@link ILocalizer} service is registered.
     */
    public findLocalizer(): ILocalizer | null {
        return this.getService(nameof<ILocalizer>());
    }

    /**
     * @return An {@link ILocalizer}.
     * @throws No {@link ILocalizer} service is registered.
     */
    public getLocalizer(): ILocalizer {
        return this.getRequiredService(nameof<ILocalizer>());
    }

    /**
     * @return An {@link IEnumProvider}, or null if no {@link IEnumProvider} service is registered.
     */
    public findEnumProvider(): IEnumProvider | null {
        return this.getService(nameof<IEnumProvider>());
    }

    /**
     * @return An {@link ITransformProvider}, or null if no {@link ITransformProvider} service is registered.
     */
    public findTransformProvider(): ITransformProvider | null {
        return this.getService(nameof<ITransformProvider>());
    }

    // IService

    public getType(): ServiceType {
        return nameof(ServiceProvider);
    }
}

export default Singleton.get(nameof(ServiceProvider), new ServiceProvider());