/// <reference types="node" />
import { Dictionary } from 'typescript-collections';

export declare const ArrayExtensions: () => void;

export declare class ArrayUtility {
    static sortByProperty<TItem>(propertyName: string, sortDirection?: SortDirection | null): (a: TItem, b: TItem) => number;
    static sort<TItem>(first: TItem | any, second: TItem | any, sortingType?: SortDirection | null): number;
    static order<TSource, TKey1, TKey2, TKey3, TKey4, TKey5>(source: TSource[], keySelector1: ((item: TSource) => TKey1), keySelector2?: ((item: TSource) => TKey2), keySelector3?: ((item: TSource) => TKey3), keySelector4?: ((item: TSource) => TKey4), keySelector5?: ((item: TSource) => TKey5)): void;
    static chunk<TItem>(givenArray: TItem[], chunkSize: number): TItem[][];
    static take<T>(items: readonly T[], count: number): T[];
    static skip<T>(items: readonly T[], count: number): T[];
}

export declare class AthenaeumConstants {
    static readonly badRequestStatusCode: number;
    static readonly unauthorizedStatusCode: number;
    static readonly forbiddenStatusCode: number;
    static readonly notFoundStatusCode: number;
    static readonly internalServerErrorStatusCode: number;
    static readonly okStatusCode: number;
    static readonly newLineRegex: RegExp;
    static readonly markTagRegex: RegExp;
    static readonly smallTagRegex: RegExp;
    static readonly defaultGuid: string;
}

export declare abstract class BaseEnumProvider<TSelectListItem extends ISelectListItem> implements IEnumProvider, IService {
    private _localizer;
    protected constructor();
    protected abstract get types(): readonly string[];
    protected abstract createSelectListItem(value: string, text: string, subtext: string): TSelectListItem;
    protected getEnumLocalizedName(enumType: string, enumName: string): string;
    protected getEnumLocalizedDescription(enumType: string, enumName: string): string;
    protected transform(enumSymbol: any, enumType: string, enumValue: any): TSelectListItem;
    protected getItems(enumSymbol: any, enumType: string, reverse?: boolean): TSelectListItem[];
    protected get localizer(): ILocalizer;
    getType(): ServiceType;
    getEnumItems(enumName: string, selectedValues?: number[] | null, reverse?: boolean): TSelectListItem[];
    getEnumItem(enumName: string, value: any): TSelectListItem;
    getEnumText(enumName: string, value: any): string;
    getEnumName(enumName: string, value: any): string;
    isEnum(typeName: string): boolean;
    getValues(enumSymbol: any, reverse?: boolean): number[];
}

export declare abstract class BaseLocalizer implements ILocalizer, IService {
    private readonly _items;
    private readonly _supportedLanguages;
    private readonly _supportedLanguageCodes;
    private readonly _defaultLanguage;
    private _language;
    protected constructor(supportedLanguages: ILanguage[], language: string);
    protected getLanguageItems(language: string): Dictionary<string, string>;
    protected setItem(name: string, language: string, value: string): void;
    protected set(name: string, ...params: {
        language: string;
        value: string;
    }[]): void;
    getType(): ServiceType;
    get(name: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string;
    contains(name: string): boolean;
    findLanguage(language: string | null | undefined): ILanguage;
    setLanguage(language: string): boolean;
    get supportedLanguageCodes(): string[];
    get supportedLanguages(): ILanguage[];
    get language(): string;
    get defaultLanguage(): string;
}

export declare abstract class BaseTransformProvider implements ITransformProvider, IService {
    protected constructor();
    getType(): ServiceType;
    locationToString(location: GeoLocation | null): string;
    toString(item: any, format?: TFormat | null): string;
}

export declare class BoolUtility {
    static compare(x: boolean, y: boolean, inverse?: boolean): number;
}

export declare const DateExtensions: () => void;

export declare class DateUtility {
    static compare(x: Date | string, y: Date | string, inverse?: boolean): number;
    static equals(x: Date | string, y: Date | string): boolean;
}

export declare class FileModel {
    constructor(src?: string | null);
    id: string;
    name: string;
    size: number;
    type: string;
    src: string;
    lastModified: Date;
    readonly isFileModel: boolean;
}

export declare class GeoCoordinate {
    constructor(latitude?: number | null | undefined, longitude?: number | null | undefined);
    lat: number;
    lon: number;
    isGeoCoordinate: boolean;
}

export declare class GeoLocation extends GeoCoordinate {
    country: string;
    address: string;
    city: string;
    postalCode: string;
    postalBox: string;
    formattedAddress: string;
    isGeoLocation: boolean;
}

export declare class HashCodeUtility {
    private static inc;
    private static object;
    static getStringHashCode(value: string): number;
    static getNumberHashCode(value: number): number;
    static getBooleanHashCode(value: boolean): number;
    static getDateHashCode(value: Date): number;
    /**
     * Serves as the default hash function.
     * @returns Number - A hash code for the current object.
     */
    static getHashCode(value: any | null | undefined): number;
}

export declare interface IEnumProvider {
    isEnum(typeName: string): boolean;
    getEnumText(enumName: string, value: any): string;
}

export declare interface ILanguage {
    readonly label: string;
    readonly code: string;
}

export declare interface ILocalizer {
    get(name: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined)[]): string;
    contains(name: string): boolean;
    setLanguage(language: string): boolean;
}

