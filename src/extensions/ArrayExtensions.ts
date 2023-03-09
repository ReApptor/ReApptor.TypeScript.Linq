import ArrayUtility from "../utilities/ArrayUtility";

/* eslint-disable no-extend-native */

// MS Linq (System.Linq, Enumerable):
// Aggregate
// All                          *
// Any                          *   
// Append                       ?
// AsEnumerable                 -
// Average                      *
// Cast                         ?
// Chunk                        *
// Concat
// Contains
// Count                        *
// DefaultIfEmpty
// Distinct                     *
// DistinctBy
// ElementAt
// ElementAtOrDefault
// Empty                                Returns an empty IEnumerable<T> that has the specified type argument.                                  
// Except
// ExceptBy
// First                        *
// FirstOrDefault               *
// GroupBy                      *
// GroupJoin
// Intersect
// IntersectBy
// Join
// Last                         *
// LastOrDefault                *
// LongCount
// Max                          *
// MaxBy
// Min                          *
// MinBy
// OfType
// Order
// OrderBy
// OrderByDescending
// OrderDescending
// Prepend
// Range
// Repeat                   *
// Reverse
// Select
// SelectMany               *
// SequenceEqual
// Skip                     *
// SkipLast
// SkipWhile
// Sum                      *
// Take                     *
// TakeLast                 *
// TakeWhile                *
// ThenBy
// ThenByDescending
// ToArray
// ToDictionary
// ToHashSet
// ToList                   -
// ToLookup
// TryGetNonEnumeratedCount
// Union
// UnionBy
// Where                    *
// Zip                                  Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.

