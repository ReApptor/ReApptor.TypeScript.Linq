import Linq from "../Linq";

export default class ArrayUtility {

    private static compareDateType(x: Date | string, y: Date | string, ascending: boolean = true): number {
        x = (typeof x === "string") ? new Date(x) : x;
        y = (typeof y === "string") ? new Date(y) : y;

        const xValue: number = x.valueOf();
        const yValue: number = y.valueOf();

        if (xValue > yValue) {
            return (ascending) ? 1 : -1;
        }

        if (xValue < yValue) {
            return (ascending) ? -1 : 1;
        }

        return 0;
    }

    private static invokeSortBy<T, TKey1, TKey2, TKey3, TKey4, TKey5, TKey6>(source: T[],
                                                                      ascending: boolean,
                                                                      keySelector1?: ((item: T) => TKey1) | null,
                                                                      keySelector2?: ((item: T) => TKey2) | null,
                                                                      keySelector3?: ((item: T) => TKey3) | null,
                                                                      keySelector4?: ((item: T) => TKey4) | null,
                                                                      keySelector5?: ((item: T) => TKey5) | null,
                                                                      keySelector6?: ((item: T) => TKey6) | null): void {

        const greaterThen: number = (ascending) ? 1 : -1;
        const lessThen: number = (ascending) ? -1 : 1;
        
        const compare = (keySelector: ((item: T) => any) | null | undefined, x: T, y: T): number => {
            const xKey: any = keySelector ? keySelector(x) : x;
            const yKey: any = keySelector ? keySelector(y) : y;
            if ((Linq.settings.stringToDateCastEnabled) && (Linq.settings.stringToDateCastResolver(xKey))) {
                return this.compareDateType(xKey, yKey);
            }
            return (xKey > yKey)
                ? greaterThen
                : (xKey < yKey)
                    ? lessThen
                    : 0;
        }

        const comparator = (x: T, y: T): number => {
            let value: number = compare(keySelector1, x, y);
            if ((value === 0) && (keySelector2)) {
                value = compare(keySelector2, x, y);
                if ((value === 0) && (keySelector3)) {
                    value = compare(keySelector3, x, y);
                    if ((value === 0) && (keySelector4)) {
                        value = compare(keySelector4, x, y);
                        if ((value === 0) && (keySelector5)) {
                            value = compare(keySelector5, x, y);
                            if ((value === 0) && (keySelector6)) {
                                value = compare(keySelector6, x, y);
                            }
                        }
                    }
                }
            }
            return value;
        }

        source.sort(comparator);
    }

    public static all<T>(items: readonly T[], predicate: (item: T, index: number) => boolean): boolean {
        return items.every(predicate);
    }

    public static any<T>(items: readonly T[], predicate?: (item: T, index: number) => boolean): boolean {
        return (predicate)
            ? items.some(predicate)
            : items.length > 0;
    }

    public static where<T>(items: readonly T[], predicate: (item: T) => boolean): T[] {
        return items.filter(predicate);
    }

    public static async whereAsync<T>(items: readonly T[], predicate: (item: T) => Promise<boolean>): Promise<T[]> {
        const result: T[] = [];
        const length: number = items.length;
        for (let i: number = 0; i < length; i++) {
            const item: T = items[i];
            const passed: boolean = await predicate(items[i]);
            if (passed) {
                result.push(item);
            }
        }
        return result;
    }

    public static selectMany<TIn, TOut>(items: TIn[], collectionSelector: (item: TIn) => TOut[]): TOut[] {
        const result: TOut[] = [];
        const length: number = items.length;
        for (let i: number = 0; i < length; i++) {
            const subItems: TOut[] = collectionSelector(items[i]);
            result.push(...subItems);
        }
        return result;
    }

    public static chunk<T>(items: readonly T[], size: number): T[][] {
        if (size < 1)
            throw new Error(`Size "${size}" out of range, must be at least 1 or greater.`);
        
        const result: T[][] = [];

        const copy: T[] = [...items];

        while (copy.length) {
            result.push(copy.splice(0, size));
        }

        return result;
    }

    public static take<T>(items: readonly T[], count: number): T[] {
        if (count < 0) {
            count = 0;
        }
        let length: number = items.length;
        if ((count >= 0) && (count < length)) {
            length = count;
        }
        const result = new Array(length);
        for (let i: number = 0; i < length; i++) {
            result[i] = items[i];
        }
        return result;
    }

