import {TFormat} from "./providers/BaseTransformProvider";

export interface INumberFormat {
    step: number;
    format: TFormat;
}

export class NumberParsingResult {
    constructor(value: number | null | undefined = null) {
        if (value != null) {
            this.value = value;
            this.valueStr = value.toString();
            this.inputStr = value.toString();
            this.acceptableStr = value.toString();
            this.parsed = true;
        }
    }

    public value: number = 0;

    public inputStr: string = "";

    public acceptableStr: string | null = null;

    public valueStr: string = "";

    public parsed: boolean = false;
}

export default class NumberUtility {

    public static compare(x: number, y: number, inverse: boolean = false): number {
        if (x < y) {
            return (inverse) ? 1 : -1;
        }
        if (x > y) {
            return (inverse) ? -1 : 1;
        }
        return 0;
    }

    public static parse(str: string, allowFloat: boolean = true, maxLength: number = 10): NumberParsingResult {
        const info = new NumberParsingResult();

        info.inputStr = str;

        let escapedStr: string = str
            .replace(/([\n\r' ])/gm,"")
            .replace(/([,])/gm,".");

        const zeroValues: string[] = [".", "-", "+", "-.", "+."];

        let value: number = (zeroValues.includes(escapedStr)) ? 0 : Number(escapedStr);
        const parsed: boolean = (
            (!Number.isNaN(value)) &&
            (Number.isFinite(value)) &&
            (!escapedStr.includes("e")) && (!escapedStr.includes("E")) &&
            (escapedStr.length <= maxLength) &&
            ((allowFloat) || (Math.trunc(value) == value))
        );

        const isAcceptableStr: boolean = (parsed) &&
            (
                (escapedStr.length == 0) ||
                (/^[-+]?[\d]*[.,]?[\d]*$/.test(escapedStr))
            );

        value = (parsed) ? value : 0;
        const valueStr: string = (parsed) ? value.toString() : "";
        const acceptableStr: string | null = (isAcceptableStr)
            ? escapedStr
            : (parsed)
                ? valueStr
                : null;

        info.parsed = parsed;
        info.value = value;
        info.valueStr = valueStr;
        info.acceptableStr = acceptableStr;

        return info;
    }

    private static _formats: INumberFormat[] = [
        {format: "C", step: 0.01},
        {format: "c", step: 0.01},
        {format: "0.00", step: 0.01},
        {format: "0.00%", step: 0.01},
        {format: "0.0", step: 0.1},
        {format: "0.0%", step: 0.1},
        {format: "0", step: 1},
        {format: "n", step: 1},
        {format: "N", step: 1},
        {format: "%", step: 1},
        {format: "N%", step: 1},
        {format: "0%", step: 1},
    ]

    public static resolveFormat(step: number | null | undefined, format: TFormat | null | undefined, defaultFormat: string | null | undefined = null): INumberFormat {
        format = format || defaultFormat || "";

        if ((format == "") && (step != null)) {
            format = ((step >= 0.1) && (step < 1))
                ? "0.0"
                : (step <= 0.01)
                    ? "0.00"
                    : "0";
        } else if ((format) && (step == null)) {
            const item: INumberFormat | null = this._formats.find(item => item.format == format) || null;
            if (item) {
                return item;
            }
        }

        step = step || 1;

        return {step, format};
    }
}