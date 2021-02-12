import {Dictionary} from "typescript-collections";
import {IEnumProvider, ILocalizer, ITypeResolver, ServiceType} from "..";
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

var me: ServiceProvider | null;

class ServiceProvider {
    
    private static _id: number = Math.random(); 
    private readonly _services: Dictionary<ServiceType, object | IService | ServiceCallback> = new Dictionary<ServiceType, object | IService | ServiceCallback>();
    
    private set(serviceType: ServiceType, service: IService | object | ServiceCallback): void {
        this._services.setValue(serviceType, service);
    }
    
    private get(serviceType: ServiceType): object | IService | ServiceCallback | undefined {
        return this._services.getValue(serviceType);
    }
    
    constructor() {
        console.log("sp.constructor:window=", window);
        const container = window as any;
        if (container) {
            console.log("sp.constructor:container.__athenaeumServiceProvider=", container.__athenaeumServiceProvider);
            
            if (container.__athenaeumServiceProvider)
                throw new Error("Service provider has already registered.");
            
            container.__athenaeumServiceProvider = this;
        }
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
            throw new Error(`InvalidOperationException. There is no service of type "${serviceType}". Service provider id "${this.id}".`);

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

    public getTypeResolver(): ITypeResolver {
        const serviceType: string = nameof<ITypeResolver>();
        const service: ITypeResolver | null = this.get(serviceType) as ITypeResolver;
        if (service != null) {
            return service;
        }
        this.set(serviceType, TypeResolver);
        return TypeResolver;
    }

    public findLocalizer(): ILocalizer | null {
        return this.getService(nameof<ILocalizer>());
    }

    public getLocalizer(): ILocalizer {
        return this.getRequiredService(nameof<ILocalizer>());
    }

    public findEnumProvider(): IEnumProvider | null {
        return this.getService(nameof<IEnumProvider>());
    }

    public findTransformProvider(): ITransformProvider | null {
        return this.getService(nameof<ITransformProvider>());
    }
    
    public get id(): number {
        return ServiceProvider._id;
    }
}

export default new ServiceProvider();