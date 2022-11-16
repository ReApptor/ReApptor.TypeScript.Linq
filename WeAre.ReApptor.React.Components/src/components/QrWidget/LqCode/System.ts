

export default class System {

    public static arraycopy<T>(src: T[], srcPos: number, dst: T[], dstPos: number, length: number): void {
        //System.arraycopy(this.yuvData, inputOffset, matrix, 0, area);
        for (let i: number = 0; i < length; i++) {
            dst[dstPos + i] = src[srcPos + i];
        }
    }
    
    public static currentTimeMillis(): number {
        return Date.now();
    }
}