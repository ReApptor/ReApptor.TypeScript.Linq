import {IBaseAsserter} from "./IBaseAsserter";
import {IUnknownAsserter} from "./IUnknownAsserter";
import {IBooleanAsserter} from "./IBooleanAsserter";
import {IBigIntAsserter} from "./IBigIntAsserter";
import {INumberAsserter} from "./INumberAsserter";
import {IMaybeNullObjectAsserter} from "./IMaybeNullObjectAsserter";
import {IStringAsserter} from "./IStringAsserter";
import {IObjectAsserter} from "./IObjectAsserter";
import {IMaybeEmptyStringAsserter} from "./IMaybeEmptyStringAsserter";
import {IArrayAsserter} from "./IArrayAsserter";
import {IMaybeEmptyArrayAsserter} from "./IMaybeEmptyArrayAsserter";

abstract class BaseAsserter<T> implements IBaseAsserter<T> {
    protected readonly _value: T;
    protected readonly _name: string;
    protected _error: TypeError | null;

    protected constructor(value: T, name: string | null = null, error: TypeError | null = null) {
        this._value = value;
        this._name = (typeof name === "string")
            ? name
            : "value"
        this._error = (error instanceof TypeError)
            ? error
            : null;
    }

    protected assert(predicate: {(value: unknown): boolean}, errorMessage: string): void {
        if (this._error) {
            return;
        }
        if (!predicate(this._value)) {
            this._error = new TypeError(`${this._name} ${errorMessage}`);
        }
    }

    public get getValue(): any {
        if (this._error) {
            throw this._error;
        }
        return this._value;
    }

    public get getIsSuccess(): boolean {
        return (this._error === null);
    }
}

class UnknownAsserter extends BaseAsserter<unknown> implements IUnknownAsserter {

    public constructor(value: unknown, name: string | null = null, error: TypeError | null = null) {
        super(value, name, error);
    }

    public get isBoolean(): IBooleanAsserter {
        this.assert((value) => (typeof value === "boolean"), "is not a boolean");
        return new BooleanAsserter(this._value as boolean, this._name, this._error);
    }

    public get isBigInt(): IBigIntAsserter {
        this.assert((value) => (typeof value === "bigint"), "is not a bigint");
        return new BigIntAsserter(this._value as bigint, this._name, this._error);
    }

    public get isNumber(): INumberAsserter {
        this.assert((value) => (typeof value === "number"), "is not a number");
        return new NumberAsserter(this._value as number, this._name, this._error);
    }

    public get isObject(): IMaybeNullObjectAsserter {
        this.assert((value) => (typeof value === "object"), "is not an object");
        return new MaybeNullObjectAsserter(this._value as object, this._name, this._error);
    }

    public get isString(): IMaybeEmptyStringAsserter {
        this.assert((value) => (typeof value === "string"), "is not a string");
        return new MaybeEmptyStringAsserter(this._value as string, this._name, this._error);
    }

    public get isSymbol(): IBaseAsserter<symbol> {
        this.assert((value) => (typeof value === "symbol"), "is not a symbol");
        return this;
    }

    public get isUndefined(): IBaseAsserter<undefined> {
        this.assert((value) => (typeof value === "undefined"), "is not undefined");
        return this;
    }
}

class BigIntAsserter extends BaseAsserter<bigint> implements IBigIntAsserter {

    public constructor(value: bigint, name: string | null, error: TypeError | null) {
        super(value, name, error);
    }
}

class BooleanAsserter extends BaseAsserter<boolean> implements IBooleanAsserter {

    public constructor(value: boolean, name: string | null, error: TypeError | null) {
        super(value, name, error);
    }

    public get isFalse(): IBaseAsserter<false> {
        this.assert((value) => (value === false), "is not false");
        return this;
    }

    public get isTrue(): IBaseAsserter<true> {
        this.assert((value) => (value === true), "is not true");
        return this;
    }
}

class NumberAsserter extends BaseAsserter<number> implements INumberAsserter {

    public constructor(value: number, name: string | null, error: TypeError | null) {
        super(value, name, error);
    }
}

