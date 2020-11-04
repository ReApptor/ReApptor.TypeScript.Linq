
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
}