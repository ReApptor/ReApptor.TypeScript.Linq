export interface IBaseAsserter<T> {

    /**
     * Was the assertion successfull.
     */
    getIsSuccess: boolean;

    /**
     * The value under assertion.
     * @throws TypeError Assertion failed.
     */
    getValue: T;
}