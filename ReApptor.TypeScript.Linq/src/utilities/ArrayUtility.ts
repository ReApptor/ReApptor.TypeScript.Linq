
export default class ArrayUtility {

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

    public static async whereAsync<T>(items: readonly T[], callback: (item: T) => Promise<boolean>): Promise<T[]> {
        return items.filter(item => callback(item));
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
            if (valid) {
                result.push(item);
            }
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

            throw Error(error);
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

            throw Error(error);
        }

        return item;
    }

    public static lastOrDefault<T>(items: readonly T[], callback?: ((item: T) => boolean) | null, defaultValue?: T | null): T | null {
        const length: number = items.length;
        if (callback) {
            for (let i: number = length - 1; i >= 0; i--) {
                const item: T = items[i];
                if (callback(item)) {
                    return item;
                }
            }
        } else if (length > 0) {
            return items[length - 1];
        }
        return defaultValue ?? null;
    }

    public static async forEachAsync<T>(items: readonly T[], callback: (item: T) => Promise<void>): Promise<void> {
        const promises: Promise<void>[] = items.map(item => callback(item));
        await Promise.all(promises);
    }

    public static groupBy<T>(items: readonly T[], callback: ((item: T) => any) | null | undefined = null): T[][] {
        const map = new Map<any, T[]>();
        items.forEach((item) => {
            const key: any = callback ? callback(item) : null;
            const collection: T[] | undefined = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
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
            throw Error(`Array index "${index}" out of range, can be in [0..${items.length}].`);

        items.splice(index, 1);
    }

    public static max<T>(items: readonly T[], callback: ((item: T) => number) | null = null): T {
        if (items.length === 0)
            throw Error("Array cannot be empty.");

        callback = callback || ((item) => (item as any) as number);

        let maxItem: T = items[0];
        let maxValue: number = callback(maxItem);
        const length: number = items.length;
        for (let i: number = 1; i < length; i++) {
            const item: T = items[i];
            const value: number = callback(item);
            if (value > maxValue) {
                maxValue = value;
                maxItem = item;
            }
        }
        return maxItem;
    }

    public static maxValue<T>(items: readonly T[], callback: (item: T) => number): number {
        return callback(ArrayUtility.max(items, callback));
    }

    public static min<T, TValue = number | Date>(items: readonly T[], callback: ((item: T) => TValue) | null = null): T {
        if (items.length === 0)
            throw Error("Array cannot be empty.");

        callback = callback || ((item: T) => (item as any) as TValue);

        let minItem: T = items[0];
        let minValue: TValue = callback(minItem);
        const length: number = items.length;
        for (let i: number = 1; i < length; i++) {
            const item: T = items[i];
            const value: TValue = callback(item);
            if (value < minValue) {
                minValue = value;
                minItem = item;
            }
        }
        return minItem;
    }

    public static minValue<T, TValue = number | Date>(items: readonly T[], callback: (item: T) => TValue): TValue {
        return callback(ArrayUtility.min(items, callback));
    }

    public static sum<T>(items: readonly T[] | null | undefined, callback: (item: T) => number | null | undefined): number {
        let sum: number = 0;
        if (items) {
            items.forEach(item => sum += callback(item) ?? 0);
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

    public static distinct<T>(items: readonly T[], callback?: ((item: T) => any) | null): T[] {
        const result: T[] = [];
        const length: number = items.length;
        if (length > 0) {
            const set = new Set<T>();
            for (let i: number = 0; i < length; i++) {
                const item: T = items[i];
                const key: any = callback ? callback(item) : item;
                if (!set.has(key)) {
                    set.add(key);
                    result.push(items[i]);
                }
            }
        }
        return result;
    }

    public static sortBy<T, TKey1, TKey2, TKey3, TKey4, TKey5, TKey6>(source: T[],
                                                                      keySelector1?: ((item: T) => TKey1) | null,
                                                                      keySelector2?: ((item: T) => TKey2) | null,
                                                                      keySelector3?: ((item: T) => TKey3) | null,
                                                                      keySelector4?: ((item: T) => TKey4) | null,
                                                                      keySelector5?: ((item: T) => TKey5) | null,
                                                                      keySelector6?: ((item: T) => TKey6) | null): void {

        const compare = (keySelector: ((item: T) => any) | null | undefined, x: T, y: T): number => {
            const xKey: any = keySelector ? keySelector(x) : x;
            const yKey: any = keySelector ? keySelector(y) : y;
            return (xKey > yKey)
                ? 1
                : (xKey < yKey)
                    ? -1
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
}