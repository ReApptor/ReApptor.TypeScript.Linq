import {IBaseAsserter} from "./IBaseAsserter";
import {IMaybeEmptyArrayAsserter} from "./IMaybeEmptyArrayAsserter";

export interface IObjectAsserter<T extends Object> extends IBaseAsserter<T> {

    /**
     * Assert that the {@link Object} is an {@link Array}.
     */
    isArray: IMaybeEmptyArrayAsserter;

    /**
     * Assert that the {@link Object} has the given constructor in its prototype chain.
     */
    isInstanceOf<TOther extends Object>(constructor: { new(): TOther; }): IObjectAsserter<TOther>;

}