declare global {
    interface Array<T> {

        /**
         * Determines whether all elements of a sequence satisfy a condition.
         * @param predicate - A function to test each element for a condition.
         * @returns boolean - true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
         */
        all(predicate: (item: T, index: number) => boolean): boolean;

        /**
         * Determines whether a sequence contains any elements.
         * @param predicate - A function to test each element for a condition.
         * @returns boolean - true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
         */
        any(predicate?: (item: T, index: number) => boolean): boolean;

        /**
         * Computes the sum of a sequence of nullable number values.
         * @param selector - A transform function to apply to each element.
         * @returns number - the sum of the values in the sequence.
         */
        average(selector?: ((item: T) => number | null | undefined) | null): number;

        /**
         * Filters a sequence of values based on a predicate.
         * @param predicate - A function to test each element for a condition.
         * @returns Array<T> - An Array<T> that contains elements from the input sequence that satisfy the condition.
         */
        where(predicate: (item: T) => boolean): T[];

        whereAsync(predicate: (item: T) => Promise<boolean>): Promise<T[]>;

        /**
         * Returns a specified number of contiguous elements from the start of a sequence.
         * @param count - The number of elements to return.
         * @returns Array<T> - An Array<T> that contains the specified number of elements from the start of the input sequence.
         */
        take(count: number): T[];

        /**
         * Returns a new array that contains the last count elements from source.
         * @param count - The number of elements to take from the end of the collection.
         * @returns Array<T> - A new array that contains the last count elements from source.
         */
        takeLast(count: number): T[];

        /**
         * Returns elements from an array as long as a specified condition is true.
         * @param predicate - A function to test each element for a condition.
         * @returns Array<T> - An new array that contains the elements from the input sequence that occur before the element at which the test no longer passes.
         */
        takeWhile(predicate: (item: T, index: number) => boolean): T[];

        /**
         * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
         * @param count - A function to test each element for a condition.
         * @returns Array<T> - An Array<T> that contains the elements that occur after the specified index in the input sequence.
         */
        skip(count: number): T[];

        /**
         * Projects each element of a sequence into a new form by incorporating the element's index.
         * @param selector - A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
         * @returns Array<TResult> - An Array<TResult> whose elements are the result of invoking the transform function on each element of source.
         */
        select<TResult>(selector: (item: T, index: number) => TResult): TResult[];

        /**
         * Projects each element of a sequence to an Array<T> and flattens the resulting sequences into one sequence.
         * @param collectionSelector - A transform function to apply to each element of the input sequence.
         * @returns Array<TOut> - An Array<TOut> whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of source and then mapping each of those sequence elements and their corresponding source element to a result element.
         */
        selectMany<TOut>(collectionSelector: (item: T) => TOut[]): TOut[];

        /**
         * Groups the elements of a sequence according to a key selector function. The keys are compared by using a comparer and each group's elements are projected by using a specified function.
         * @param keySelector - A function to extract the key for each element.
         * @param elementSelector - A function to map each source element to an element in the result grouped element.
         * @returns Array<T> - An array of grouped objects of type TElement.
         */
        groupBy<TKey, TElement>(keySelector?: ((item: T) => TKey) | null, elementSelector?: ((item: T) => TElement) | null): TElement[][];

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

        /**
         * Returns the maximum value in a sequence of values.
         * @param keySelector - A function to extract the key for each element.
         * @returns T - The maximum value in the sequence.
         */
        max(keySelector: ((item: T) => number) | null): T;

        maxValue(keySelector: (item: T) => number): number;

        /**
         * Returns the minimum value in a sequence of values.
         * @param keySelector - A function to extract the key for each element.
         * @returns T - The minimum value in the sequence.
         */
        min(keySelector: ((item: T) => number) | null): T;

        minValue(keySelector: (item: T) => number): number;

        /**
         * Computes the sum of a sequence of numeric values.
         * @param selector - A transform function to apply to each element.
         * @returns number - The sum of the values in the sequence.
         */
        sum(selector?: ((item: T) => number | null | undefined) | null): number;

        /**
         * Returns the number of elements in a sequence.
         * @param predicate - A function to test each element for a condition.
         * @returns number - The number of elements in the input sequence if the predicate is not specified or, otherwise, the number of elements source that passes the test, specified by the predicate.
         */
        count(predicate?: ((item: T, index: number) => boolean) | null): number;

        /**
         * Splits the elements of a sequence into chunks of size at most size.
         * @param size - The maximum size of each chunk.
         * @returns Array<T>[] - An Array<T> that contains the elements the input sequence split into chunks of size size.
         */
        chunk(size: number): T[][];

        /**
         * Splits the elements of a sequence into the specified count of chunks.
         * @param count - The count of chunks.
         * @returns Array<T>[] - An Array<T> that contains the elements of the input sequence is split into the specified count of chunks.
         */
        split(count: number): T[][];

        /**
         * Returns distinct elements from a sequence.
         * @param predicate - A predicate function to get comparable value.
         * @returns Array<T> - An Array<T> that contains distinct elements from the source sequence.
         */
        distinct(predicate?: ((item: T) => any) | null): T[];

        /**
         * Sorts an array in ascending order.
         * @param keySelector1..keySelectorN - A function to extract the key for each element.
         */
        sortBy<TKey1, TKey2, TKey3, TKey4, TKey5, TKey6>(keySelector1?: ((item: T) => TKey1) | null,
                                                         keySelector2?: ((item: T) => TKey2) | null,
                                                         keySelector3?: ((item: T) => TKey3) | null,
                                                         keySelector4?: ((item: T) => TKey4) | null,
                                                         keySelector5?: ((item: T) => TKey5) | null,
                                                         keySelector6?: ((item: T) => TKey6) | null): void;

        sortByDescending<TKey1, TKey2, TKey3, TKey4, TKey5, TKey6>(keySelector1?: ((item: T) => TKey1) | null,
                                                                   keySelector2?: ((item: T) => TKey2) | null,
                                                                   keySelector3?: ((item: T) => TKey3) | null,
                                                                   keySelector4?: ((item: T) => TKey4) | null,
                                                                   keySelector5?: ((item: T) => TKey5) | null,
                                                                   keySelector6?: ((item: T) => TKey6) | null): void;
        forEachAsync(predicate: (item: T) => Promise<void>): Promise<void>;

        /**
         * Returns the first element of a sequence, or a default value if no element is found, or throw error if no default element is not specified.
         * @param predicate - A function to test each element for a condition.
         * @param defaultValue - The default value to return if the sequence is empty.
         * @returns T - defaultValue if source is empty or if no element passes the test specified by predicate; otherwise, the first element in source that passes the test specified by predicate.
         */
        first(predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T;

        /**
         * Returns the first element of a sequence, or a default value if no element is found.
         * @param predicate - A function to test each element for a condition.
         * @param defaultValue - The default value to return if the sequence is empty.
         * @returns T - defaultValue if source is empty or if no element passes the test specified by predicate; otherwise, the first element in source that passes the test specified by predicate.
         */
        firstOrDefault(predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T | null;

        /**
         * Returns the last element of a sequence, or a default value if no element is found, or throw error if no default element is not specified.
         * @param predicate - A function to test each element for a condition.
         * @param defaultValue - The default value to return if the sequence is empty.
         * @returns T - defaultValue if source is empty or if no element passes the test specified by predicate; otherwise, the last element in source that passes the test specified by predicate.
         */
        last(predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T;

        /**
         * Returns the last element of a sequence, or a specified default value if the sequence contains no elements.
         * @param predicate - A function to test each element for a condition.
         * @param defaultValue - The default value to return if the sequence is empty.
         * @returns T - defaultValue if source is empty or if no element passes the test specified by predicate; otherwise, the last element in source that passes the test specified by predicate.
         */
        lastOrDefault(predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T | null;

        /**
         * Generates a sequence that contains one repeated value.
         * @param element - The value to be repeated.
         * @param count - The number of times to repeat the value in the generated sequence.
         * @returns T[] - An Array<T> that contains a repeated value.
         */
        repeat(element: T, count: number): T[];
    }
}

export const ArrayExtensions = function () {

    if (Array.prototype.all == null) {
        Array.prototype.all = function <T>(predicate: (item: T, index: number) => boolean): boolean {
            return ArrayUtility.all(this, predicate);
        };
    }

    if (Array.prototype.any == null) {
        Array.prototype.any = function <T>(predicate?: (item: T, index: number) => boolean): boolean {
            return ArrayUtility.any(this, predicate);
        };
    }

    if (Array.prototype.average == null) {
        Array.prototype.average = function <T>(selector?: ((item: T) => number | null | undefined) | null): number {
            return ArrayUtility.average(this, selector);
        };
    }

    if (Array.prototype.where == null) {
        Array.prototype.where = function <T>(predicate: (item: T) => boolean): T[] {
            return ArrayUtility.where(this, predicate);
        };
    }

    if (Array.prototype.whereAsync == null) {
        Array.prototype.whereAsync = function <T>(predicate: (item: T) => Promise<boolean>): Promise<T[]> {
            return ArrayUtility.whereAsync(this, predicate);
        };
    }

    if (Array.prototype.take == null) {
        Array.prototype.take = function <T>(count: number): T[] {
            return ArrayUtility.take(this, count);
        };
    }

    if (Array.prototype.takeLast == null) {
        Array.prototype.takeLast = function <T>(count: number): T[] {
            return ArrayUtility.takeLast(this, count);
        };
    }

    if (Array.prototype.takeWhile == null) {
        Array.prototype.takeWhile = function <T>(predicate: (item: T, index: number) => boolean): T[] {
            return ArrayUtility.takeWhile(this, predicate);
        };
    }

    if (Array.prototype.skip == null) {
        Array.prototype.skip = function <T>(count: number): T[] {
            return ArrayUtility.skip(this, count);
        };
    }

    if (Array.prototype.select == null) {
        Array.prototype.select = function <T, TResult>(selector: (item: T, index: number) => TResult): TResult[] {
            return ArrayUtility.select(this, selector);
        };
    }

    if (Array.prototype.selectMany == null) {
        Array.prototype.selectMany = function <T, TOut>(collectionSelector: (item: T) => TOut[]): TOut[] {
            return ArrayUtility.selectMany(this, collectionSelector);
        };
    }

    if (Array.prototype.groupBy == null) {
        Array.prototype.groupBy = function <T, TKey, TElement>(keySelector?: ((item: T) => TKey) | null, elementSelector?: ((item: T) => any) | null): TElement[][] {
            return ArrayUtility.groupBy(this, keySelector, elementSelector);
        };
    }

    if (Array.prototype.remove == null) {
        Array.prototype.remove = function <T>(item: T | readonly T[]): void {
            ArrayUtility.remove(this, item);
        };
    }

    if (Array.prototype.removeAt == null) {
        Array.prototype.removeAt = function <T>(index: number): void {
            ArrayUtility.removeAt(this, index);
        };
    }

    if (Array.prototype.max == null) {
        Array.prototype.max = function <T>(keySelector: ((item: T) => number) | null = null): T {
            return ArrayUtility.max(this, keySelector);
        };
    }

    if (Array.prototype.maxValue == null) {
        Array.prototype.maxValue = function <T>(keySelector: (item: T) => number): number {
            return ArrayUtility.maxValue(this, keySelector);
        };
    }

    if (Array.prototype.min == null) {
        Array.prototype.min = function <T>(keySelector: ((item: T) => number) | null = null): T {
            return ArrayUtility.min(this, keySelector);
        };
    }

    if (Array.prototype.minValue == null) {
        Array.prototype.minValue = function <T>(keySelector: (item: T) => number): number {
            return ArrayUtility.minValue(this, keySelector);
        };
    }

    if (Array.prototype.sum == null) {
        Array.prototype.sum = function <T>(selector?: ((item: T) => number | null | undefined) | null): number {
            return ArrayUtility.sum(this, selector);
        };
    }

    if (Array.prototype.count == null) {
        Array.prototype.count = function <T>(predicate?: ((item: T, index: number) => boolean) | null): number {
            return ArrayUtility.count(this, predicate);
        };
    }

    if (Array.prototype.chunk == null) {
        Array.prototype.chunk = function <T>(size: number): T[][] {
            return ArrayUtility.chunk(this, size);
        };
    }

    if (Array.prototype.split == null) {
        Array.prototype.split = function <T>(count: number): T[][] {
            return ArrayUtility.split(this, count);
        };
    }

    if (Array.prototype.distinct == null) {
        Array.prototype.distinct = function <T>(predicate?: ((item: T) => any) | null): T[] {
            return ArrayUtility.distinct(this, predicate);
        };
    }

    if (Array.prototype.sortBy == null) {
        Array.prototype.sortBy = function <T, TKey1, TKey2, TKey3, TKey4, TKey5, TKey6>(keySelector1?: ((item: T) => TKey1) | null,
                                                                                        keySelector2?: ((item: T) => TKey2) | null,
                                                                                        keySelector3?: ((item: T) => TKey3) | null,
                                                                                        keySelector4?: ((item: T) => TKey4) | null,
                                                                                        keySelector5?: ((item: T) => TKey5) | null,
                                                                                        keySelector6?: ((item: T) => TKey6) | null): void {
            ArrayUtility.sortBy(this, keySelector1, keySelector2, keySelector3, keySelector4, keySelector5, keySelector6);
        };
    }

    if (Array.prototype.sortByDescending == null) {
        Array.prototype.sortByDescending = function <T, TKey1, TKey2, TKey3, TKey4, TKey5, TKey6>(keySelector1?: ((item: T) => TKey1) | null,
                                                                                                  keySelector2?: ((item: T) => TKey2) | null,
                                                                                                  keySelector3?: ((item: T) => TKey3) | null,
                                                                                                  keySelector4?: ((item: T) => TKey4) | null,
                                                                                                  keySelector5?: ((item: T) => TKey5) | null,
                                                                                                  keySelector6?: ((item: T) => TKey6) | null): void {
            ArrayUtility.sortByDescending(this, keySelector1, keySelector2, keySelector3, keySelector4, keySelector5, keySelector6);
        };
    }

    if (Array.prototype.forEachAsync == null) {
        Array.prototype.forEachAsync = function <T>(predicate: (item: T) => Promise<void>): Promise<void> {
            return ArrayUtility.forEachAsync(this, predicate);
        };
    }

    if (Array.prototype.first == null) {
        Array.prototype.first = function <T>(predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T {
            return ArrayUtility.first(this, predicate, defaultValue);
        };
    }

    if (Array.prototype.firstOrDefault == null) {
        Array.prototype.firstOrDefault = function <T>(predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T | null {
            return ArrayUtility.firstOrDefault(this, predicate, defaultValue);
        };
    }

    if (Array.prototype.last == null) {
        Array.prototype.last = function <T>(predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T {
            return ArrayUtility.last(this, predicate, defaultValue);
        };
    }

    if (Array.prototype.lastOrDefault == null) {
        Array.prototype.lastOrDefault = function <T>(predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T | null {
            return ArrayUtility.lastOrDefault(this, predicate, defaultValue);
        };
    }

    if (Array.prototype.repeat == null) {
        Array.prototype.repeat = function <T>(element: T, count: number): T[] {
            return ArrayUtility.repeat(element, count);
        };
    }
}

ArrayExtensions();