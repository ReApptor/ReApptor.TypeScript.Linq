export abstract class LogUtilities {
    public static logSpace(arr: string[], str: string): string {
        const longestLength = arr.reduce((a, b) => {
            return b.length > a ? b.length : a;
        }, 0);
        const length = str.length;
        const spaceLength = longestLength - length >= 0 ? longestLength - length : 1;
        return new Array(spaceLength).join(' ');
    }

}
