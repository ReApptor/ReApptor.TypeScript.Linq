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

class ServiceProvider {
    
    private readonly _services: Dictionary<ServiceType, IService | object> = new Dictionary<ServiceType, IService | object>();
    
    /**
     * Gets the service object of the specified type.
     * @param serviceType - An object that specifies the type of service object to get.
     * @returns IService | object | null - A service object of type serviceType or null if there is no service object of type serviceType.
     */
    public getService<T extends IService | object = {}>(serviceType: ServiceType): T | null {
        const service: IService | object | undefined = this._services.getValue(serviceType);
        return (service != null)
            ? (typeof service === "function")
                ? service(serviceType)
                : service as T
            : null;
    }

    /**
     * Get service of type serviceType from the IServiceProvider.
     * @param serviceType - An object that specifies the type of service object to get.
     * @returns A service object of type serviceType.
     * @exception InvalidOperationException There is no service of type serviceType.
     */
    public getRequiredService<T extends IService | object = {}>(serviceType: ServiceType): T {
        
        const service: IService | object | null = this.getService(serviceType);
        
        if (service == null)
            throw new Error(`InvalidOperationException. There is no service of type "${serviceType}".`);

        return service as T;
    }

    /**
     * Adds a singleton service of the type specified in serviceType.
     * @param serviceOrType - A service instance or service type.
     * @param instance - a service instance if service type is specified in first argument
     */
    public addSingleton(serviceOrType: IService | ServiceType | object, instance: object | null | ServiceCallback = null): void {

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

        instance = (instance != null)
            ? instance
            : serviceOrType as object;

        this._services.setValue(serviceType, instance);
    }

    public getLocalizer(): ILocalizer | null {
        return this.getService("ILocalizer");
    }

    public getEnumProvider(): IEnumProvider | null {
        return this.getService("IEnumProvider");
    }

    public getTransformProvider(): ITransformProvider | null {
        return this.getService("ITransformProvider");
    }
}

export default new ServiceProvider();