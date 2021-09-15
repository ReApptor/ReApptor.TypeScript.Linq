import {IBaseAsserter} from "./IBaseAsserter";

export interface IStringAsserter extends IBaseAsserter<string> {

    /**
     * Assert that the {@link string} only contains whitespace characters.
     */
    isWhitespace: IStringAsserter;

    /**
     * Assert that the {@link string} does not only contain whitespace characters.
     */
    isNotWhitespace: IStringAsserter;
}