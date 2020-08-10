
export default class StringUtility {

    public static compare(x: string, y: string, inverse: boolean = false): number {
        if (x < y) {
            return (inverse) ? 1 : -1;
        }
        if (x > y) {
            return (inverse) ? - 1 : 1;
        }
        return 0;
    }

}