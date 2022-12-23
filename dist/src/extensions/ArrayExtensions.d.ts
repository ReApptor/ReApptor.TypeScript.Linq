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
         * Projects each element of a sequence to an Array<T> and flattens the resulting sequences into one sequence.
         * @param collectionSelector - A transform function to apply to each element of the input sequence.
         * @returns Array<TOut> - An Array<TOut> whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of source and then mapping each of those sequence elements and their corresponding source element to a result element.
         */
        selectMany<TOut>(collectionSelector: (item: T) => TOut[]): TOut[];
        groupBy(predicate: ((item: T) => any) | null | undefined): T[][];
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
         * @param predicate - A function to test each element for a condition.
         * @returns T - The maximum value in the sequence.
         */
        max(predicate: ((item: T) => number) | null): T;
        maxValue(predicate: (item: T) => number): number;
        /**
         * Returns the minimum value in a sequence of values.
         * @param predicate - A function to test each element for a condition.
         * @returns T - The minimum value in the sequence.
         */
        min(predicate: ((item: T) => number) | null): T;
        minValue(predicate: (item: T) => number): number;
        /**
         * Computes the sum of a sequence of numeric values.
         * @param predicate - A function to test each element for a condition.
         * @returns number - The sum of the values in the sequence.
         */
        sum(predicate: (item: T) => number | null | undefined): number;
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
         * Returns distinct elements from a sequence.
         * @param predicate - A predicate function to get comparable value.
         * @returns Array<T> - An Array<T> that contains distinct elements from the source sequence.
         */
        distinct(predicate?: ((item: T) => any) | null): T[];
        sortBy<TKey1, TKey2, TKey3, TKey4, TKey5, TKey6>(keySelector1?: ((item: T) => TKey1) | null, keySelector2?: ((item: T) => TKey2) | null, keySelector3?: ((item: T) => TKey3) | null, keySelector4?: ((item: T) => TKey4) | null, keySelector5?: ((item: T) => TKey5) | null, keySelector6?: ((item: T) => TKey6) | null): void;
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
export declare const ArrayExtensions: () => void;
