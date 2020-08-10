import Utility from "@/Utility";
import HashCodeUtility from "@/HashCodeUtility";


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
         * Returns a new DateTime that adds the specified number of days to the value of this instance.
         * @param value - A number of whole and fractional days. The value parameter can be negative or positive.
         * @returns Date - An object whose value is the sum of the date and time represented by this instance and the number of days represented by value.
         */
        addDays(value: number): Date;

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
    }
}

export const DateExtensions = function () {
    
    if (Date.prototype.date == null) {
        Date.prototype.date = function (): Date {
            return Utility.getDateWithoutTime(this);
        };
    }
    
    if (Date.prototype.addDays == null) {
        Date.prototype.addDays = function (value: number): Date {
            return Utility.addDays(this, value);
        };
    }
    
    if (Date.prototype.toUniversalTime == null) {
        Date.prototype.toUniversalTime = function (): Date {
            return Utility.toUtc(this);
        };
    }
    
    if (Date.prototype.utcValueOf == null) {
        Date.prototype.utcValueOf = function (): number {
            return Utility.utcValueOf(this);
        };
    }
    
    if (Date.prototype.getHashCode == null) {
        Date.prototype.getHashCode = function (): number {
            return HashCodeUtility.getDateHashCode(this);
        };
    }
    
};

DateExtensions();