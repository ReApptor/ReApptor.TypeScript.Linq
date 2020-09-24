import Utility from "../Utility";
import HashCodeUtility from "../HashCodeUtility";

declare global {
    interface Date {

        /**
         * Converts the value of the current DateTime object to its equivalent string representation using the specified format and the formatting conventions of the current culture.
         * @param format - A standard or custom date and time format string.
         * @returns string - A string representation of value of the current DateTime object as specified by format.
         */
        format(format: string): string;
        
        /**
         * Gets the date component of this instance.
         * @returns Date - A new object with the same date as this instance, and the time value set to 12:00:00 midnight (00:00:00).
         */
        date(): Date;

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
         * Converts the value of the current DateTime object to Coordinated Universal Time (UTC).
         * @returns Date - An object whose Kind property is Utc, and whose value is the UTC equivalent to the value of the current DateTime object, or MaxValue if the converted value is too large to be represented by a DateTime object, or MinValue if the converted value is too small to be represented by a DateTime object.
         */
        toUniversalTime(): Date;

        /** Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC, ignores time zone. */
        utcValueOf(): number;

        /**
         * Returns the hash code for this instance.
         * @returns Number - A 32-bit signed integer hash code.
         */
        getHashCode(): number;

        inFuture(): boolean;

        inPast(): boolean;

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
    
    if (Date.prototype.toUniversalTime == null) {
        Date.prototype.toUniversalTime = function(): Date {
            return Utility.toUtc(this);
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
        Date.prototype.inFuture = function(): boolean {
            return Utility.inFuture(this);
        };
    }
    
    if (Date.prototype.inPast == null) {
        Date.prototype.inPast = function(): boolean {
            return Utility.inPast(this);
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
};

DateExtensions();