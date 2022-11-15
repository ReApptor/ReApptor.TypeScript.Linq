

export default class LqCodeSystem {

    public static arraycopy(src: number[], srcPos: number, dst: number[], dstPos: number, length: number): void {
        //System.arraycopy(this.yuvData, inputOffset, matrix, 0, area);
        for (let i: number = 0; i < length; i++) {
            dst[dstPos + i] = src[srcPos + i];
        }
    }
}