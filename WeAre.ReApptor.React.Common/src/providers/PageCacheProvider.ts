/**
 * Page Cache provider
 */

import {Mutex} from "async-mutex";
import {Dictionary} from "typescript-collections";
import {Utility} from "@weare/reapptor-toolkit";
import ch from "./ComponentHelper";

class PageCacheProviderContainer {
    public readonly lock: Mutex = new Mutex();
    public readonly data: Dictionary<string, any> = new Dictionary<string, any>();
}

export default class PageCacheProvider {

    private static readonly _data: PageCacheProviderContainer = new PageCacheProviderContainer();
    private static readonly _dataTtl: PageCacheProviderContainer = new PageCacheProviderContainer();
    
    private static async clearKeyAsync(container: PageCacheProviderContainer, key: string): Promise<void> {
        await container.lock.runExclusive(async () => {
            container.data.remove(key);
        });
    }

    public static clear(): void {
        this._data.data.clear();
    }

    public static async getAsync<T>(key: string, action: () => Promise<T>, ttl: number = 0): Promise<T> {
        const hasTtl: boolean = (ttl > 0);
        const container: PageCacheProviderContainer = hasTtl ? this._dataTtl : this._data;
        key = (hasTtl) ? key : `${ch.findRouteName()}:${key}`;

        let data: T | undefined = undefined;
        await container.lock.runExclusive(async () => {
            data = container.data.getValue(key);
            if (data == null) {
                data = await action();
                container.data.setValue(key, data);
                if (hasTtl) {
                    Utility.setTimeout(async () => await this.clearKeyAsync(container, key), ttl);
                }
            }
        });
        return data!;
    }
}