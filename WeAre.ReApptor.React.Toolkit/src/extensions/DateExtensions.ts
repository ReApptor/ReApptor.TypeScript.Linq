import Utility from "../Utility";
import DateUtility from "../DateUtility";
import HashCodeUtility from "../HashCodeUtility";

/* eslint-disable no-extend-native */

declare global {
    interface Date {

        /**
         * Converts the value of the current DateTime object to its equivalent string representation using the specified format and the formatting conventions of the current culture.
         * @returns string - A string representation of value of the current DateTime object as specified by format.
         */
        format(format: string): string;
        
        /**
         * Gets the date component of this instance.
         * @returns Date - A new object with the same date as this instance, and the time value set to 12:00:00 midnight (00:00:00).
         */
        date(): Date;

        /**
         * Returns a new Date that adds the specified number of milliseconds to the value of this instance.
         * @param value - A number of milliseconds. The value parameter can be negative or positive.
         * @returns Date - An object whose value is the sum of the date and time represented by this instance and the number of milliseconds represented by value.
         */
        addMilliseconds(value: number): Date;

        /**
         * Returns a new Date that adds the specified number of seconds to the value of this instance.
         * @param value - A number of seconds. The value parameter can be negative or positive.
         * @returns Date - An object whose value is the sum of the date and time represented by this instance and the number of seconds represented by value.
         */
        addSeconds(value: number): Date;

        /**
         * Returns a new Date that adds the specified number of minutes to the value of this instance.
         * @param value - A number of minutes. The value parameter can be negative or positive.
         * @returns Date - An object whose value is the sum of the date and time represented by this instance and the number of minutes represented by value.
         */
        addMinutes(value: number): Date;

        /**
         * Returns a new Date that adds the specified number of hours to the value of this instance.
         * @param value - A number of hours. The value parameter can be negative or positive.
         * @returns Date - An object whose value is the sum of the date and time represented by this instance and the number of hours represented by value.
         */
        addHours(value: number): Date;

        /**
         * Returns a new Date that adds the specified number of days to the value of this instance.
         * @param value - A number of whole and fractional days. The value parameter can be negative or positive.
         * @returns Date - An object whose value is the sum of the date and time represented by this instance and the number of days represented by value.
         */
        addDays(value: number): Date;

        /**
         * Returns a new Date that adds the specified number of months to the value of this instance.
         * @param value - A number of months. The months parameter can be negative or positive.
         * @returns Date - An object whose value is the sum of the date and time represented by this instance and months.
         */
        addMonths(value: number): Date;

        /**
         * Returns a new DateTime that adds the specified number of years to the value of this instance.
         * @param value - A number of years. The value parameter can be negative or positive.
         * @returns Date - An object whose value is the sum of the date and time represented by this instance and the number of years represented by value.
         */
        addYears(value: number): Date;

        /**
         * Converts the value of the current DateTime object to Coordinated Universal Time (UTC).
         * @returns Date - An object whose Kind property is Utc, and whose value is the UTC equivalent to the value of the current DateTime object, or MaxValue if the converted value is too large to be represented by a DateTime object, or MinValue if the converted value is too small to be represented by a DateTime object.
         */
        toUniversalTime(): Date;

        /**
         * Converts the value of the current DateTime object to local time.
         * @returns Date - An object whose Kind property is Local, and whose value is the local time equivalent to the value of the current DateTime object, or MaxValue if the converted value is too large to be represented by a DateTime object, or MinValue if the converted value is too small to be represented as a DateTime object.
         */
        toLocalTime(): Date;

        /**
         * Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC, ignores time zone.
         * @returns number - A time value in milliseconds since midnight, January 1, 1970 UTC.
         */
        utcValueOf(): number;

        /**
         * Returns the hash code for this instance.
         * @returns Number - A 32-bit signed integer hash code.
         */
        getHashCode(): number;

        inFuture(dateOnly?: boolean): boolean;

        inPast(dateOnly?: boolean): boolean;

        isSunday(): boolean;

        isToday(): boolean;

        inInterval(from: Date | string | null | undefined, to: Date | string | null | undefined): boolean;

        /**
         * Returns the date only in ISO format (yyyy-mm-dd)
         * @returns string - date in "yyyy-mm-dd" format.
         */
        toISODateString(): string;

        /**
         * Returns the date and time in ISO format with timezone (yyyy-mm-ddThh:MM:ss+Z:Z)
         * @returns string - date in "yyyy-mm-ddThh:MM:ss+Z:Z" format.
         */
        toLongISOString(): string;

        /**
         * Returns the number of days in this instance month and year.
         * @returns number - The month (a number ranging from 1 to 12).
         */
        getDaysInMonth(): number;

        /**
         * Compares the value of this instance to a specified Date value and returns an integer that indicates whether this instance is earlier than, the same as, or later than the specified Date value.
         * @param value - The object to compare to the current instance.
         * @param inverse - Use "true" to inverse the result.
         * @returns number - A signed number indicating the relative values of this instance and the value parameter.
         * Less than zero	This instance is earlier than value.
         * Zero	This instance is the same as value.
         * Greater than zero	This instance is later than value.
         */
        compareTo(value: Date, inverse?: boolean): number;

        /**
         * Returns a value indicating whether the value of this instance is equal to the value of the specified Date instance.
         * @param value - The object to compare to this instance.
         * @returns boolean - true if the value parameter equals the value of this instance; otherwise, false.
         */
        equals(value: Date): boolean;
    }
}