export declare interface INumberFormat {
    step: number;
    format: TFormat;
}

export declare interface IPagedList<T = {}> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    pageCount: number;
    totalItemCount: number;
}

export declare interface ISelectListItem {
    value: string;
    text: string;
    selected: boolean;
    disabled: boolean;
}

export declare interface IService {
    /**
     * Gets the Type of the current instance.
     * @returns ServiceType - The exact runtime type of the current instance.
     */
    getType(): ServiceType;
}

export declare interface ITransformProvider {
    toString(item: any, format?: TFormat | null): string;
}

export declare const NumberExtensions: () => void;

export declare class NumberParsingResult {
    constructor(value?: number | null | undefined);
    value: number;
    inputStr: string;
    acceptableStr: string | null;
    valueStr: string;
    parsed: boolean;
}

export declare class NumberUtility {
    static compare(x: number, y: number, inverse?: boolean): number;
    static parse(str: string, allowFloat?: boolean, maxLength?: number): NumberParsingResult;
    private static _formats;
    static resolveFormat(step: number | null | undefined, format: TFormat | null | undefined, defaultFormat?: string | null | undefined): INumberFormat;
}

export declare const PwaHelper: PwaHelper_2;

declare class PwaHelper_2 {
    private _deferredPrompt;
    private _initializeCallback;
    private _accepted;
    onBeforeInstallPrompt(e: Event): void;
    installAsync(): Promise<boolean>;
    get initialized(): boolean;
    get canBeInstalled(): boolean;
    subscribe(initializeCallback: PwaInitializeCallback): void;
}

declare type PwaInitializeCallback = () => Promise<void>;

export declare const ServiceProvider: ServiceProvider_2;

declare class ServiceProvider_2 {
    private readonly _services;
    /**
     * Gets the service object of the specified type.
     * @param serviceType - An object that specifies the type of service object to get.
     * @returns IService | object | null - A service object of type serviceType or null if there is no service object of type serviceType.
     */
    getService<T extends IService | object = {}>(serviceType: ServiceType): T | null;
    /**
     * Get service of type serviceType from the IServiceProvider.
     * @param serviceType - An object that specifies the type of service object to get.
     * @returns A service object of type serviceType.
     * @exception InvalidOperationException There is no service of type serviceType.
     */
    getRequiredService<T extends IService | object = {}>(serviceType: ServiceType): T;
    /**
     * Adds a singleton service of the type specified in serviceType.
     * @param service - A service instance.
     * @param serviceType - An object that specifies the type of service object to get.
     */
    addSingleton(service: IService | object, serviceType?: ServiceType | null): void;
    getLocalizer(): ILocalizer | null;
    getEnumProvider(): IEnumProvider | null;
    getTransformProvider(): ITransformProvider | null;
}