class MaybeNullObjectAsserter extends BaseAsserter<object> implements IMaybeNullObjectAsserter {

    public constructor(value: object, name: string | null, error: TypeError | null) {
        super(value, name, error);
    }

    public get isNull(): IBaseAsserter<null> {
        this.assert((value) => (value === null), "is not null");
        return this;
    }

    public get isNotNull(): IObjectAsserter<object> {
        this.assert((value) => (value !== null), "is null");
        return new ObjectAsserter(this._value, this._name, this._error);
    }
}

class ObjectAsserter extends BaseAsserter<object> implements IObjectAsserter<object> {

    public constructor(value: object, name: string | null, error: TypeError | null) {
        super(value, name, error);
    }

    public get isArray(): IMaybeEmptyArrayAsserter {
        this.assert((value) => (Array.isArray(value)), "is not an array");
        return new MaybeEmptyArrayAsserter(this._value as unknown[], this._name, this._error);
    }

    public isInstanceOf<TOther extends object>(constructor: { new(): TOther; }): IObjectAsserter<TOther> {
        this.assert((value) => (value instanceof constructor), `is not an instance of ${constructor?.name}`);
        return this;
    }
}

class MaybeEmptyArrayAsserter extends BaseAsserter<unknown[]> implements IMaybeEmptyArrayAsserter {

    public constructor(value: unknown[], name: string | null, error: TypeError | null) {
        super(value, name, error);
    }

    public get isEmpty(): IBaseAsserter<unknown[]> {
        this.assert((value) => ((value as unknown[]).length <= 0), "is not empty");
        return this;
    }

    public get isNotEmpty(): IArrayAsserter<unknown> {
        this.assert((value) => ((value as unknown[]).length > 0), "is empty");
        return new ArrayAsserter(this._value, this._name, this._error);
    }
}

class ArrayAsserter extends BaseAsserter<unknown[]> implements IArrayAsserter<unknown> {

    public constructor(value: unknown[], name: string | null, error: TypeError | null) {
        super(value, name, error);
    }

    public all(predicate: {(value: unknown): boolean}): IArrayAsserter<unknown> {
        this.assert((array) => ((array as unknown[]).every((value) => predicate(value))), ": not all values fulfill the predicate");
        return this;
    }

    public any(predicate: {(value: unknown): boolean}): IArrayAsserter<unknown> {
        this.assert((array) => ((array as unknown[]).some((value) => predicate(value))), ": no value fulfills the predicate");
        return this;
    }

    public none(predicate: {(value: unknown): boolean}): IArrayAsserter<unknown> {
        this.assert((array) => !((array as unknown[]).some((value) => predicate(value))), ": all values fulfill the predicate");
        return this;
    }
}

class MaybeEmptyStringAsserter extends BaseAsserter<string> implements IMaybeEmptyStringAsserter {

    public constructor(value: string, name: string | null, error: TypeError | null) {
        super(value, name, error);
    }

    public get isEmpty(): IBaseAsserter<""> {
        this.assert((value) => (value === ""), "is not empty");
        return this;
    }

    public get isNotEmpty(): IStringAsserter {
        this.assert((value) => (value !== ""), "is empty");
        return new StringAsserter(this._value, this._name, this._error);
    }
}

class StringAsserter extends BaseAsserter<string> implements IStringAsserter {

    private readonly whitespaceRegexp: RegExp = /^\s+$/;

    public constructor(value: string, name: string | null, error: TypeError | null) {
        super(value, name, error);
    }

    public get isWhitespace(): IStringAsserter {
        this.assert((value) => (this.whitespaceRegexp.test(value as string)), "is not empty");
        return this;
    }

    public get isNotWhitespace(): IStringAsserter {
        this.assert((value) => (!this.whitespaceRegexp.test(value as string)), "is not empty");
        return this;
    }
}

/**
 * Start performing assertions on a value.
 * @param value Value to perform assertions against.
 * @param name Name of the value. Used in error messages.
 */
export default function assert(value: unknown, name: string | null = null): IUnknownAsserter {
    return new UnknownAsserter(value, name);
}