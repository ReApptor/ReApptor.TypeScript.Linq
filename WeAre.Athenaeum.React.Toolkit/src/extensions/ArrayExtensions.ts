import Utility from "../Utility";
import ArrayUtility from "../ArrayUtility";
import IPagedList from "../models/IPagedList";

declare global {
    interface Array<T> {
        /**
         * Filters a sequence of values based on a predicate.
         * @param predicate - A function to test each element for a condition.
         * @returns Array<T> - An Array<T> that contains elements from the input sequence that satisfy the condition.
         */
        where(predicate: (item: T) => boolean): T[];

        whereAsync(callback: (item: T) => Promise<boolean>): Promise<T[]>;

        /**
         * Returns a specified number of contiguous elements from the start of a sequence.
         * @param count - The number of elements to return.
         * @returns Array<T> - An Array<T> that contains the specified number of elements from the start of the input sequence.
         */
        take(count: number): T[];

        /**
         * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
         * @param count - A function to test each element for a condition.
         * @returns Array<T> - An Array<T> that contains the elements that occur after the specified index in the input sequence.
         */
        skip(count: number): T[];

        /**
         * Projects each element of a sequence to an Array<T> and flattens the resulting sequences into one sequence.
         * @param collectionSelector - A transform function to apply to each element of the input sequence.
         * @returns Array<TOut> - An Array<TOut> whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of source and then mapping each of those sequence elements and their corresponding source element to a result element.
         */
        selectMany<TOut>(collectionSelector: (item: T) => TOut[]): TOut[];

        groupBy(callback: ((item: T) => any) | null | undefined): T[][];

        /**
         * Removes the first occurrence of a specific object from the Array<T>.
         * @param item - The object(s) to remove from the Array<T>. The value can be null for reference types.
         * @returns boolean - true if item is successfully removed; otherwise, false. This method also returns false if item was not found in the Array<T>.
         */
        remove(item: T | readonly T[]): void;

        /**
         * Removes the element at the specified index of the Array<T>.
         * @param index - The zero-based index of the element to remove.
         * @exception ArgumentOutOfRangeException - index is less than 0 -or- index is equal to or greater than Count.
         */
        removeAt(index: number): void;

        max(callback: ((item: T) => number) | null): T;

        maxValue(callback: (item: T) => number): number;

        min(callback: ((item: T) => number) | null): T;

        minValue(callback: (item: T) => number): number;

        sum(callback: (item: T) => number | null | undefined): number;

        count(callback: (item: T, index: number) => boolean): number;

        chunk(chunkSize: number): T[][];

        /**
         * Returns distinct elements from a sequence.
         * @param callback - A callback function to get comparable value.
         * @returns Array<T> - An Array<T> that contains distinct elements from the source sequence.
         */
        distinct(callback: ((item: T) => any) | null | undefined): T[];

        order<TKey1, TKey2, TKey3, TKey4, TKey5>(keySelector1: ((item: T) => TKey1), keySelector2?: ((item: T) => TKey2), keySelector3?: ((item: T) => TKey3), keySelector4?: ((item: T) => TKey4), keySelector5?: ((item: T) => TKey5)): void;

        toPagedList(pageNumber: number, pageSize: number): IPagedList<T>;

        forEachAsync(callback: (item: T) => Promise<void>): Promise<void>;
    }
}

export const ArrayExtensions = function () {

    if (Array.prototype.where == null) {
        Array.prototype.where = function<T>(predicate: (item: T) => boolean): T[] {
            return Utility.where(this, predicate);
        };
    }

    if (Array.prototype.whereAsync == null) {
        Array.prototype.whereAsync = function<T>(callback: (item: T) => Promise<boolean>): Promise<T[]> {
            return Utility.whereAsync(this, callback);
        };
    }

    if (Array.prototype.take == null) {
        Array.prototype.take = function<T>(count: number): T[] {
            return ArrayUtility.take(this, count);
        };
    }

    if (Array.prototype.skip == null) {
        Array.prototype.skip = function<T>(count: number): T[] {
            return ArrayUtility.skip(this, count);
        };
    }

    if (Array.prototype.selectMany == null) {
        Array.prototype.selectMany = function<T, TOut>(collectionSelector: (item: T) => TOut[]): TOut[] {
            return Utility.selectMany(this, collectionSelector);
        };
    }

    if (Array.prototype.groupBy == null) {
        Array.prototype.groupBy = function<T>(callback: ((item: T) => any) | null | undefined): T[][] {
            return Utility.groupBy(this, callback);
        };
    }

    if (Array.prototype.remove == null) {
        Array.prototype.remove = function<T>(item: T | readonly T[]): void {
            Utility.remove(this, item);
        };
    }

    if (Array.prototype.removeAt == null) {
        Array.prototype.removeAt = function<T>(index: number): void {
            Utility.removeAt(this, index);
        };
    }

    if (Array.prototype.max == null) {
        Array.prototype.max = function<T>(callback: ((item: T) => number) | null = null): T {
            return Utility.max(this, callback);
        };
    }

    if (Array.prototype.maxValue == null) {
        Array.prototype.maxValue = function<T>(callback: (item: T) => number): number {
            return Utility.maxValue(this, callback);
        };
    }

    if (Array.prototype.min == null) {
        Array.prototype.min = function<T>(callback: ((item: T) => number) | null = null): T {
            return Utility.min(this, callback);
        };
    }

    if (Array.prototype.minValue == null) {
        Array.prototype.minValue = function<T>(callback: (item: T) => number): number {
            return Utility.minValue(this, callback);
        };
    }

    if (Array.prototype.sum == null) {
        Array.prototype.sum = function<T>(callback: (item: T) => number | null | undefined): number {
            return Utility.sum(this, callback);
        };
    }

    if (Array.prototype.count == null) {
        Array.prototype.count = function<T>(callback: (item: T, index: number) => boolean): number {
            return Utility.count(this, callback);
        };
    }

    if (Array.prototype.chunk == null) {
        Array.prototype.chunk = function<T>(chunkSize: number): T[][] {
            return ArrayUtility.chunk(this, chunkSize);
        };
    }

    if (Array.prototype.distinct == null) {
        Array.prototype.distinct = function<T>(callback: ((item: T) => any) | null | undefined = null): T[] {
            return Utility.distinct(this, callback);
        };
    }

    if (Array.prototype.order == null) {
        Array.prototype.order = function<T, TKey1, TKey2, TKey3, TKey4, TKey5>(keySelector1: ((item: T) => TKey1), keySelector2?: ((item: T) => TKey2), keySelector3?: ((item: T) => TKey3), keySelector4?: ((item: T) => TKey4), keySelector5?: ((item: T) => TKey5)): void {
            ArrayUtility.order(this, keySelector1, keySelector2, keySelector3, keySelector4, keySelector5);
        };
    }

    if (Array.prototype.toPagedList == null) {
        Array.prototype.toPagedList = function<T>(pageNumber: number, pageSize: number): IPagedList<T> {
            return Utility.toPagedList(this, pageNumber, pageSize);
        };
    }

    if (Array.prototype.forEachAsync == null) {
        Array.prototype.forEachAsync = function<T>(callback: (item: T) => Promise<void>): Promise<void> {
            return Utility.forEachAsync(this, callback);
        };
    }
}

ArrayExtensions();