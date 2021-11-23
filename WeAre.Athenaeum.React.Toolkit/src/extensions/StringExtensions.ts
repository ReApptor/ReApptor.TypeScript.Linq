import Utility from "../Utility";
import HashCodeUtility from "../HashCodeUtility";
import StringUtility from "../StringUtility";

declare global {
    interface String {

        /**
         * Replaces the format item in the string with the string representation of a corresponding object in a specified array.
         * @param args - An object array that contains zero or more objects to format.
         * @returns string - A copy of string in which the format items have been replaced by the string representation of the corresponding objects in args.
         */
        format(...args: (string | number | boolean | Date | null | undefined | any)[]): string;

        /**
         * Returns the hash code for this instance.
         * @returns Number - A 32-bit signed integer hash code.
         */
        getHashCode(): number;

        toPascalCase(value: string): string;
    }
}

export const StringExtensions = function () {

    if (String.prototype.format == null) {
        String.prototype.format = function (...args: (string | number | boolean | Date | null | undefined | any)[]): string {
            return Utility.format(this as string, ...args);
        };
    }
    
    if (String.prototype.getHashCode == null) {
        String.prototype.getHashCode = function (): number {
            return HashCodeUtility.getStringHashCode(this as string);
        };
    }
    
    if (String.prototype.toPascalCase == null) {
        String.prototype.toPascalCase = function (): string {
            return StringUtility.toPascalCase(this as string);
        };
    }

};

StringExtensions();