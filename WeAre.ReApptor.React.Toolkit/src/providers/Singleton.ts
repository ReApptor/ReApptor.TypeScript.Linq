import {Dictionary} from "typescript-collections";

type Data = Dictionary<string, any>;

interface IWindowContainer {
    __athenaeumSingletonData?: Data;
}

class Singleton {
    private _data: Data | null = null;
    
    private getData(): Data {
        if (this._data == null) {
            const container: IWindowContainer = window as IWindowContainer;
            this._data = container.__athenaeumSingletonData || (container.__athenaeumSingletonData = new Dictionary<string, any>());
        }
        return this._data;
    }
    
    public get<T extends object>(name: string, instance: T | (() => T), warning: boolean = true): T {
        const data: Data = this.getData();
        if (data.containsKey(name)) {
            if (warning) {
                console.warn(`Athenaeum Singleton Warning. Multiple instance of singleton object "${name}" found. Probably several instances of one of the packages are loaded. This will not break the app but it is not recommended to use two major versions.`);
            }
            return data.getValue(name);
        }
        const value: T = (typeof instance === "function")
            ? (instance as (() => T))()
            : instance;
        data.setValue(name, value);
        return value;
    }
}

export default new Singleton();