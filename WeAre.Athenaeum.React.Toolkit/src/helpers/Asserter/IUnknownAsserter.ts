import {IBaseAsserter} from "./IBaseAsserter";
import {IBooleanAsserter} from "./IBooleanAsserter";
import {IBigIntAsserter} from "./IBigIntAsserter";
import {IMaybeNullObjectAsserter} from "./IMaybeNullObjectAsserter";
import {IStringAsserter} from "./IStringAsserter";
import {INumberAsserter} from "./INumberAsserter";

export interface IUnknownAsserter extends IBaseAsserter<unknown> {

    /**
     * Assert that the value is a {@link boolean}.
     */
    isBoolean: IBooleanAsserter;

    /**
     * Assert that the value is a {@link BigInt}.
     */
    isBigInt: IBigIntAsserter;

    /**
     * Assert that the value is a {@link number}.
     */
    isNumber: INumberAsserter;

    /**
     * Assert that the value is an {@link Object}.
     */
    isObject: IMaybeNullObjectAsserter;

    /**
     * Assert that the value is a {@link string}.
     */
    isString: IStringAsserter;

    /**
     * Assert that the value is a {@link Symbol}.
     */
    isSymbol: IBaseAsserter<symbol>;

    /**
     * Assert that the value is undefined.
     */
    isUndefined: IBaseAsserter<undefined>;
}