export declare type ServiceType = string;

declare enum SortDirection {
    Asc = 0,
    Desc = 1
}

export declare const StringExtensions: () => void;

export declare class StringUtility {
    static compare(x: string, y: string, inverse?: boolean): number;
}

export declare type TFormat = string | TStringTransformer;

export declare class TimeSpan {
    static readonly millisecondsPerSecond: number;
    static readonly millisecondsPerMinute: number;
    static readonly millisecondsPerHour: number;
    static readonly millisecondsPerDay: number;
    private _totalMilliseconds;
    /**
     * Initializes a new instance of the TimeSpan structure to a specified number of days, hours, minutes, seconds, and milliseconds.
     * @param days - Number of days.
     * @param hours - Number of hours.
     * @param minutes - Number of minutes.
     * @param seconds - Number of seconds.
     * @param milliseconds - Number of milliseconds.
     */
    constructor(days?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number);
    /**
     * Gets the value of the current TimeSpan structure expressed in whole and fractional milliseconds.
     */
    get totalMilliseconds(): number;
    /**
     * Gets the value of the current TimeSpan structure expressed in whole and fractional seconds.
     */
    get totalSeconds(): number;
    /**
     * Gets the value of the current TimeSpan structure expressed in whole and fractional minutes.
     */
    get totalMinutes(): number;
    /**
     * Gets the value of the current TimeSpan structure expressed in whole and fractional hours.
     */
    get totalHours(): number;
    /**
     * Gets the value of the current TimeSpan structure expressed in whole and fractional days.
     */
    get totalDays(): number;
    /**
     * Gets the days component of the time interval represented by the current TimeSpan structure.
     */
    get days(): number;
    /**
     * Gets the hours component of the time interval represented by the current TimeSpan structure.
     */
    get hours(): number;
    /**
     * Gets the minutes component of the time interval represented by the current TimeSpan structure.
     */
    get minutes(): number;
    /**
     * Gets the seconds component of the time interval represented by the current TimeSpan structure.
     */
    get seconds(): number;
    /**
     * Gets the milliseconds component of the time interval represented by the current TimeSpan structure.
     */
    get milliseconds(): number;
    /**
     * Returns a new TimeSpan object whose value is the sum of the specified TimeSpan object and this instance.
     * @param ts - The time interval to add.
     * @returns TimeSpan - A new object that represents the value of this instance plus the value of ts.
     */
    add(ts: TimeSpan): TimeSpan;
    /**
     * Returns a new TimeSpan object whose value is the difference between the specified TimeSpan object and this instance.
     * @param ts - The time interval to be subtracted.
     * @returns TimeSpan - A new time interval whose value is the result of the value of this instance minus the value of ts.
     */
    subtract(ts: TimeSpan): TimeSpan;
    /**
     * Returns a new TimeSpan object which value is the result of multiplication of this instance and the specified factor.
     * @param factor - The value to be multiplied by.
     * @returns TimeSpan - A new object that represents the value of this instance multiplied by the value of factor.
     */
    multiply(factor: number): TimeSpan;
    /**
     * Returns a new TimeSpan object whose value is the negated value of this instance.
     * @returns TimeSpan - A new object with the same numeric value as this instance, but with the opposite sign.
     */
    negate(): TimeSpan;
    toTimeString(): string;
    toShortTimeString(): string;
    /**
     * Returns a TimeSpan that represents a specified number of days, where the specification is accurate to the nearest millisecond.
     * @param days - A number of days, accurate to the nearest millisecond.
     * @returns TimeSpan - An object that represents value.
     */
    static fromDays(days: number): TimeSpan;
    /**
     * Returns a TimeSpan that represents a specified number of hours, where the specification is accurate to the nearest millisecond.
     * @param hours - A number of hours accurate to the nearest millisecond.
     * @returns TimeSpan - An object that represents value.
     */
    static fromHours(hours: number): TimeSpan;
    /**
     * Returns a TimeSpan that represents a specified number of minutes, where the specification is accurate to the nearest millisecond.
     * @param minutes - A number of minutes, accurate to the nearest millisecond.
     * @returns TimeSpan - An object that represents value.
     */
    static fromMinutes(minutes: number): TimeSpan;
    /**
     * Returns a TimeSpan that represents a specified number of seconds, where the specification is accurate to the nearest millisecond.
     * @param seconds - A number of seconds, accurate to the nearest millisecond.
     * @returns TimeSpan - An object that represents value.
     */
    static fromSeconds(seconds: number): TimeSpan;
    /**
     * Returns a TimeSpan that represents a specified number of milliseconds.
     * @param milliseconds - A number of milliseconds.
     * @returns TimeSpan - An object that represents value.
     */
    static fromMilliseconds(milliseconds: number): TimeSpan;
    /**
     * Compares this instance to a specified TimeSpan object and returns an integer that indicates whether this instance is shorter than, equal to, or longer than the TimeSpan object.
     * @param value - An object to compare to this instance.
     * @returns number - A signed number indicating the relative values of this instance and value.
     * "A negative integer": This instance is shorter than value.
     * "Zero": This instance is equal to value.
     * "A positive integer": This instance is longer than value.
     */
    compareTo(value: TimeSpan): number;
    /**
     * Returns a hash code for this instance.
     * @returns number - A 32-bit signed integer hash code.
     */
    getHashCode(): number;
    /**
     * Returns a value indicating whether this instance is equal to a specified TimeSpan object.
     * @param obj - An object to compare with this instance.
     * @returns boolean - true if obj represents the same time interval as this instance; otherwise, false.
     */
    equals(obj: TimeSpan): boolean;
    /**
     * Compares two TimeSpan values and returns an integer that indicates whether the first value is shorter than, equal to, or longer than the second value.
     * @param t1 - The first time interval to compare.
     * @param t2 - The second time interval to compare.
     * @returns number - One of the following values.
     * "-1": t1 is shorter than t2.
     * "0": t1 is equal to t2.
     * "1": t1 is longer than t2.
     */
    static compare(t1: TimeSpan, t2: TimeSpan): number;
    /**
     * Returns a value that indicates whether two specified instances of TimeSpan are equal.
     * @param t1 - The first time interval to compare.
     * @param t2 - The second time interval to compare.
     * @returns boolean - true if the values of t1 and t2 are equal; otherwise, false.
     */
    static equals(t1: TimeSpan, t2: TimeSpan): boolean;
}

