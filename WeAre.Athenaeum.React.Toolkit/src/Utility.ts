import AthenaeumConstants from "./AthenaeumConstants";
import GeoCoordinate from "./models/GeoCoordinate";
import TimeSpan from "./models/TimeSpan";
import IPagedList from "./models/IPagedList";
import HashCodeUtility from "./HashCodeUtility";
import FileModel from "./models/FileModel";
//import Position from "./models/Position";
import {Dictionary} from "typescript-collections";
import {ILocalizer} from "./localization/BaseLocalizer";
import {ITransformProvider, TFormat} from "./providers/BaseTransformProvider";
import {IEnumProvider} from "./providers/BaseEnumProvider";
import {DateExtensions} from "./extensions/DateExtensions";
import {StringExtensions} from "./extensions/StringExtensions";
import {ArrayExtensions} from "./extensions/ArrayExtensions";
import {NumberExtensions} from "./extensions/NumberExtensions";
import ServiceProvider from "./providers/ServiceProvider";

export default class Utility {

    private static _geoEnabled: boolean | null = null;
    private static _number: number = 1;

    public static setTimeout(asyncCallback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timeout {
        const timer: any = setTimeout(() => asyncCallback(args), ms, args);
        return timer as NodeJS.Timeout;
    }

    public static wait(ms: number): Promise<NodeJS.Timeout> {
        return new Promise<NodeJS.Timeout>(resolve => this.setTimeout(resolve, ms));
    }

    public static get geoEnabled(): boolean {
        return this._geoEnabled || (this._geoEnabled = !!navigator.geolocation);
    }

    public static async getPositionAsync(options: PositionOptions | null | undefined = null): Promise<Position | null> {
        if (this.geoEnabled) {
            options = options || { timeout: 1000 };
            return new Promise<Position | null>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options || undefined))
                .then((position) => {
                    return position;
                })
                .catch((e) => {
                    const timeout: boolean = (e.code == 3);
                    if (!timeout) {
                        this._geoEnabled = false;
                    }
                    return null;
                });
        } else {
            return new Promise<Position | null>((resolve) => resolve(null));
        }
    }

    public static async getLocationAsync(options: PositionOptions | null | undefined = null): Promise<GeoCoordinate | null> {
        const position: Position | null = await this.getPositionAsync(options);
        if (position) {
            return new GeoCoordinate(position.coords.latitude, position.coords.longitude);
        }
        return null;
    }

    public static css(...params: (readonly string[] | string | null | undefined | false)[]): string {
        return (params) ? params.filter(param => param).join(" ").replace(",", " ").trim() : "";
    }

    /**
     * huehue
     * @param text the thing to format
     * @param params format used for formatting 
     * "D" = dd.MM.yyyy
     */
    public static format(text: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined | any)[]): string {
        let result: string = text || "";

        if ((result) && (params != null) && (params.length > 0)) {
            params.forEach((param, index) => {
                const prefix: string = `{${index}`;

                let i: number = result.indexOf(prefix);

                while (i !== -1) {
                    const customFormat: boolean = (result[i + 2] === ":") && ((typeof param === "number") || (typeof param === "object") || (typeof param === "string"));

                    if (customFormat) {
                        if 
                        (
                            (param != null) &&
                            (
                                (typeof param === "number") ||
                                (typeof param === "string") ||
                                (
                                    (typeof param === "object") &&
                                    (
                                        ((param as any).constructor.name === Date.name) ||
                                        (param instanceof TimeSpan) || 
                                        (param.isTimeSpan)
                                    )
                                )
                            )
                        ) {

                            let j: number = result.indexOf("}", i + 2);

                            if (j !== -1) {
                                let format: string = result.substring(i + prefix.length + 1, j);

                                //result.substring(firstChar + prefix.length, lastChar - 1)
                                //format is the data between that we're trying to format ?

                                if (format) {
                                    let formattedParam: string | null = null;

                                    if (typeof param === "number") {
                                        const enumProvider: IEnumProvider | null = ServiceProvider.findEnumProvider();
                                        //number
                                        if ((format === "c") || (format === "C")) {
                                            formattedParam = this.toCurrencyString(param);
                                        } else if ((format === "0") || (format === "n") || (format === "N")) {
                                            formattedParam = param.toFixed(0).toString();
                                        } else if (format === "00") {
                                            param = param.toFixed(0);
                                            formattedParam = ((param >= 0) && (param < 10)) ? "0" + param : param.toString();
                                        } else if (format === "0.0") {
                                            formattedParam = param.toFixed(1).toString();
                                        } else if (format === "0.00") {
                                            formattedParam = param.toFixed(2).toString();
                                        } else if ((format === "%") || (format === "0%")) {
                                            formattedParam = Math.round(param) + "%";
                                        } else if (format === "0.0%") {
                                            formattedParam = param.toFixed(1) + "%";
                                        } else if (format === "0.00%") {
                                            formattedParam = param.toFixed(2) + "%";
                                        } else if ((enumProvider) && (enumProvider.isEnum(format))) {
                                            formattedParam = enumProvider.getEnumText(format, param);
                                        }
                                    } else if ((typeof param === "string") || ((typeof param === "object") && ((param as any).constructor.name === Date.name))) {
                                        if (format === "dddd") {
                                            //The abbreviated name of the day of the week.
                                            formattedParam = this.getDayOfWeek(param);
                                        } else if (format === "ddd") {
                                            //The abbreviated name of the day of the week.
                                            formattedParam = this.getShortDayOfWeek(param);
                                        } else if (format === "MMMM") {
                                            //The abbreviated name of the month.
                                            formattedParam = this.getMonth(param);
                                        } else if (format === "MMM") {
                                            //The abbreviated name of the month.
                                            formattedParam = this.getShortMonth(param);
                                        } else if ((format === "D") || (format === "dd.MM.yyyy")) {
                                            const date: Date = new Date(param);
                                            formattedParam = this.toDateString(date);
                                        } else if (format === "G") {
                                            const date: Date = new Date(param);
                                            formattedParam = this.toDateTimeString(date);
                                        } else if (format === "g") {
                                            const date: Date = new Date(param);
                                            formattedParam = this.toDateShortTimeString(date);
                                        } else if (format === "t") {
                                            const date: Date = new Date(param);
                                            formattedParam = this.toShortTimeString(date);
                                        } else if (format === "HH:mm:ss") {
                                            const date: Date = new Date(param);
                                            formattedParam = this.toTimeString(date);
                                        } else if (format === "MM.yyyy") {
                                            const date: Date = new Date(param);
                                            formattedParam = `${Utility.pad(date.getMonth() + 1)}.${date.getFullYear()}`;
                                        } else if (format === "dd.MM") {
                                            const date: Date = new Date(param);
                                            formattedParam = `${Utility.pad(date.getDate())}.${Utility.pad(date.getMonth() + 1)}`;
                                        } else if ((format === "d") || (format === "dd.MM.yy")) {
                                            const date: Date = new Date(param);
                                            const year: string = date.getFullYear().toString().substr(2);
                                            formattedParam = `${Utility.pad(date.getDate())}.${Utility.pad(date.getMonth() + 1)}.${year}`;
                                        }
                                    } else if ((typeof param === "object") && ((param instanceof TimeSpan) || (param.isTimeSpan === true))) {
                                        const value: TimeSpan = param as TimeSpan;
                                        
                                        if (format === "hh:mm:ss") {
                                            formattedParam = `${Utility.pad(value.hours)}:${Utility.pad(value.minutes)}:${Utility.pad(value.seconds)}`;
                                        } else if (format === "c") {
                                            formattedParam = (value.days > 0)
                                                ? `${value.days}.${Utility.pad(value.hours)}:${Utility.pad(value.minutes)}:${Utility.pad(value.seconds)}`
                                                : `${Utility.pad(value.hours)}:${Utility.pad(value.minutes)}:${Utility.pad(value.seconds)}`;
                                        }
                                    }

                                    if (formattedParam != null) {
                                        result = result.substring(0, i) + formattedParam + result.substring(j + 1);
                                    }
                                }
                            }

                        }
                    } else {
                        let str: string = "";
                        if (param != null) {
                            const transformProvider: ITransformProvider | null = ServiceProvider.findTransformProvider();
                            str = (transformProvider)
                                ? transformProvider.toString(param)
                                : param.toString();
                        }
                        result = result.replace(`{${index}}`, str);
                    }

                    i = result.indexOf(prefix, i + 1);
                }
            });
        }

        return result;
    }

    public static formatValue(value: any, format: TFormat | null | undefined = null): string {
        return (value != null)
            ? (format)
                ? (typeof format === "function")
                    ? format(value)
                    : Utility.format(`{0:${format}}`, value)
                : Utility.format(`{0}`, value)
            : "";
    }

    public static getDayOfWeek(dayOfWeekOrDate: number | Date | string): string {

        switch (typeof dayOfWeekOrDate) {
            case  "string":
                dayOfWeekOrDate = new Date(dayOfWeekOrDate);
                return this.getDayOfWeek(dayOfWeekOrDate);

            case "number":
                let name: string;
                switch (dayOfWeekOrDate) {
                    case 0:
                        name = "Sunday";
                        break;
                    case 1:
                        name = "Monday";
                        break;
                    case 2:
                        name = "Tuesday";
                        break;
                    case 3:
                        name = "Wednesday";
                        break;
                    case 4:
                        name = "Thursday";
                        break;
                    case 5:
                        name = "Friday";
                        break;
                    case 6:
                        name = "Saturday";
                        break;
                    default:
                        throw Error(`Unsupported day of week number "${dayOfWeekOrDate}", can be [0..6] => [Sunday..Saturday].`);
                }

                let localizer: ILocalizer | null = ServiceProvider.findLocalizer();
                
                let language: string = navigator.language;
                if (localizer) {
                    const tag: string = `DayOfWeek.${name}`;
                    if (localizer.contains(tag)) {
                        return localizer.get(tag);
                    }
                    
                    language = localizer.language;
                }

                const sunday: Date = new Date(Date.UTC(2017, 0, 1));
                const dayOfWeek: Date = sunday.addDays(dayOfWeekOrDate);
                name = dayOfWeek.toLocaleString(language, { weekday: "long" });
                
                return name;

            case "object":
                if (typeof dayOfWeekOrDate.getDay === "function") {
                    dayOfWeekOrDate = (dayOfWeekOrDate as Date).getDay();
                    return this.getDayOfWeek(dayOfWeekOrDate);
                }
                break;
        }

        throw Error(`Unsupported type for day of week "${dayOfWeekOrDate}", can be number, string or Date.`);
    }

    public static getShortDayOfWeek(dayOfWeekOrDate: number | Date | string): string {
        const dayOfWeek: string = this.getDayOfWeek(dayOfWeekOrDate);
        return dayOfWeek.substr(0, 2);
    }

    public static getShortMonth(monthOrDate: number | Date | string): string {
        const month: string = this.getMonth(monthOrDate);
        return month.substr(0, 3);
    }
    
    public static getMonth(monthOrDate: number | Date | string): string {

        if (Utility.isDateType(monthOrDate)) {
            monthOrDate = (monthOrDate as Date).getMonth();
            return this.getMonth(monthOrDate);
        }

        if (typeof monthOrDate === "string") {
            monthOrDate = monthOrDate.toLowerCase();
        }

        const localizer: ILocalizer | null = ServiceProvider.findLocalizer();

        switch (monthOrDate) {
            case "january":
            case 0:
                return (localizer) ? localizer.get("Month.January") : "January";
            case "february":
            case 1:
                return (localizer) ? localizer.get("Month.February") : "February";
            case "march":
            case 2:
                return (localizer) ? localizer.get("Month.March") : "March";
            case "april":
            case 3:
                return (localizer) ? localizer.get("Month.April") : "April";
            case "may":
            case 4:
                return (localizer) ? localizer.get("Month.May") : "May";
            case "june":
            case 5:
                return (localizer) ? localizer.get("Month.June") : "June";
            case "july":
            case 6:
                return (localizer) ? localizer.get("Month.July") : "July";
            case "august":
            case 7:
                return (localizer) ? localizer.get("Month.August") : "August";
            case "september":
            case 8:
                return (localizer) ? localizer.get("Month.September") : "September";
            case "october":
            case 9:
                return (localizer) ? localizer.get("Month.October") : "October";
            case "november":
            case 10:
                return (localizer) ? localizer.get("Month.November") : "November";
            case "december":
            case 11:
                return (localizer) ? localizer.get("Month.December") : "December";
        }

        throw Error(`Unsupported month "${monthOrDate}", can be number ([0..11]), string (month name in English) or Date.`);
    }

    public static toCurrencyString(input: number): string {
        return input
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    }

    public static addDays(date: Date | string, days: number): Date {
        const copy: Date = new Date(date);
        copy.setDate(copy.getDate() + days);
        return copy;
    }

    public static addMonths(date: Date | string, months: number): Date {
        date = new Date(date);
        const day: number = date.getDate();
        date.setDate(1);
        date.setMonth(date.getMonth() + months);
        date.setDate(Math.min(day, this.getDaysInMonth(date)));
        return date;
    }

    public static isLeapYear(year: number | null = null): boolean {
        return (year != null)
            ? (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
            : this.isLeapYear(this.now().getFullYear());
    };

    public static getDaysInMonth(date: Date): number {
        date = new Date(date);
        const year: number = date.getFullYear();
        const month: number = date.getMonth();
        return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    };

    public static distance(x: Position, y: GeoCoordinate): number {
        return Math.sqrt(Math.pow(y.lat - x.coords.latitude, 2) + Math.pow(y.lon - x.coords.longitude, 2));
    }

    public static max<T>(items: readonly T[], callback: ((item: T) => number) | null = null): T {
        if (items.length === 0)
            throw Error("Array cannot be empty.");

        callback = callback || ((item) => (item as any) as number);

        let maxItem: T = items[0];
        let maxValue: number = callback(maxItem);
        const length: number = items.length;
        for (let i: number = 1; i < length; i++) {
            const item: T = items[i];
            const value: number = callback(item);
            if (value > maxValue) {
                maxValue = value;
                maxItem = item;
            }
        }
        return maxItem;
    }

    public static maxValue<T>(items: readonly T[], callback: (item: T) => number): number {
        return callback(Utility.max(items, callback));
    }

    public static min<T, TValue = number | Date>(items: readonly T[], callback: ((item: T) => TValue) | null = null): T {
        if (items.length === 0)
            throw Error("Array cannot be empty.");

        callback = callback || ((item) => (item as any) as TValue);

        let minItem: T = items[0];
        let minValue: TValue = callback(minItem);
        const length: number = items.length;
        for (let i: number = 1; i < length; i++) {
            const item: T = items[i];
            const value: TValue = callback(item);
            if (value < minValue) {
                minValue = value;
                minItem = item;
            }
        }
        return minItem;
    }

    public static minValue<T, TValue = number | Date>(items: readonly T[], callback: (item: T) => TValue): TValue {
        return callback(Utility.min(items, callback));
    }

    public static sum<T>(items: readonly T[] | null | undefined, callback: (item: T) => number | null | undefined): number {
        let sum: number = 0;
        if (items) {
            items.forEach(item => sum += callback(item) || 0);
        }
        return sum;
    }

    public static count<T>(items: readonly T[] | null | undefined, callback: (item: T, index: number) => boolean): number {
        let count: number = 0;
        if (items) {
            items.forEach((item, index) => count += callback(item, index) ? 1 : 0);
        }
        return count;
    }

    public static round(value: number, digits: number = 0): number {
        digits = Math.round(digits);
        if (digits > 0) {
            const k = Math.pow(10, digits);
            value *= k;
            value = Math.round(value);
            value /= k;
        }
        return value;
    }

    public static roundE(value: number): number {
        return this.round(value, 10);
    }

    public static roundHalf(value: number): number {
        return Math.round(value * 2) / 2;
    }

    public static async forEachAsync<T>(items: readonly T[], callback: (item: T) => Promise<void>): Promise<void> {
        const promises: Promise<void>[] = items.map(item => callback(item));
        await Promise.all(promises);
    }

    public static where<T>(items: readonly T[], predicate: (item: T) => boolean): T[] {
        return items.filter(predicate);
    }

    public static selectMany<TIn, TOut>(items: TIn[], collectionSelector: (item: TIn) => TOut[]): TOut[] {
        const result: TOut[] = [];
        const length: number = items.length;
        for (let i: number = 0; i < length; i++) {
            const subItems: TOut[] = collectionSelector(items[i]);
            result.push(...subItems);
        }
        return result;
    }

    public static async whereAsync<T>(items: readonly T[], callback: (item: T) => Promise<boolean>): Promise<T[]> {
        return items.filter(async item => await callback(item));
    }

    public static groupBy<T>(items: readonly T[], callback: ((item: T) => any) | null | undefined = null): T[][] {
        const map = new Map<any, T[]>();
        items.forEach((item) => {
            const key: any = callback ? callback(item) : null;
            const collection: T[] | undefined = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return Array.from(map.values());
    }

    public static distinct<T>(items: readonly T[], callback: ((item: T) => any) | null | undefined = null): T[] {
        const dict = new Dictionary<any, T>();
        items.forEach(item => dict.setValue(callback ? callback(item) : item, item));
        return dict.values();
    }

    public static remove<T>(items: T[], item: T | []): void {
        if (Array.isArray(item)) {
            const length: number = item.length;
            for (let i: number = 0; i < length; i++) {
                Utility.remove(items, item[i]);
            }
        }
        else {
            const index: number = items.indexOf(item);
            if (index !== -1) {
                items.splice(index, 1);
            }
        }
    }

    public static removeAt<T>(items: T[], index: number): void {
        if ((index < 0) || (index >= items.length))
            throw Error(`Array index "${index}" out of range, can be in [0..${items.length}].`);

        items.splice(index, 1);
    }

    public static pad(value: number) {
        value = Math.floor(Math.abs(value));
        return (value < 10 ? "0" : "") + value;
    }

    public static now(): Date {
        return new Date();
    }

    public static utcNow(): Date {
        const now: Date = Utility.now();
        return Utility.toUtc(now);
    }

    public static today(): Date {
        return Utility.date();
    }

    public static tomorrow(): Date {
        return this.today().addDays(1);
    }

    public static date(): Date {
        return this.getDateWithoutTime(this.now());
    }

    public static inInterval(date: Date | string, from: Date | string | null | undefined, to: Date | string | null | undefined): boolean {
        const dateValue: number = new Date(date).valueOf();
        const fromValue: number = (from != null) ? new Date(from).valueOf() : 0;
        const toValue: number = (to != null) ? new Date(to).valueOf() : Number.MAX_VALUE;
        return (fromValue <= dateValue) && (dateValue <= toValue);
    }

    public static inFuture(date: Date | string | null): boolean {
        return (date != null) && (Utility.diff(date, Utility.now()).totalMilliseconds > 0);
    }

    public static inPast(date: Date | string | null): boolean {
        return (date != null) && (Utility.diff(Utility.now(), date).totalMilliseconds > 0);
    }

    public static toUtc(date: Date | string): Date {
        date = new Date(date);
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
    }

    public static asUtc(date: Date | string): Date {
        return new Date(Utility.utcValueOf(date));
    }
    
    public static toLocal(date: Date | string): Date {
        date = new Date(date);
        const hoursDiff = date.getHours() - date.getTimezoneOffset() / 60;
        date.setHours(hoursDiff);
        return date;
    }

    public static utcValueOf(date: Date | string): number {
        if (typeof date === "string") {
            date = new Date(date);
        }
        return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    }

    public static isSunday(date: Date | string): boolean {
        const value: Date = (typeof date === "string") ? new Date(date) : date;
        return (value.getDay() == 0);
    }

    public static isToday(date: Date | string): boolean {
        const value: Date = (typeof date === "string") ? new Date(date) : date;
        const today: Date = this.today();
        return (value.getDate() === today.getDate()) &&
            (value.getMonth() === today.getMonth()) &&
            (value.getFullYear() === today.getFullYear());
    }

    // return date only in ISO format (yyyy-mm-dd)
    public static toISODateString(date: Date) {
        return date.getFullYear() + "-" + Utility.pad(date.getMonth() + 1) + "-" + Utility.pad(date.getDate());
    }

    // return date and time in ISO format with timezone (yyyy-mm-ddThh:MM:ss+Z:Z)
    public static toLongISOString(date: Date) {
        const tzo: number = -date.getTimezoneOffset();
        const dif: string = (tzo >= 0) ? "+" : "-";
        return date.getFullYear() +
            "-" +
            Utility.pad(date.getMonth() + 1) +
            "-" +
            Utility.pad(date.getDate()) +
            "T" +
            Utility.pad(date.getHours()) +
            ":" +
            Utility.pad(date.getMinutes()) +
            ":" +
            Utility.pad(date.getSeconds()) +
            dif +
            Utility.pad(tzo / 60) +
            ":" +
            Utility.pad(tzo % 60);
    }

    public static toDateTimeString(date: Date): string {
        return `${Utility.toDateString(date)} ${Utility.toTimeString(date)}`;
    }

    public static toTimeString(date: Date | string): string {
        const value: Date = (typeof date === "string") ? new Date(date) : date;
        return `${Utility.pad(value.getHours())}:${Utility.pad(value.getMinutes())}:${Utility.pad(value.getSeconds())}`;
    }

    public static toDateShortTimeString(date: Date | string): string {
        const value: Date = (typeof date === "string") ? new Date(date) : date;
        return this.toDateString(value) + " " + this.toShortTimeString(value);
    }

    public static toDateString(date: Date | string): string {
        const value: Date = (typeof date === "string") ? new Date(date) : date;
        return `${Utility.pad(value.getDate())}.${Utility.pad(value.getMonth() + 1)}.${value.getFullYear()}`;
    }

    public static toShortTimeString(date: Date): string {
        return `${Utility.pad(date.getHours())}:${Utility.pad(date.getMinutes())}`;
    }

    public static getDateWithoutTime(date: Date | string): Date {
        const copy = new Date(date);
        copy.setHours(0, 0, 0, 0);
        return copy;
    }

    public static get timezoneOffset(): number {
        const timezoneOffset: number = new Date().getTimezoneOffset();
        return -timezoneOffset;
    }

    public static diff(x: Date | string, y: Date | string, ignoreTimeZone: boolean = false): TimeSpan {
        if (typeof x === "string") {
            x = new Date(x);
        }
        if (typeof y === "string") {
            y = new Date(y);
        }
        const xDate: number = (ignoreTimeZone) ? x.utcValueOf() : x.valueOf();
        const yDate: number = (ignoreTimeZone) ? y.utcValueOf() : y.valueOf();
        const mlsec: number = xDate - yDate;
        return TimeSpan.fromMilliseconds(mlsec);
    }

    /**
     * Checks if global click happened outside of component
     * @param target - target of click event
     * @param id - id of the component
     * @param exceptId - id of the exception component to not trigger outside click (default null)
     * @param exceptTag - string value of HTML tag that is inside excepted container, but triggers outside click (for case when there are multiple children inside excepted container
     * @returns boolean - true/false if global click happened outside of the component
     */
    public static clickedOutside(target: Node, id: string, exceptId: string | null = null, exceptTag: string | null = null): boolean {
        const container: Element | null = document.querySelector(`#${id}`);
        let outside: boolean = ((container !== null) && (!container.contains(target)));

        if ((outside) && (exceptId)) {
            const exceptedContainer: Element | null = document.querySelector(`#${exceptId}`);

            if (exceptedContainer !== null) {
                outside = !exceptedContainer.contains(target);
            }

            if (exceptTag && exceptedContainer) {
                const exceptedFound: Element | undefined = exceptedContainer.getElementsByTagName(exceptTag)[0];

                if (exceptedFound && (target === exceptedFound)) {
                    outside = true;
                }
            }
        }

        return outside;
    }

    public static async readUploadedFileAsDataUrl(inputFile: File): Promise<string> {
        const fileReader: FileReader = new FileReader();

        return new Promise((resolve, reject) => {
            fileReader.onerror = () => {
                fileReader.abort();
                reject(new DOMException("Problem parsing input file."));
            };

            fileReader.onload = () => {
                const result: string = (fileReader.result as string | null) || "";
                resolve(result);
            };

            fileReader.readAsDataURL(inputFile);
        });
    }

    public static async readUploadedFileAsBinaryString(inputFile: File): Promise<string> {
        const fileReader: FileReader = new FileReader();

        return new Promise((resolve, reject) => {
            fileReader.onerror = () => {
                fileReader.abort();
                reject(new DOMException("Problem parsing input file."));
            };

            fileReader.onload = () => {
                const result: string = (fileReader.result as string | null) || "";
                resolve(result);
            };

            fileReader.readAsBinaryString(inputFile);
        });
    }

    public static async readUploadedFileAsArrayBuffer(inputFile: File): Promise<ArrayBuffer> {
        const fileReader: FileReader = new FileReader();

        return new Promise((resolve, reject) => {
            fileReader.onerror = () => {
                fileReader.abort();
                reject(new DOMException("Problem parsing input file."));
            };

            fileReader.onload = () => {
                resolve(fileReader.result as ArrayBuffer);
            };
            fileReader.readAsArrayBuffer(inputFile)
        });
    }

    public static async transformFileAsync(fileReference: File | null): Promise<FileModel | null> {

        if (fileReference) {
            const dataUrl: string = await Utility.readUploadedFileAsDataUrl(fileReference);

            if (dataUrl) {
                const file: FileModel = new FileModel();
                file.lastModified = new Date(fileReference.lastModified);
                file.name = fileReference.name;
                file.size = fileReference.size;
                file.type = fileReference.type;
                file.src = dataUrl;
                return file;
            }
        }

        return null;
    }

    public static base64FromDataUrl(dataUrl: string): string {
        return dataUrl.split("base64,")[1];
    }

    public static toPagedList<T>(items: readonly T[], pageNumber: number, pageSize: number): IPagedList<T> {
        const firstIndex: number = (pageNumber - 1) * pageSize;
        const totalItemCount: number = items.length;
        
        let pageCount: number = Math.trunc(totalItemCount / pageSize);
        if (pageCount === 0) {
            pageCount = 1;
        } else if (totalItemCount > pageCount * pageSize) {
            pageCount++;
        }

        const pageItems: T[] = items.slice(firstIndex, firstIndex + pageSize);

        return {
            items: pageItems,
            pageCount: pageCount,
            pageSize: pageSize,
            totalItemCount: totalItemCount,
            pageNumber: pageNumber
        }
    }

    private static findInstanceByAccessor(instance: any, accessor: string): [any, string] | undefined {

        if ((instance == null) || (accessor == null) || (typeof instance !== "object")) {
            return undefined;
        }

        accessor = accessor.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
        accessor = accessor.replace(/^\./, '');           // strip a leading dot
        const path = accessor.split('.');
        const length: number = path.length;

        let tuple: [any, string] | undefined;
        for (let i = 0, n = length; i < n; ++i) {

            const key: string = path[i];

            if ((instance == null) || (!(key in instance))) {
                return undefined;
            }

            tuple = [instance, key];
            instance = instance[key];

            if ((instance == null) && (i === n)) {
                return undefined;
            }
        }

        return tuple;
    }

    public static findValueByAccessor(instance: any, accessor: string | readonly string[]): any | null | undefined {
        if (typeof accessor == "string") {
            const tuple: [any, string] | undefined = this.findInstanceByAccessor(instance, accessor);

            if (tuple) {
                instance = tuple[0];
                accessor = tuple[1];
                return instance[accessor];
            }

            return undefined;
        }

        const length: number = accessor.length;
        for (let i: number = 0; i < length; i++) {
            const value: any | null | undefined = Utility.findValueByAccessor(instance, accessor[i]);
            if (value !== undefined) {
                return value;
            }
        }

        return undefined;
    }

    public static findStringValueByAccessor(instance: any, accessor: string | ReadonlyArray<string>): string | null {
        if (typeof accessor == "string") {
            const value: any | null | undefined = Utility.findValueByAccessor(instance, accessor);

            if ((value != null) && (typeof value == "string") && (value.length > 0)) {
                return value as string;
            }

            return null;
        }

        const length: number = accessor.length;
        for (let i: number = 0; i < length; i++) {
            const value: any | null | undefined = Utility.findValueByAccessor(instance, accessor[i]);

            if ((value != null) && (typeof value == "string") && (value.length > 0)) {
                return value as string;
            }
        }

        return null;
    }

    public static setValueByAccessor(instance: any, accessor: string, value: any): void {
        const tuple: [any, string] | undefined = this.findInstanceByAccessor(instance, accessor);
        if (tuple) {
            instance = tuple[0];
            accessor = tuple[1];
            instance[accessor] = value;
        }
    }

    public static getHashCode(value: any | null | undefined): number {
        return HashCodeUtility.getHashCode(value);
    }

    public static isDateType(date: any): boolean {
        return ((date != null) && (
            ((typeof date === "object") && (date.constructor === Date)) ||
            ((typeof date === "string") && (!!date.match(AthenaeumConstants.dateRegex)))
        ));
    }

    public static restoreDate(model: any, path: string = ""): any {
        if (model != null) {
            if (typeof model === "object") {
                for (let property in model) {
                    if (model.hasOwnProperty(property)) {
                        const value: any = model[property];
                        if (value != null) {
                            let isDateStr: boolean = false;
                            if (value.constructor === String) {
                                // "yyyy-MM-ddThh:mm:ss.sssZ"
                                // "2019-09-25T16:00:20.817Z"
                                // "2019-09-25T16:00:20.817"
                                // "2019-09-25"
                                // "2019-09-24T00:00:00"
                                // "2019-09-24T00:00:00Z"
                                // "2019-10-14T21:00:00.000Z"
                                // "2019-10-16T00:00:00+03:00"
                                let dateStr: string = value as string;
                                isDateStr = (!!dateStr.match(AthenaeumConstants.dateRegex));
                                if (isDateStr) {
                                    const markedAsUtc: boolean = dateStr.endsWith("Z");
                                    const includesTimezoneOffset: boolean = (!markedAsUtc) && (dateStr.includes("+"));

                                    if (!includesTimezoneOffset) {
                                        if (markedAsUtc) {
                                            dateStr = dateStr.slice(0, -1);
                                        }
                                        const includesTime: boolean = dateStr.includes("T");
                                        if (includesTime) {
                                            const dateWithoutTime: boolean = (!!dateStr.match(AthenaeumConstants.zeroTimeRegex));
                                            if (!dateWithoutTime) {
                                                // Time from server always in UTC!
                                                dateStr += "Z";
                                            }
                                        } else {
                                            dateStr += "T00:00:00Z";
                                        }
                                    }

                                    model[property] = new Date(dateStr);
                                }
                            }
                            if (!isDateStr) {
                                this.restoreDate(value, path + "." + property);
                            }
                        }
                    }
                }
            }
        }

        return model;
    }

    public static clone(object: any): any {
        if (object == null) {
            return object;
        }
        const json: string = JSON.stringify(object);
        return JSON.parse(json);
    }

    public static copyTo(from: Dictionary<string, any> | any, ...to: any[]): void {

        if (from == null) {
            return;
        }

        if (from instanceof Dictionary) {
            from.keys().forEach((key: string) => {
                const value: any = from.getValue(key);
                to.forEach(instance => Utility.setValueByAccessor(instance, key, value));
            });
            return;
        }

        const copy: any = this.clone(from);
        
        for (const key in copy) {
            if (copy.hasOwnProperty(key)) {
                const value: any = Utility.findValueByAccessor(from, key);
                if (value !== undefined) {
                    to.forEach(instance => Utility.setValueByAccessor(instance, key, value));
                }
            }
        }
    }

    public static getExtensionsFromMimeTypes(mimeTypes: string[]): string {
        if (mimeTypes.length && mimeTypes.every((type: string) => type.includes("/"))) {
            return mimeTypes.map(type => type.split("/")[1]).join(", ");
        }
        return "";
    }

    /**
     * Gets unique id
     * @returns id - number
     */
    public static getId(): number {
        return ++this._number;
    }

    /**
     * Gets component id
     * @returns id - number
     */
    public static getComponentId(): string {
        return `_${this.getId()}`;
    }
}

//Register Extensions
DateExtensions();
StringExtensions();
ArrayExtensions();
NumberExtensions();