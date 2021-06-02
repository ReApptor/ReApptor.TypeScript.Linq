import {Utility} from "@weare/athenaeum-toolkit";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import ApplicationContext from "../models/ApplicationContext";
import {IBasePage} from "../base/BasePage";
import ch from "./ComponentHelper";

export enum DataStorageType {
    Session,
    
    Page,
    
    Route
}

class UserInteractionDataStorage {

    private readonly _data: Dictionary<string, any> = new Dictionary<string, any>();
    private _initialized: boolean = false;
    private _key: string | null = null;
    
    private get key(): string {
        if (this._key !== null && this._key !== undefined) {
            return this._key;
        }
        
        const context: ApplicationContext | null = ch.findContext();
        
        const applicationName: string | null = (context) ? context.applicationName : null;
        if (!applicationName) {
            return `${window.location.host}.userInteractionDataStorage`;
        }
        
        const sessionId: string = ch.getSessionId();
        this._key = `${applicationName}.${sessionId}.userInteractionDataStorage`;
        
        return this._key;
    }
    
    private get data(): Dictionary<string, any> {
        this.initialize();
        return this._data;
    }

    private initialize(): void {
        if (!this._initialized) {
            this._initialized = true;

            const json: string | null = window.localStorage.getItem(this.key);
            if (json) {
                const data = JSON.parse(json);
                const destination = this._data as any;
                destination.table = data.table;
                destination.nElements = data.nElements;
            }
        }
    }
    
    private save(): void {
        const json: string = JSON.stringify(this.data);
        window.localStorage.setItem(this.key, json);
    }
    
    private getKey(type: DataStorageType, id: string): string {
        const page: IBasePage | null = ch.findPage();
        return ((page == null) || (type == DataStorageType.Session))
            ? id
            : (type == DataStorageType.Route)
                ? `${page.routeName}:${page.routeIndex}:${page.routeId}:${id}`
                : `${page.routeName}:${id}`;
    }
    
    public set(id: string, value: any, type: DataStorageType = DataStorageType.Page): void {
        const key: string = this.getKey(type, id);
        this.data.setValue(key, value);
        this.save();
    }

    public get(id: string, defaultValue: any | null = null, type: DataStorageType = DataStorageType.Page): any | null {
        const key: string = this.getKey(type, id);
        return this.data.getValue(key) || defaultValue;
    }

    public restore(id: string, to: any, type: DataStorageType = DataStorageType.Page): any | null {
        const key: string = this.getKey(type, id);
        const value = this.data.getValue(key);
        if ((value != null) && (to != null)) {
            Utility.copyTo(value, to);
        }
        return to;
    }
    
    public async onAuthorize(): Promise<void> {
        this._initialized = false;
        this._key = null;
    }
}

export default new UserInteractionDataStorage();