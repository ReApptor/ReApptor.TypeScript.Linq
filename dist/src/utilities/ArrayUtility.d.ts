export default class ArrayUtility {
    static all<T>(items: readonly T[], predicate: (item: T, index: number) => boolean): boolean;
    static any<T>(items: readonly T[], predicate?: (item: T, index: number) => boolean): boolean;
    static where<T>(items: readonly T[], predicate: (item: T) => boolean): T[];
    static whereAsync<T>(items: readonly T[], callback: (item: T) => Promise<boolean>): Promise<T[]>;
    static selectMany<TIn, TOut>(items: TIn[], collectionSelector: (item: TIn) => TOut[]): TOut[];
    static chunk<T>(items: readonly T[], size: number): T[][];
    static take<T>(items: readonly T[], count: number): T[];
    static takeLast<T>(items: readonly T[], count: number): T[];
    static takeWhile<T>(items: readonly T[], predicate: (item: T, index: number) => boolean): T[];
    static skip<T>(items: readonly T[], count: number): T[];
    static first<T>(items: readonly T[], predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T;
    static firstOrDefault<T>(items: readonly T[], predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T | null;
    static last<T>(items: readonly T[], predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T;
    static lastOrDefault<T>(items: readonly T[], callback?: ((item: T) => boolean) | null, defaultValue?: T | null): T | null;
    static forEachAsync<T>(items: readonly T[], callback: (item: T) => Promise<void>): Promise<void>;
    static groupBy<T>(items: readonly T[], callback?: ((item: T) => any) | null | undefined): T[][];
    static remove<T>(items: T[], item: T | []): void;
    static removeAt<T>(items: T[], index: number): void;
    static max<T>(items: readonly T[], callback?: ((item: T) => number) | null): T;
    static maxValue<T>(items: readonly T[], callback: (item: T) => number): number;
    static min<T, TValue = number | Date>(items: readonly T[], callback?: ((item: T) => TValue) | null): T;
    static minValue<T, TValue = number | Date>(items: readonly T[], callback: (item: T) => TValue): TValue;
    static sum<T>(items: readonly T[] | null | undefined, callback: (item: T) => number | null | undefined): number;
    static count<T>(items: readonly T[] | null | undefined, predicate?: ((item: T, index: number) => boolean) | null): number;
    static distinct<T>(items: readonly T[], callback?: ((item: T) => any) | null): T[];
    static repeat<T>(element: T, count: number): T[];
    static sortBy<T, TKey1, TKey2, TKey3, TKey4, TKey5, TKey6>(source: T[], keySelector1?: ((item: T) => TKey1) | null, keySelector2?: ((item: T) => TKey2) | null, keySelector3?: ((item: T) => TKey3) | null, keySelector4?: ((item: T) => TKey4) | null, keySelector5?: ((item: T) => TKey5) | null, keySelector6?: ((item: T) => TKey6) | null): void;
}
