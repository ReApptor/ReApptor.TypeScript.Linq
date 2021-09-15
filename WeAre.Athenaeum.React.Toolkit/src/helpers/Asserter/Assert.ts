import {IBaseAsserter} from "./IBaseAsserter";
import {IUnknownAsserter} from "./IUnknownAsserter";
import {IBooleanAsserter} from "./IBooleanAsserter";
import {IBigIntAsserter} from "./IBigIntAsserter";
import {INumberAsserter} from "./INumberAsserter";
import {IMaybeNullObjectAsserter} from "./IMaybeNullObjectAsserter";
import {IStringAsserter} from "./IStringAsserter";
import {IObjectAsserter} from "./IObjectAsserter";


class AsserterImplementation implements IBaseAsserter<unknown>, IUnknownAsserter, IBooleanAsserter, IBigIntAsserter, IMaybeNullObjectAsserter, INumberAsserter, IObjectAsserter<object>, IStringAsserter {
    private readonly _value: unknown;
    private readonly _name: string;
    private _error: TypeError | null;

    private constructor(value: unknown, name: string | null) {
        this._value = value;
        this._name = (typeof name === "string")
            ? name
            : "value"
        this._error = null;
    }

    private assert(predicate: {(value: unknown): boolean}, errorMessage: string): void {
        if (this._error) {
            return;
        }
        if (!predicate(this._value)) {
            this._error = new TypeError(`${this._name} ${errorMessage}`);
        }
    }

    public static assert(value: unknown, name: string | null = null): IUnknownAsserter {
        return new AsserterImplementation(value, name);
    }

    // IBaseAsserter

    public get getValue(): any {
        if (this._error) {
            throw this._error;
        }
        return this._value;
    }

    public get getIsSuccess(): boolean {
        return (this._error === null);
    }

    // IUnknownAsserter

    public get isBoolean(): IBooleanAsserter {
        this.assert((value) => (typeof value === "boolean"), "is not a boolean");
        return this;
    }

    public get isBigInt(): IBigIntAsserter {
        this.assert((value) => (typeof value === "bigint"), "is not a bigint");
        return this;
    }

    public get isNumber(): INumberAsserter {
        this.assert((value) => (typeof value === "number"), "is not a number");
        return this as INumberAsserter;
    }

    public get isObject(): IMaybeNullObjectAsserter {
        this.assert((value) => (typeof value === "object"), "is not an object");
        return this;
    }

    public get isString(): IStringAsserter {
        this.assert((value) => (typeof value === "string"), "is not a string");
        return this;
    }

    public get isSymbol(): IBaseAsserter<symbol> {
        this.assert((value) => (typeof value === "symbol"), "is not a symbol");
        return this;
    }

    public get isUndefined(): IBaseAsserter<undefined> {
        this.assert((value) => (typeof value === "undefined"), "is not undefined");
        return this;
    }

    // IBaseNumberAsserter

    // IBooleanAsserter

    public get isFalse(): IBaseAsserter<false> {
        this.assert((value) => (value === false), "is not false");
        return this;
    }

    public get isTrue(): IBaseAsserter<true> {
        this.assert((value) => (value === true), "is not true");
        return this;
    }

    // IMaybeNullObjectAsserter

    public get isNull(): IBaseAsserter<null> {
        this.assert((value) => (value === null), "is not null");
        return this;
    }

    public get isNotNull(): IObjectAsserter<object> {
        this.assert((value) => (value !== null), "is null");
        return this;
    }

    // INumberAsserter

    // IObjectAsserter

    public isInstanceOf<TOther extends object>(constructor: { new(): TOther; }): IObjectAsserter<TOther> {
        this.assert((value) => (value instanceof constructor), `is not an instance of ${constructor?.name}`);
        return this;
    }

    // IStringAsserter
}

/**
 * Start performing assertions on a value.
 * @param value Value to perform assertions against.
 * @param name Name of the value. Used in error messages.
 */
export default function assert(value: unknown, name: string | null = null): IUnknownAsserter {
    return AsserterImplementation.assert(value, name)
}