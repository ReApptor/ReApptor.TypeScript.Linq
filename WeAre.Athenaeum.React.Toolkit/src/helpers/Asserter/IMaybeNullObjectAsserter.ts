import {IBaseAsserter} from "./IBaseAsserter";

export interface IMaybeNullObjectAsserter extends IBaseAsserter<object | null> {

    /**
     * Assert that the {@link Object} is null.
     */
    isNull: IBaseAsserter<null>;

    /**
     * Assert that the {@link Object} is not null.
     */
    isNotNull: IBaseAsserter<object>;
}