    public static takeLast<T>(items: readonly T[], count: number): T[] {
        if (count < 0) {
            count = 0;
        }
        let length: number = items.length;
        if ((count >= 0) && (count < length)) {
            length = count;
        }
        const result = new Array(length);
        const prefix: number = items.length - length;
        for (let i: number = 0; i < length; i++) {
            result[i] = items[prefix + i];
        }
        return result;
    }

    public static takeWhile<T>(items: readonly T[], predicate: (item: T, index: number) => boolean): T[] {
        const result: T[] = [];
        const length: number = items.length;
        for (let i: number = 0; i < length; i++) {
            const item: T = items[i];
            const valid: boolean = predicate(items[i], i);
            
            if (!valid) {
                break;
            }
            
            result.push(item);
        }
        return result;
    }

    public static skip<T>(items: readonly T[], count: number): T[] {
        if (count < 0) {
            count = 0;
        }
        const length: number = items.length;
        const firstIndex: number = (count < length) ? count : length;
        const newLength: number = length - firstIndex;
        const result = new Array(newLength);
        for (let dest: number = 0, source: number = firstIndex; dest < newLength; dest++, source++) {
            result[dest] = items[source];
        }
        return result;
    }

    public static first<T>(items: readonly T[], predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T {
        const item: T | null = ArrayUtility.firstOrDefault(items, predicate, defaultValue);

        if (item == null) {
            const error: string = (predicate)
                ? "No item found matching the specified predicate."
                : "The source sequence is empty.";

            throw new Error(error);
        }

        return item;
    }

    public static firstOrDefault<T>(items: readonly T[], predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T | null {
        const length: number = items.length;
        if (predicate) {
            for (let i: number = 0; i < length; i++) {
                const item: T = items[i];
                if (predicate(item)) {
                    return item;
                }
            }
        } else if (length > 0) {
            return items[0];
        }
        return defaultValue ?? null;
    }

    public static last<T>(items: readonly T[], predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T {
        const item: T | null = ArrayUtility.lastOrDefault(items, predicate, defaultValue);

        if (item == null) {
            const error: string = (predicate)
                ? "No item found matching the specified predicate."
                : "The source sequence is empty.";

            throw new Error(error);
        }

        return item;
    }

    public static lastOrDefault<T>(items: readonly T[], predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T | null {
        const length: number = items.length;
        if (predicate) {
            for (let i: number = length - 1; i >= 0; i--) {
                const item: T = items[i];
                if (predicate(item)) {
                    return item;
                }
            }
        } else if (length > 0) {
            return items[length - 1];
        }
        return defaultValue ?? null;
    }

    public static async forEachAsync<T>(items: readonly T[], predicate: (item: T) => Promise<void>): Promise<void> {
        const promises: Promise<void>[] = items.map(item => predicate(item));
        await Promise.all(promises);
    }

    public static groupBy<TSource, TKey, TElement>(items: readonly TSource[], keySelector?: ((item: TSource) => TKey) | null, elementSelector?: ((item: TSource) => TElement) | null): TElement[][] {
        const map = new Map<TKey, TElement[]>();
        
        let length: number = items.length;
        for (let i: number = 0; i < length; i++) {
            const item: TSource = items[i];
            const key: any | null = keySelector
                ? keySelector(item)
                : item;
            const element: any | null = elementSelector
                ? elementSelector(item)
                : item;
            const collection: TElement[] | undefined = map.get(key);
            if (!collection) {
                map.set(key, [element]);
            } else {
                collection.push(element);
            }
        }
        
        return Array.from(map.values());
    }

    public static remove<T>(items: T[], item: T | []): void {
        if (Array.isArray(item)) {
            const length: number = item.length;
            for (let i: number = 0; i < length; i++) {
                ArrayUtility.remove(items, item[i]);
            }
        } else {
            const index: number = items.indexOf(item);
            if (index !== -1) {
                items.splice(index, 1);
            }
        }
    }

    public static removeAt<T>(items: T[], index: number): void {
        if ((index < 0) || (index >= items.length))
            throw new Error(`Array index "${index}" out of range, can be in [0..${items.length}].`);

        items.splice(index, 1);
    }

    public static max<T>(items: readonly T[], keySelector: ((item: T) => number) | null = null): T {
        const length: number = items.length;

        if (length === 0)
            throw new Error("The source sequence is empty.");

        keySelector = keySelector || ((item) => (item as any) as number);

        let maxItem: T = items[0];
        let maxValue: number = keySelector(maxItem);
        for (let i: number = 1; i < length; i++) {
            const item: T = items[i];
            const value: number = keySelector(item);
            if (value > maxValue) {
                maxValue = value;
                maxItem = item;
            }
        }
        return maxItem;
    }

    public static maxValue<T>(items: readonly T[], keySelector: (item: T) => number): number {
        return keySelector(ArrayUtility.max(items, keySelector));
    }

    public static min<T, TValue = number | Date>(items: readonly T[], keySelector: ((item: T) => TValue) | null = null): T {
        const length: number = items.length;

        if (length === 0)
            throw new Error("The source sequence is empty.");

        keySelector = keySelector || ((item: T) => (item as any) as TValue);

        let minItem: T = items[0];
        let minValue: TValue = keySelector(minItem);
        for (let i: number = 1; i < length; i++) {
            const item: T = items[i];
            const value: TValue = keySelector(item);
            if (value < minValue) {
                minValue = value;
                minItem = item;
            }
        }
        return minItem;
    }

    public static minValue<T, TValue = number | Date>(items: readonly T[], predicate: (item: T) => TValue): TValue {
        return predicate(this.min(items, predicate));
    }

    public static sum<T>(items: readonly T[] | null | undefined, selector?: ((item: T) => number | null | undefined) | null): number {
        let sum: number = 0;
        if (items != null) {
            const length: number = items.length;
            for (let i: number = 0; i < length; i++) {
                const item: T = items[i];
                const value: number = selector
                    ? selector(item) ?? 0
                    : item as number;
                sum = sum + value;
            }
        }
        return sum;
    }

    public static count<T>(items: readonly T[] | null | undefined, predicate?: ((item: T, index: number) => boolean) | null): number {
        let count: number = 0;
        if (items) {
            if (predicate) {
                items.forEach((item, index) => count += predicate(item, index) ? 1 : 0);
            } else {
                count = items.length;
            }
        }
        return count;
    }

    public static distinct<T>(items: readonly T[], predicate?: ((item: T) => any) | null): T[] {
        const result: T[] = [];
        const length: number = items.length;
        if (length > 0) {
            const set = new Set<T>();
            for (let i: number = 0; i < length; i++) {
                const item: T = items[i];
                const key: any = predicate ? predicate(item) : item;
                if (!set.has(key)) {
                    set.add(key);
                    result.push(items[i]);
                }
            }
        }
        return result;
    }
    
    public static repeat<T>(element: T, count: number): T[] {
        const items = new Array<T>(count);
        for (let i = 0; i < count; i++) {
            items[i] = element;
        }
        return items;
    }
    
    public static average<T>(items: readonly T[], selector?: ((item: T) => number | null | undefined) | null): number {
        const length: number = items.length;

        if (length === 0)
            throw new Error("The source sequence is empty.");

        const sum: number = this.sum(items, selector);

        return sum / length;
    }

    public static sortBy<T, TKey1, TKey2, TKey3, TKey4, TKey5, TKey6>(source: T[],
                                                                      keySelector1?: ((item: T) => TKey1) | null,
                                                                      keySelector2?: ((item: T) => TKey2) | null,
                                                                      keySelector3?: ((item: T) => TKey3) | null,
                                                                      keySelector4?: ((item: T) => TKey4) | null,
                                                                      keySelector5?: ((item: T) => TKey5) | null,
                                                                      keySelector6?: ((item: T) => TKey6) | null): void {
        this.invokeSortBy(source, true, keySelector1, keySelector2, keySelector3, keySelector4, keySelector5, keySelector6);
    }

    public static sortByDescending<T, TKey1, TKey2, TKey3, TKey4, TKey5, TKey6>(source: T[],
                                                                      keySelector1?: ((item: T) => TKey1) | null,
                                                                      keySelector2?: ((item: T) => TKey2) | null,
                                                                      keySelector3?: ((item: T) => TKey3) | null,
                                                                      keySelector4?: ((item: T) => TKey4) | null,
                                                                      keySelector5?: ((item: T) => TKey5) | null,
                                                                      keySelector6?: ((item: T) => TKey6) | null): void {
        this.invokeSortBy(source, false, keySelector1, keySelector2, keySelector3, keySelector4, keySelector5, keySelector6);
    }
}