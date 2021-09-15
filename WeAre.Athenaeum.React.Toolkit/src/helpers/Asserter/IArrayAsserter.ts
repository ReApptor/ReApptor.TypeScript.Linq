import {IBaseAsserter} from "./IBaseAsserter";

export interface IArrayAsserter<T> extends IBaseAsserter<T[]> {

    /**
     * Assert that all values in the {@link Array} fulfill the given predicate.
     */
    all(predicate: {(value: T): boolean}): IArrayAsserter<T>;

    /**
     * Assert that at least a single value in the {@link Array} fulfills the given predicate.
     */
    any(predicate: {(value: T): boolean}): IArrayAsserter<T>;

    /**
     * Assert that no value in the {@link Array} fulfills the given predicate.
     */
    none(predicate: {(value: T): boolean}): IArrayAsserter<T>;
}