export const DateExtensions = function () {
    
    if (Date.prototype.format == null) {
        Date.prototype.format = function(format: string): string {
            return Utility.formatValue(this, format);
        };
    }
    
    if (Date.prototype.date == null) {
        Date.prototype.date = function(): Date {
            return Utility.getDateWithoutTime(this);
        };
    }
    
    // if (Date.prototype.time == null) {
    //     Date.prototype.time = function (): TimeSpan {
    //         return DateUtility.time(this);
    //     };
    // }

    if (Date.prototype.addMilliseconds == null) {
        Date.prototype.addMilliseconds = function(value: number): Date {
            return Utility.addMilliseconds(this, value);
        };
    }

    if (Date.prototype.addSeconds == null) {
        Date.prototype.addSeconds = function(value: number): Date {
            return Utility.addSeconds(this, value);
        };
    }

    if (Date.prototype.addMinutes == null) {
        Date.prototype.addMinutes = function(value: number): Date {
            return Utility.addMinutes(this, value);
        };
    }

    if (Date.prototype.addHours == null) {
        Date.prototype.addHours = function(value: number): Date {
            return Utility.addHours(this, value);
        };
    }
    
    if (Date.prototype.addDays == null) {
        Date.prototype.addDays = function(value: number): Date {
            return Utility.addDays(this, value);
        };
    }
    
    if (Date.prototype.addMonths == null) {
        Date.prototype.addMonths = function(value: number): Date {
            return Utility.addMonths(this, value);
        };
    }
    
    if (Date.prototype.addYears == null) {
        Date.prototype.addYears = function(value: number): Date {
            return Utility.addYears(this, value);
        };
    }

    // if (Date.prototype.add == null) {
    //     Date.prototype.add = function (value: TimeSpan): Date {
    //         return DateUtility.add(this, value);
    //     };
    // }
    
    if (Date.prototype.toUniversalTime == null) {
        Date.prototype.toUniversalTime = function(): Date {
            return Utility.toUtc(this);
        };
    }
    
    if (Date.prototype.toLocalTime == null) {
        Date.prototype.toLocalTime = function(): Date {
            return Utility.toLocal(this);
        };
    }
    
    if (Date.prototype.utcValueOf == null) {
        Date.prototype.utcValueOf = function(): number {
            return Utility.utcValueOf(this);
        };
    }
    
    if (Date.prototype.getHashCode == null) {
        Date.prototype.getHashCode = function(): number {
            return HashCodeUtility.getDateHashCode(this);
        };
    }
    
    if (Date.prototype.inFuture == null) {
        Date.prototype.inFuture = function(dateOnly: boolean = false): boolean {
            return Utility.inFuture(this, dateOnly);
        };
    }
    
    if (Date.prototype.inPast == null) {
        Date.prototype.inPast = function(dateOnly: boolean = false): boolean {
            return Utility.inPast(this, dateOnly);
        };
    }
    
    if (Date.prototype.isSunday == null) {
        Date.prototype.isSunday = function(): boolean {
            return Utility.isSunday(this);
        };
    }
    
    if (Date.prototype.isToday == null) {
        Date.prototype.isToday = function(): boolean {
            return Utility.isToday(this);
        };
    }
    
    if (Date.prototype.inInterval == null) {
        Date.prototype.inInterval = function (from: Date | string | null | undefined, to: Date | string | null | undefined): boolean {
            return Utility.inInterval(this, from, to);
        };
    }
    
    if (Date.prototype.toISODateString == null) {
        Date.prototype.toISODateString = function (): string {
            return Utility.toISODateString(this);
        };
    }
    
    if (Date.prototype.toLongISOString == null) {
        Date.prototype.toLongISOString = function (): string {
            return Utility.toLongISOString(this);
        };
    }
    
    if (Date.prototype.getDaysInMonth == null) {
        Date.prototype.getDaysInMonth = function (): number {
            return Utility.getDaysInMonth(this);
        };
    }

    if (Date.prototype.compareTo == null) {
        Date.prototype.compareTo = function (value: Date, inverse: boolean = false): number {
            return DateUtility.compare(this, value, inverse);
        };
    }

    if (Date.prototype.equals == null) {
        Date.prototype.equals = function (value: Date): boolean {
            return DateUtility.equals(this, value);
        };
    }
};

DateExtensions();