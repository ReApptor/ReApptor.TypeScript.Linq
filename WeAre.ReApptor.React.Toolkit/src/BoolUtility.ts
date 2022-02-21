
export default class BoolUtility {

    public static compare(x: boolean, y: boolean, inverse: boolean = false): number {
        if (x < y) {
            return (inverse) ? 1 : -1;
        }
        if (x > y) {
            return (inverse) ? -1 : 1;
        }
        return 0;
    }

}