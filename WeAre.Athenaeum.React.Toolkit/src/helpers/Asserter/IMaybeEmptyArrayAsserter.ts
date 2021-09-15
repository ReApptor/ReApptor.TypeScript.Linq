import {IBaseAsserter} from "./IBaseAsserter";
import {IArrayAsserter} from "./IArrayAsserter";

export interface IMaybeEmptyArrayAsserter extends IBaseAsserter<unknown[]> {

    /**
     * Assert that the {@link Array} is empty.
     */
    isEmpty: IBaseAsserter<unknown[]>;

    /**
     * Assert that the {@link Array} is not empty.
     */
    isNotEmpty: IArrayAsserter<unknown>;
}