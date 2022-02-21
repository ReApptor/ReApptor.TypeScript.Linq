import Utility from "../Utility";
import HashCodeUtility from "../HashCodeUtility";

declare global {
    interface Number {

        /**
         * Converts the value of the current DateTime object to its equivalent string representation using the specified format and the formatting conventions of the current culture.
         * @returns string - A string representation of value of the current DateTime object as specified by format.
         */
        format(format: string): string;

        /**
         * Returns the hash code for this instance.
         * @returns Number - A 32-bit signed integer hash code.
         */
        getHashCode(): number;
    }
}

export const NumberExtensions = function () {

    if (Number.prototype.format == null) {
        Number.prototype.format = function(format: string): string {
            return Utility.formatValue(this, format);
        };
    }
    
    if (Number.prototype.getHashCode == null) {
        Number.prototype.getHashCode = function (): number {
            return HashCodeUtility.getNumberHashCode(this as number);
        };
    }
    
};

NumberExtensions();