
export default class Integer {

    public static numberOfTrailingZeros(bits: number): number {
        return Math.clz32(bits);
    }

    public static toHexString(value: number): string {
        return value.toString(16);
    }
}