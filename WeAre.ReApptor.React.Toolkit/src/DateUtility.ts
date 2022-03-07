import Utility from "./Utility";
import TimeSpan from "./models/TimeSpan";

export default class DateUtility {

    public static compare(x: Date | string, y: Date | string, inverse: boolean = false): number {
        x = (typeof x === "string") ? new Date(x) : x;
        y = (typeof y === "string") ? new Date(y) : y;
        
        const xValue: number = x.valueOf();
        const yValue: number = y.valueOf();
        
        if (xValue < yValue) {
            return (inverse) ? 1 : -1;
        }
        
        if (xValue > yValue) {
            return (inverse) ? - 1 : 1;
        }
        
        return 0;
    }
    
    public static equals(x: Date | string, y: Date | string): boolean {
        x = (typeof x === "string") ? new Date(x) : x;
        y = (typeof y === "string") ? new Date(y) : y;

        const xValue: number = x.valueOf();
        const yValue: number = y.valueOf();

        return (xValue === yValue);
    }

    public static time(x: Date | string): TimeSpan {
        x = (typeof x === "string") ? new Date(x) : x;
        return Utility.diff(x, x.date());
    }

    public static add(x: Date | string, y: TimeSpan): Date {
        x = (typeof x === "string") ? new Date(x) : x;
        const totalMilliseconds: number = x.getTime() + y.totalMilliseconds;
        return  new Date(totalMilliseconds);
    }
}