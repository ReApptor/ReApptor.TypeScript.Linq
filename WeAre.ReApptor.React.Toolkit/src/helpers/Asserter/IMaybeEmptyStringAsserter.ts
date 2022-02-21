import {IBaseAsserter} from "./IBaseAsserter";
import {IStringAsserter} from "./IStringAsserter";

export interface IMaybeEmptyStringAsserter extends IBaseAsserter<string> {

    /**
     * Assert that the {@link string} is empty.
     */
    isEmpty: IBaseAsserter<"">;

    /**
     * Assert that the {@link string} is not empty.
     */
    isNotEmpty: IStringAsserter;
}