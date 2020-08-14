import HashCodeUtility from "@/HashCodeUtility";
import {DateExtensions} from "@/Extensions/DateExtensions";
import {StringExtensions} from "@/Extensions/StringExtensions";

export default class Utility {
    
    private static _geoEnabled: boolean | null = null;
    
    // public static setTimeout(asyncCallback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timeout {
    //     const timer: any = setTimeout(() => asyncCallback(args), ms, args);
    //     return timer as NodeJS.Timeout;
    // }

    public static async getPositionAsync(options: PositionOptions | null | undefined = null): Promise<Position | null> {
        const geoEnabled: boolean = this._geoEnabled || (this._geoEnabled = !!navigator.geolocation);
        if (geoEnabled) {
            return new Promise<Position | null>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options || undefined))
                .then((position) => {
                    return position;
                })
                .catch(() => {
                    this._geoEnabled = false;
                    return null;
                })
        } else {
            return new Promise<Position | null>((resolve) => resolve(null));
        }
    }

    // public static async getLocationAsync(): Promise<GeoCoordinate | null> {
    //     const position: Position | null = await this.getPositionAsync();
    //     if (position) {
    //         const location = new GeoCoordinate();
    //         location.latitude = position.coords.latitude;
    //         location.longitude = position.coords.longitude;
    //         return location;
    //     }
    //     return null;
    // }
    
    // public static wait(ms: number): Promise<NodeJS.Timeout> {
    //     return new Promise<NodeJS.Timeout>(resolve => this.setTimeout(resolve, ms));
    // }

    public static css(...params: (string | null | undefined | false)[]): string {
        return (params) ? params.filter(param => param).join(" ").trim() : "";
    }

    // private static toMarks(text: string, containerIndex: number): (ReactElement | string)[] {
    //     if (!text) {
    //         return [];
    //     }
    //
    //     const lines: string[] = text.split(RentaToolsConstants.markTagRegex);
    //
    //     return lines
    //         .map((line: string, index: number) => (index % 2 != 0)
    //             ? [React.createElement("mark", { key: containerIndex + "m" + index }, line)]
    //             : [line]
    //         )
    //         .flat();
    // }

    // public static toSingleLine(text: string | null | undefined): string {
    //     if (text) {
    //         text = text.replace(RentaToolsConstants.newLineRegex, " ");
    //     }
    //     return text || "";
    // };
    //
    // public static toMultiLines(text: string | null | undefined): any[] {
    //     if (!text) {
    //         return [];
    //     }
    //
    //     const lines: string[] = text.split(RentaToolsConstants.newLineRegex);
    //
    //     return lines
    //         .map((line: string, index: number) => (index < lines.length - 1)
    //             ? [...this.toMarks(line, index), React.createElement("br", { key: "br" + index })]
    //             : [...this.toMarks(line, index)]
    //         )
    //         .flat();
    // }

    public static format(text: string | null | undefined, ...params: (string | number | boolean | Date | null | undefined | any)[]): string {
        let result: string = text || "";

        if ((result) && (params) && (params.length > 0)) {
            params.forEach((param, index) => {
                const str: string = (param != null) ? param.toString() : "";
                const prefix: string = `{${index}`;

                let i: number = result.indexOf(prefix);

                while (i !== -1) {
                    let customFormat: boolean = (result[i + 2] === ":") && 
                                                ((typeof param === "number") || (typeof param === "object") || (typeof param === "string"));

                    if (customFormat) {
                        if ((param != null) && 
                            ((typeof param === "number") ||
                            (typeof param === "string") || 
                            ((typeof param === "object") && ((param as any).constructor.name === Date.name)))) {

                            let j: number = result.indexOf("}", i + 2);

                            if (j !== -1) {
                                let format: string = result.substring(i + prefix.length + 1, j);

                                //result.substring(firstChar + prefix.length, lastChar - 1)
                                //format is the data between that we're trying to format ?

                                if (format) {
                                    let formattedParam: string | null = null;

                                    if ((typeof param === "number")) {
                                        //number
                                        if ((format === "c") || (format === "C")) {
                                            formattedParam = this.toCurrencyString(param);
                                        } else if ((format === "0") || (format === "n") || (format === "N")) {
                                            formattedParam = param.toFixed(0).toString();
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
                                        }// else if (EnumHelper.isEnum(format)) {
                                        //    formattedParam = EnumHelper.getEnumText(format, param);
                                        //}
                                    } else if ((typeof param === "string") ||
                                        ((typeof param === "object") && ((param as any).constructor.name === Date.name))) {
                                        //date
                                        // if (format === "dddd") {
                                        //     //The abbreviated name of the day of the week.
                                        //     const date: Date = new Date(param);
                                        //     formattedParam = Localizer.getDayOfWeek(date);
                                        // } else  if (format === "ddd") {
                                        //     //The abbreviated name of the day of the week.
                                        //     const date: Date = new Date(param);
                                        //     formattedParam = Localizer.getShortDayOfWeek(date);
                                        // } else 
                                        if ((format === "D") || (format === "dd.MM.yyyy")) {
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
                                    }

                                    if (formattedParam != null) {
                                        result = result.substring(0, i) + formattedParam + result.substring(j + 1);
                                    }
                                }
                            }

                        }
                    } else {
                        result = result.replace(`{${index}}`, str);
                    }

                    i = result.indexOf(prefix, i + 1);
                }
            });
        }
        
        return result;
    }

    // public static resolveFormat(format: TFormat | null | undefined, def: string | null | undefined = null): TFormat {
    //     def = def || "";
    //     return (format)
    //         ? (typeof format === "function")
    //             ? format
    //             : def
    //         : def;
    // }
    //
    // public static formatValue(value: any, format: TFormat | null | undefined): string {
    //     return (format)
    //         ? (typeof format === "function")
    //             ? format(value)
    //             : Utility.format(`{0:${format}}`, value)
    //         : (value != null)
    //             ? value.toString()
    //             : "";
    // }

    public static toCurrencyString(input: number): string {
        const output: string = input
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
        return output;
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

    public static getDaysInMonth(date: Date) {
        date = new Date(date);
        const year: number = date.getFullYear();
        const month: number = date.getMonth();
        return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    };
    
    // public static distance(x: Position, y: GeoCoordinate): number {
    //     return Math.sqrt(Math.pow(y.latitude - x.coords.latitude, 2) + Math.pow(y.longitude - x.coords.longitude, 2));
    // }

    public static max<T>(items: T[], callback: (item: T) => number): T {
        if (items.length === 0)
            throw Error("Array cannot be empty.");

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

    public static maxValue<T>(items: T[], callback: (item: T) => number): number {
        return callback(Utility.max(items, callback));
    }

    public static min<T>(items: T[], callback: (item: T) => number): T {
        if (items.length === 0)
            throw Error("Array cannot be empty.");

        let min: T = items[0];
        let minW: number = callback(min);
        let length: number = items.length;
        for (let i: number = 1; i < length; i++) {
            let item: T = items[i];
            let w: number = callback(item);
            if (w < minW) {
                minW = w;
                min = item;
            }
        }
        return min;
    }

    public static minValue<T>(items: T[], callback: (item: T) => number): number {
        return callback(Utility.min(items, callback));
    }

    public static sum<T>(items: T[] | null | undefined, callback: (item: T) => number | null | undefined): number {
        let sum: number = 0;
        if (items) {
            items.forEach(item => sum += callback(item) || 0);
        }
        return sum;
    }

    public static count<T>(items: T[] | null | undefined, callback: (item: T, index: number) => boolean): number {
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
    
    public static roundE(value: number) {
        return this.round(value, 10);
    }

    public static roundHalf(value: number): number {
        return Math.round(value * 2) / 2;
    }

    public static async forEachAsync<T>(items: T[], callback: (item: T) => Promise<void>): Promise<void> {
        let promises: Promise<void>[] = items.map(item => callback(item));
        await Promise.all(promises);
    }

    public static async whereAsync<T>(items: T[], callback: (item: T) => Promise<boolean>): Promise<T[]> {
        const result: T[] = await items.filter(async item => await callback(item));
        return result;
    }

    public static groupBy<T>(list: T[], callback: ((item2: T) => any) | null | undefined = null) {
        const map = new Map();
        list.forEach((item) => {
            const key = callback ? callback(item) : null;
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return Array.from(map.values());
    }

    // public static distinct<T>(items: T[], callback: (item: T) => any): T[] {
    //     const dict = new Dictionary<any, T>();
    //     items.forEach(item => dict.setValue(callback(item), item));
    //     return dict.values();
    // }

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

    public static date(): Date {
        return this.getDateWithoutTime(this.now());
    }

    public static inInterval(date: Date | string, from: Date | string | null | undefined, to: Date | string | null | undefined): boolean {
        const dateValue: number = new Date(date).valueOf();
        const fromValue: number = (from != null) ? new Date(from).valueOf() : 0;
        const toValue: number = (to != null) ? new Date(to).valueOf() : Number.MAX_VALUE;
        return (fromValue <= dateValue) && (dateValue <= toValue);
    }

    // public static inFuture(x: Date | string): boolean {
    //     return (x == null) || (Utility.diff(x, Utility.now()).totalMilliseconds > 0);
    // }

    public static toUtc(date: Date): Date {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
    }

    public static asUtc(date: Date | string): Date {
        return new Date(Utility.utcValueOf(date));
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
    };
    
    public static toShortTimeString(date: Date): string {
        return `${Utility.pad(date.getHours())}:${Utility.pad(date.getMinutes())}`;
    };

    public static getDateWithoutTime(date: Date): Date {
        const copy = new Date(date);
        copy.setHours(0, 0, 0, 0);
        return copy;
    }

    public static get timezoneOffset(): number {
        const timezoneOffset: number = new Date().getTimezoneOffset();
        return -timezoneOffset;
    }

    // public static diff(x: Date | string, y: Date | string, ignoreTimeZone: boolean = false): TimeSpan {
    //     if (typeof x === "string") {
    //         x = new Date(x);
    //     }
    //     if (typeof y === "string") {
    //         y = new Date(y);
    //     }
    //     const xDate: number = (ignoreTimeZone) ? x.utcValueOf() : x.valueOf();
    //     const yDate: number = (ignoreTimeZone) ? y.utcValueOf() : y.valueOf();
    //     const mlsec: number = xDate - yDate;
    //     return TimeSpan.fromMilliseconds(mlsec);
    // }

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

            if(exceptedContainer !== null) {
                outside = !exceptedContainer.contains(target);
            }

            if(exceptTag && exceptedContainer) {
                const exceptedFound: Element | undefined = exceptedContainer.getElementsByTagName(exceptTag)[0];

                if(exceptedFound && (target === exceptedFound)) {
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

    // public static async transformFileAsync(fileReference: File | null): Promise<FileModel | null> {
    //    
    //     if (fileReference) {
    //         const dataUrl: string = await Utility.readUploadedFileAsDataUrl(fileReference);
    //
    //         if (dataUrl) {
    //             const file: FileModel = new FileModel();
    //             file.lastModified = new Date(fileReference.lastModified);
    //             file.name = fileReference.name;
    //             file.size = fileReference.size;
    //             file.type = fileReference.type;
    //             file.src = dataUrl;
    //             return file;
    //         }
    //     }
    //
    //     return null;
    // }

    public static base64FromDataUrl(dataUrl: string): string {
        return dataUrl.split("base64,")[1]
    }
    
    // public static toPagedList<TItem>(items: TItem[], pageNumber: number, pageSize: number): IPagedList<TItem> {
    //     const firstIndex: number = pageNumber * pageSize;
    //     const totalItemCount: number = items.length;
    //     let pageCount: number = Math.trunc(totalItemCount / pageSize);
    //     if (pageCount === 0) {
    //         pageCount = 1;
    //     } else if (totalItemCount > pageCount * pageSize) {
    //         pageCount++;
    //     }
    //
    //     const pageItems: TItem[] = (firstIndex + pageSize >= totalItemCount)
    //         ? items.slice(firstIndex)
    //         : items.slice(firstIndex, pageSize);
    //    
    //     return {
    //         items: pageItems,
    //         pageCount: pageCount,
    //         pageSize: pageSize,
    //         totalItemCount: totalItemCount,
    //         pageNumber: pageNumber
    //     }
    // }

    private static findInstanceByAccessor(instance: any, accessor: string): [any, string] | undefined {

        if ((instance == null) || (accessor == null)) {
            return undefined;
        }

        accessor = accessor.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
        accessor = accessor.replace(/^\./, '');           // strip a leading dot
        const path = accessor.split('.');
        let tuple: [any, string] | undefined;
        const length: number = path.length;
        for (let i = 0, n = length; i < n; ++i) {

            let key: string = path[i];

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

    public static findValueByAccessor(instance: any, accessor: string): any | null | undefined {
        let tuple: [any, string] | undefined = this.findInstanceByAccessor(instance, accessor);

        if (tuple) {
            instance = tuple[0];
            accessor = tuple[1];
            return instance[accessor];
        }

        return undefined;
    }

    public static setValueByAccessor(instance: any, accessor: string, value: any) {
        let tuple: [any, string] | undefined = this.findInstanceByAccessor(instance, accessor);
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
        return ((date != null) && (typeof date === "object") && (date.constructor === Date));// && (typeof date.getDay === "function"));
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
                                const dateRegex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(:([0-5][0-9]))?(Z)?$/;
                                const zeroTimeRegex = /T00:00:00((.?0+)?)$/;

                                let dateStr: string = value as string;
                                isDateStr = (!!dateStr.match(dateRegex));
                                if (isDateStr) {
                                    const markedAsUtc: boolean = dateStr.endsWith("Z");
                                    const includesTimezoneOffset: boolean = (!markedAsUtc) && (dateStr.includes("+"));

                                    if (!includesTimezoneOffset) {
                                        if (markedAsUtc) {
                                            dateStr = dateStr.slice(0, -1);
                                        }
                                        const includesTime: boolean = dateStr.includes("T");
                                        if (includesTime) {
                                            const dateWithoutTime: boolean = (!!dateStr.match(zeroTimeRegex));
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

    // public static copyTo(from: Dictionary<string, any> | any, ...to: any[]): void {
    //    
    //     if (from == null) {
    //         return;
    //     }
    //    
    //     if (from instanceof Dictionary) {
    //         from.keys().forEach(key => {
    //             const value: any = from.getValue(key);
    //             to.forEach(instance => {
    //                 if ((instance != null) && (instance.hasOwnProperty(key))) {
    //                     instance[key] = value;
    //                 }
    //             });
    //         });
    //         return;
    //     }
    //    
    //     const copy: any = this.clone(from);
    //     for(const key in copy) {
    //         if (copy.hasOwnProperty(key)) {
    //             const value: any = from[key];
    //             to.forEach(instance => {
    //                 if ((instance != null) && (instance.hasOwnProperty(key))) {
    //                     instance[key] = value;
    //                 }
    //             });
    //         }
    //     }
    // }
}

//Register Extensions
DateExtensions();
StringExtensions();