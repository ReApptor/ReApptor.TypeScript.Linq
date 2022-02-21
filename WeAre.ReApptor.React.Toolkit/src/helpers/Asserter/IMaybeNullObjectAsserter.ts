import {IBaseAsserter} from "./IBaseAsserter";
import {IObjectAsserter} from "./IObjectAsserter";

export interface IMaybeNullObjectAsserter extends IBaseAsserter<object | null> {

    /**
     * Assert that the {@link Object} is null.
     */
    isNull: IBaseAsserter<null>;

    /**
     * Assert that the {@link Object} is not null.
     */
    isNotNull: IObjectAsserter<object>;
}