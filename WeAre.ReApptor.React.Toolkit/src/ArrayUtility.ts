import Utility from "./Utility";
import DateUtility from "./DateUtility";

export enum SortDirection {
    Asc,

    Desc
}

export default class ArrayUtility {
    
    public static sortByProperty<TItem>(propertyName: string, sortDirection: SortDirection | null = SortDirection.Asc): (a: TItem , b: TItem) => number {
        const direction: number = (sortDirection == SortDirection.Desc) ? -1 : 1;
        
        return (firstItem: TItem | any , secondItem: TItem | any) => {
            const x: any = firstItem[propertyName];
            const y: any = secondItem[propertyName];
            const result: number = (x < y)
                ? -1
                : (x > y)
                    ? 1
                    : 0;
            return result * direction;
        }
    }

    public static sort<TItem>(first: TItem | any , second: TItem | any, sortingType: SortDirection | null = SortDirection.Asc): number {
        const direction: number = (sortingType == SortDirection.Desc) ? -1 : 1;

        const result: number = (first < second)
            ? -1
            : (first > second)
                ? 1
                : 0;

        return result * direction;
    }

    public static order<TSource, TKey1, TKey2, TKey3, TKey4, TKey5>(source: TSource[], keySelector1: ((item: TSource) => TKey1), keySelector2?: ((item: TSource) => TKey2), keySelector3?: ((item: TSource) => TKey3), keySelector4?: ((item: TSource) => TKey4), keySelector5?: ((item: TSource) => TKey5)): void {

        const compare = (keySelector: ((item: TSource) => any), x: TSource, y: TSource): number => {
            const xKey: any = keySelector(x);
            const yKey: any = keySelector(y);
            if (Utility.isDateType(xKey)) {
                return DateUtility.compare(xKey, yKey);
            }
            return (xKey > yKey)
                ? 1
                : (xKey < yKey)
                    ? -1
                    : 0;
        }

        const comparator = (x: TSource, y: TSource): number => {
            let value: number = compare(keySelector1, x, y);
            if ((value === 0) && (keySelector2)) {
                value = compare(keySelector2, x, y);
                if ((value === 0) && (keySelector3)) {
                    value = compare(keySelector3, x, y);
                    if ((value === 0) && (keySelector4)) {
                        value = compare(keySelector4, x, y);
                        if ((value === 0) && (keySelector5)) {
                            value = compare(keySelector5, x, y);
                        }
                    }
                }
            }
            return value;
        }

        source.sort(comparator);
    }

    public static chunk<TItem>(givenArray: TItem[], chunkSize: number): TItem[][] {
        const result: TItem[][] = [];

        const givenArrayCopy: TItem[] = [...givenArray];

        while (givenArrayCopy.length) {
            result.push(givenArrayCopy.splice(0, chunkSize));
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
}