import Utility from "../Utility";

    export default class TimeSpan {

    public static readonly millisecondsPerSecond: number = 1000.0;
    public static readonly millisecondsPerMinute: number = 60000.0;
    public static readonly millisecondsPerHour: number = 3600000.0;
    public static readonly millisecondsPerDay: number = 86400000.0;

    private _totalMilliseconds: number;

    /**
     * Initializes a new instance of the TimeSpan structure to a specified number of days, hours, minutes, seconds, and milliseconds.
     * @param days - Number of days.
     * @param hours - Number of hours.
     * @param minutes - Number of minutes.
     * @param seconds - Number of seconds.
     * @param milliseconds - Number of milliseconds.
     */
    constructor(days: number = 0, hours: number = 0, minutes: number = 0, seconds: number = 0, milliseconds: number = 0) {
        this._totalMilliseconds = (days * 3600 * 24 + hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;
    }

    /**
     * Gets the value of the current TimeSpan structure expressed in whole and fractional milliseconds.
     */
    public get totalMilliseconds(): number {
        return this._totalMilliseconds;
    }

    /**
     * Gets the value of the current TimeSpan structure expressed in whole and fractional seconds.
     */
    public get totalSeconds(): number {
        return this._totalMilliseconds / TimeSpan.millisecondsPerSecond;
    }

    /**
     * Gets the value of the current TimeSpan structure expressed in whole and fractional minutes.
     */
    public get totalMinutes(): number {
        return this._totalMilliseconds / TimeSpan.millisecondsPerMinute;
    }

    /**
     * Gets the value of the current TimeSpan structure expressed in whole and fractional hours.
     */
    public get totalHours(): number {
        return this._totalMilliseconds / TimeSpan.millisecondsPerHour;
    }

    /**
     * Gets the value of the current TimeSpan structure expressed in whole and fractional days.
     */
    public get totalDays(): number {
        return this._totalMilliseconds / TimeSpan.millisecondsPerDay;
    }

    /**
     * Gets the days component of the time interval represented by the current TimeSpan structure.
     */
    public get days(): number {
        return Math.trunc(this.totalDays);
    }

    /**
     * Gets the hours component of the time interval represented by the current TimeSpan structure.
     */
    public get hours(): number {
        return Math.trunc((this._totalMilliseconds - TimeSpan.millisecondsPerDay * this.days) / TimeSpan.millisecondsPerHour);
    }

    /**
     * Gets the minutes component of the time interval represented by the current TimeSpan structure.
     */
    public get minutes(): number {
        return Math.trunc((this._totalMilliseconds - TimeSpan.millisecondsPerDay * this.days - TimeSpan.millisecondsPerHour * this.hours) / TimeSpan.millisecondsPerMinute);
    }

    /**
     * Gets the seconds component of the time interval represented by the current TimeSpan structure.
     */
    public get seconds(): number {
        return Math.trunc((this._totalMilliseconds - TimeSpan.millisecondsPerDay * this.days - TimeSpan.millisecondsPerHour * this.hours - TimeSpan.millisecondsPerMinute * this.minutes) / TimeSpan.millisecondsPerSecond);
    }

    /**
     * Gets the milliseconds component of the time interval represented by the current TimeSpan structure.
     */
    public get milliseconds(): number {
        return Math.trunc((this._totalMilliseconds - TimeSpan.millisecondsPerDay * this.days - TimeSpan.millisecondsPerHour * this.hours - TimeSpan.millisecondsPerMinute * this.minutes - TimeSpan.millisecondsPerSecond * this.seconds));
    }

    public isTimeSpan: true = true;

    /**
     * Returns a new TimeSpan object whose value is the sum of the specified TimeSpan object and this instance.
     * @param ts - The time interval to add.
     * @returns TimeSpan - A new object that represents the value of this instance plus the value of ts.
     */
    public add(ts: TimeSpan): TimeSpan {
        const result = new TimeSpan();
        result._totalMilliseconds = this._totalMilliseconds + ts._totalMilliseconds;
        return result;
    }

    /**
     * Returns a new TimeSpan object whose value is the difference between the specified TimeSpan object and this instance.
     * @param ts - The time interval to be subtracted.
     * @returns TimeSpan - A new time interval whose value is the result of the value of this instance minus the value of ts.
     */
    public subtract(ts: TimeSpan): TimeSpan {
        const result = new TimeSpan();
        result._totalMilliseconds = this._totalMilliseconds - ts._totalMilliseconds;
        return result;
    }

    /**
     * Returns a new TimeSpan object which value is the result of multiplication of this instance and the specified factor.
     * @param factor - The value to be multiplied by.
     * @returns TimeSpan - A new object that represents the value of this instance multiplied by the value of factor.
     */
    public multiply(factor: number): TimeSpan {
        const result = new TimeSpan();
        result._totalMilliseconds = this._totalMilliseconds * factor;
        return result;
    }

    /**
     * Returns a new TimeSpan object whose value is the negated value of this instance.
     * @returns TimeSpan - A new object with the same numeric value as this instance, but with the opposite sign.
     */
    public negate(): TimeSpan {
        const result = new TimeSpan();
        result._totalMilliseconds = -this._totalMilliseconds;
        return result;
    }

    public toTimeString(): string {
        return `${Utility.pad(this.hours)}:${Utility.pad(this.minutes)}:${Utility.pad(this.seconds)}`;
    };

    public toShortTimeString(): string {
        return `${Utility.pad(this.hours)}:${Utility.pad(this.minutes)}`;
    };

    /**
     * Returns a TimeSpan that represents a specified number of days, where the specification is accurate to the nearest millisecond.
     * @param days - A number of days, accurate to the nearest millisecond.
     * @returns TimeSpan - An object that represents value.
     */
    public static fromDays(days: number): TimeSpan {
        return TimeSpan.fromMilliseconds(days * TimeSpan.millisecondsPerDay);
    }

    /**
     * Returns a TimeSpan that represents a specified number of hours, where the specification is accurate to the nearest millisecond.
     * @param hours - A number of hours accurate to the nearest millisecond.
     * @returns TimeSpan - An object that represents value.
     */
    public static fromHours(hours: number): TimeSpan {
        return TimeSpan.fromMilliseconds(hours * TimeSpan.millisecondsPerHour);
    }

    /**
     * Returns a TimeSpan that represents a specified number of minutes, where the specification is accurate to the nearest millisecond.
     * @param minutes - A number of minutes, accurate to the nearest millisecond.
     * @returns TimeSpan - An object that represents value.
     */
    public static fromMinutes(minutes: number): TimeSpan {
        return TimeSpan.fromMilliseconds(minutes * TimeSpan.millisecondsPerMinute);
    }

    /**
     * Returns a TimeSpan that represents a specified number of seconds, where the specification is accurate to the nearest millisecond.
     * @param seconds - A number of seconds, accurate to the nearest millisecond.
     * @returns TimeSpan - An object that represents value.
     */
    public static fromSeconds(seconds: number): TimeSpan {
        return TimeSpan.fromMilliseconds(seconds * TimeSpan.millisecondsPerSecond);
    }

    /**
     * Returns a TimeSpan that represents a specified number of milliseconds.
     * @param milliseconds - A number of milliseconds.
     * @returns TimeSpan - An object that represents value.
     */
    public static fromMilliseconds(milliseconds: number): TimeSpan {
        const result = new TimeSpan();
        result._totalMilliseconds = Math.round(milliseconds);
        return result;
    }

    /**
     * Compares this instance to a specified TimeSpan object and returns an integer that indicates whether this instance is shorter than, equal to, or longer than the TimeSpan object.
     * @param value - An object to compare to this instance.
     * @returns number - A signed number indicating the relative values of this instance and value.
     * "A negative integer": This instance is shorter than value.
     * "Zero": This instance is equal to value.
     * "A positive integer": This instance is longer than value.
     */
    public compareTo(value: TimeSpan): number {
        if (this._totalMilliseconds > value._totalMilliseconds) {
            return 1;
        }
        if (this._totalMilliseconds < value._totalMilliseconds) {
            return -1;
        }
        return 0;
    }

    /**
     * Returns a hash code for this instance.
     * @returns number - A 32-bit signed integer hash code.
     */
    public getHashCode(): number {
        return this._totalMilliseconds ^ (this._totalMilliseconds >> 32);
    }

    /**
     * Returns a value indicating whether this instance is equal to a specified TimeSpan object.
     * @param obj - An object to compare with this instance.
     * @returns boolean - true if obj represents the same time interval as this instance; otherwise, false.
     */
    public equals(obj: TimeSpan): boolean {
        return (this._totalMilliseconds == obj._totalMilliseconds);
    }

    /**
     * Compares two TimeSpan values and returns an integer that indicates whether the first value is shorter than, equal to, or longer than the second value.
     * @param t1 - The first time interval to compare.
     * @param t2 - The second time interval to compare.
     * @returns number - One of the following values.
     * "-1": t1 is shorter than t2.
     * "0": t1 is equal to t2.
     * "1": t1 is longer than t2.
     */
    public static compare(t1: TimeSpan, t2: TimeSpan): number {
        return t1.compareTo(t2);
    }

    /**
     * Returns a value that indicates whether two specified instances of TimeSpan are equal.
     * @param t1 - The first time interval to compare.
     * @param t2 - The second time interval to compare.
     * @returns boolean - true if the values of t1 and t2 are equal; otherwise, false.
     */
    public static equals(t1: TimeSpan, t2: TimeSpan): boolean {
        return t1.equals(t2);
    }
}