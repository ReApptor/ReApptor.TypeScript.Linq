import {IBaseAsserter} from "./IBaseAsserter";

export interface IBooleanAsserter extends IBaseAsserter<boolean> {

    /**
     * Assert that the {@link boolean} is false.
     */
    isFalse: IBaseAsserter<false>;

    /**
     * Assert that the {@link boolean} is true.
     */
    isTrue: IBaseAsserter<true>;
}