declare type TStringTransformer = (value: any) => string;

export declare class Utility {
    private static _geoEnabled;
    static setTimeout(asyncCallback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timeout;
    static wait(ms: number): Promise<NodeJS.Timeout>;
    static get geoEnabled(): boolean;
    static getPositionAsync(options?: PositionOptions | null | undefined): Promise<Position | null>;
    static getLocationAsync(options?: PositionOptions | null | undefined): Promise<GeoCoordinate | null>;
    static css(...params: (readonly string[] | string | null | undefined | false)[]): string;
    static format(text: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined | any)[]): string;
    static formatValue(value: any, format: TFormat | null | undefined): string;
    static getDayOfWeek(dayOfWeekOrDate: number | Date | string): string;
    static getShortDayOfWeek(dayOfWeekOrDate: number | Date | string): string;
    static getShortMonth(monthOrDate: number | Date | string): string;
    static getMonth(monthOrDate: number | Date | string): string;
    static toCurrencyString(input: number): string;
    static addDays(date: Date | string, days: number): Date;
    static addMonths(date: Date | string, months: number): Date;
    static isLeapYear(year?: number | null): boolean;
    static getDaysInMonth(date: Date): number;
    static distance(x: Position, y: GeoCoordinate): number;
    static max<T>(items: readonly T[], callback?: ((item: T) => number) | null): T;
    static maxValue<T>(items: readonly T[], callback: (item: T) => number): number;
    static min<T, TValue = number | Date>(items: readonly T[], callback?: ((item: T) => TValue) | null): T;
    static minValue<T, TValue = number | Date>(items: readonly T[], callback: (item: T) => TValue): TValue;
    static sum<T>(items: readonly T[] | null | undefined, callback: (item: T) => number | null | undefined): number;
    static count<T>(items: readonly T[] | null | undefined, callback: (item: T, index: number) => boolean): number;
    static round(value: number, digits?: number): number;
    static roundE(value: number): number;
    static roundHalf(value: number): number;
    static forEachAsync<T>(items: readonly T[], callback: (item: T) => Promise<void>): Promise<void>;
    static where<T>(items: readonly T[], predicate: (item: T) => boolean): T[];
    static selectMany<TIn, TOut>(items: TIn[], collectionSelector: (item: TIn) => TOut[]): TOut[];
    static whereAsync<T>(items: readonly T[], callback: (item: T) => Promise<boolean>): Promise<T[]>;
    static groupBy<T>(items: readonly T[], callback?: ((item: T) => any) | null | undefined): T[][];
    static distinct<T>(items: readonly T[], callback?: ((item: T) => any) | null | undefined): T[];
    static remove<T>(items: T[], item: T | []): void;
    static removeAt<T>(items: T[], index: number): void;
    static pad(value: number): string;
    static now(): Date;
    static utcNow(): Date;
    static today(): Date;
    static tomorrow(): Date;
    static date(): Date;
    static inInterval(date: Date | string, from: Date | string | null | undefined, to: Date | string | null | undefined): boolean;
    static inFuture(date: Date | string | null): boolean;
    static inPast(date: Date | string | null): boolean;
    static toUtc(date: Date | string): Date;
    static asUtc(date: Date | string): Date;
    static toLocal(date: Date | string): Date;
    static utcValueOf(date: Date | string): number;
    static isSunday(date: Date | string): boolean;
    static isToday(date: Date | string): boolean;
    static toISODateString(date: Date): string;
    static toLongISOString(date: Date): string;
    static toDateTimeString(date: Date): string;
    static toTimeString(date: Date | string): string;
    static toDateShortTimeString(date: Date | string): string;
    static toDateString(date: Date | string): string;
    static toShortTimeString(date: Date): string;
    static getDateWithoutTime(date: Date | string): Date;
    static get timezoneOffset(): number;
    static diff(x: Date | string, y: Date | string, ignoreTimeZone?: boolean): TimeSpan;
    /**
     * Checks if global click happened outside of component
     * @param target - target of click event
     * @param id - id of the component
     * @param exceptId - id of the exception component to not trigger outside click (default null)
     * @param exceptTag - string value of HTML tag that is inside excepted container, but triggers outside click (for case when there are multiple children inside excepted container
     * @returns boolean - true/false if global click happened outside of the component
     */
    static clickedOutside(target: Node, id: string, exceptId?: string | null, exceptTag?: string | null): boolean;
    static readUploadedFileAsDataUrl(inputFile: File): Promise<string>;
    static readUploadedFileAsBinaryString(inputFile: File): Promise<string>;
    static readUploadedFileAsArrayBuffer(inputFile: File): Promise<ArrayBuffer>;
    static transformFileAsync(fileReference: File | null): Promise<FileModel | null>;
    static base64FromDataUrl(dataUrl: string): string;
    static toPagedList<T>(items: readonly T[], pageNumber: number, pageSize: number): IPagedList<T>;
    private static findInstanceByAccessor;
    static findValueByAccessor(instance: any, accessor: string | readonly string[]): any | null | undefined;
    static findStringValueByAccessor(instance: any, accessor: string | ReadonlyArray<string>): string | null;
    static setValueByAccessor(instance: any, accessor: string, value: any): void;
    static getHashCode(value: any | null | undefined): number;
    static isDateType(date: any): boolean;
    static restoreDate(model: any, path?: string): any;
    static clone(object: any): any;
    static copyTo(from: Dictionary<string, any> | any, ...to: any[]): void;
    static getExtensionsFromMimeTypes(mimeTypes: string[]): string;
}

export { }
