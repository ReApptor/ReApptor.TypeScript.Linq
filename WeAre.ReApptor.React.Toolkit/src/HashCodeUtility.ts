
class ObjectHashItem {
    public object: object;
    
    public hash: number | null;
    
    constructor(object: object) {
        this.object = object;
        this.hash = null;
    }
}

export default class HashCodeUtility {
    
    private static inc(hash: number, value: number): number {
        return (((hash << 5) - hash) + value) & 0xFFFFFFFF;
    }

    private static object(object: any, cache: ObjectHashItem[]): number {

        if (object instanceof Date)
        {
            return this.getDateHashCode(object);
        }
        
        const index: number = cache.findIndex(item => item.object === object);
        
        if (index !== -1) {
            const hash: number | null = cache[index].hash;
            return (hash !== null)
                ? hash
                : index;
        }

        const cacheItem = new ObjectHashItem(object);
        cache.push(cacheItem);
        
        const hasOwnProperty = Object.prototype.hasOwnProperty;

        let hash: number = 0;
        
        const properties: string[] = [];
        for (let property in object) {
            if (hasOwnProperty.call(object, property)) {
                properties.push(property);
            }
        }
        
        const length: number = properties.length;
        if (length > 0) {
            properties.sort();
            for (let i: number = 0; i < length; i++) {
                const property: string = properties[i];
                hash = this.inc(hash, this.getStringHashCode(property));
                hash = this.inc(hash, this.invokeGetHashCode(object[property], cache));
            }
        }
        
        // for (let property in object) {
        //     if (hasOwnProperty.call(object, property)) {
        //         //hash += HashCodeUtility.hash(property + HashCodeUtility.getHashCode(object[property]));
        //         hash = this.inc(hash, this.getStringHashCode(property));
        //         hash = this.inc(hash, this.invokeGetHashCode(object[property], cache));
        //     }
        // }

        cacheItem.hash = hash;

        return hash;
    }

    private static invokeGetHashCode(value: any | null | undefined, cache: ObjectHashItem[]): number {
        if (value != null) {
            switch (typeof value) {
                case "string": return this.getStringHashCode(value);
                case "number": return this.getNumberHashCode(value);
                case "boolean": return this.getBooleanHashCode(value);
                case "object": return this.object(value, cache);
            }
        }

        return 0;
    }

    public static getStringHashCode(value: string): number {

        // return (value)
        //     ? value.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
        //     : 0;

        const length: number = value.length;
        
        let hash: number = 0;
        
        for (let i = 0; i < length; i++)
        {
            //hash = (((hash << 5) - hash) + string.charCodeAt(i)) & 0xFFFFFFFF;
            hash = this.inc(hash, value.charCodeAt(i));
        }
        
        return hash;
    }

    public static getNumberHashCode(value: number): number {
        return this.getStringHashCode(value.toString());
    }

    public static getBooleanHashCode(value: boolean): number {
        //return this.getStringHashCode(value.toString());
        return (value) ? 3569038 : 97196323;
    }

    public static getDateHashCode(value: Date): number {
        return this.getNumberHashCode(value.valueOf());
    }

    /**
     * Serves as the default hash function.
     * @returns Number - A hash code for the current object.
     */
    public static getHashCode(value: any | null | undefined): number {
        const cache: ObjectHashItem[] = [];
        return this.invokeGetHashCode(value, cache);
    }
    
    public static isEqual(x: any | string | null | undefined, y: any | string | null | undefined): boolean {
        return (this.getHashCode(x) === this.getHashCode(y));
    }
}