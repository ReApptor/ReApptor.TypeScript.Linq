import System from "./System";
import Integer from "./Integer";
import BitArray from "./BitArray";


export default class BitMatrix {
    private readonly width: number;
    private readonly height: number;
    private readonly rowSize: number;
    private readonly bits: number[];
    
    constructor(width: number, height?: number) {
        height = height ?? width;
        if (width >= 1 && height >= 1) {
            this.width = width;
            this.height = height;
            this.rowSize = (width + 31) / 32;
            this.bits = [this.rowSize * height];
        } else {
            throw new Error("Both dimensions must be greater than 0");
        }
    }
    
    // private BitMatrix(int width, int height, int rowSize, int[] bits) {
    //     this.width = width;
    //     this.height = height;
    //     this.rowSize = rowSize;
    //     this.bits = bits;
    // }
    
    public get(x: number, y: number): boolean {
        const offset: number = y * this.rowSize + x / 32;
        return (this.bits[offset] >>> (x & 31) & 1) != 0;
    }
    
    public set(x: number, y: number): void {
        const offset: number = y * this.rowSize + x / 32;
        const var10000: number[] = this.bits;
        var10000[offset] |= 1 << (x & 31);
    }
    
    public flip(x: number, y: number): void {
        const offset: number = y * this.rowSize + x / 32;
        const var10000: number[] = this.bits;
        var10000[offset] ^= 1 << (x & 31);
    }
    
    public clear(): void {
        const max: number = this.bits.length;
    
        for(let i: number = 0; i < max; ++i) {
            this.bits[i] = 0;
        }
    }
    
    public setRegion(left: number, top: number, width: number, height: number): void {
        if (top >= 0 && left >= 0) {
            if (height >= 1 && width >= 1) {
                const right: number = left + width;
                const bottom: number = top + height;
                if (bottom <= this.height && right <= this.width) {
                    for(let y: number = top; y < bottom; ++y) {
                        const offset: number = y * this.rowSize;
    
                        for(let x: number = left; x < right; ++x) {
                            const var10000: number[] = this.bits;
                            var10000[offset + x / 32] |= 1 << (x & 31);
                        }
                    }
    
                } else {
                    throw new Error("The region must fit inside the matrix");
                }
            } else {
                throw new Error("Height and width must be at least 1");
            }
        } else {
            throw new Error("Left and top must be nonnegative");
        }
    }
    
    public getRow(y: number, row: BitArray): BitArray {
        if (row != null && row.getSize() >= this.width) {
            row.clear();
        } else {
            row = BitArray.new(this.width);
        }
    
        const offset: number = y * this.rowSize;
    
        for(let x: number = 0; x < this.rowSize; ++x) {
            row.setBulk(x * 32, this.bits[offset + x]);
        }
    
        return row;
    }
    
    public setRow(y: number, row: BitArray): void {
        System.arraycopy(row.getBitArray(), 0, this.bits, y * this.rowSize, this.rowSize);
    }
    
    public rotate180(): void {
        const width: number = this.getWidth();
        const height: number = this.getHeight();
        let topRow: BitArray = BitArray.new(width);
        let bottomRow: BitArray = BitArray.new(width);
    
        for(let i: number = 0; i < (height + 1) / 2; ++i) {
            topRow = this.getRow(i, topRow);
            bottomRow = this.getRow(height - 1 - i, bottomRow);
            topRow.reverse();
            bottomRow.reverse();
            this.setRow(i, bottomRow);
            this.setRow(height - 1 - i, topRow);
        }
    }
    
    public getEnclosingRectangle(): number[] | null {
        let left: number = this.width;
        let top: number = this.height;
        let right: number = -1;
        let bottom: number = -1;
    
        let y: number;
        let x32: number;
        for(y = 0; y < this.height; ++y) {
            for(x32 = 0; x32 < this.rowSize; ++x32) {
                const theBits: number = this.bits[y * this.rowSize + x32];
                if (theBits != 0) {
                    if (y < top) {
                        top = y;
                    }
    
                    if (y > bottom) {
                        bottom = y;
                    }
    
                    let bit: number;
                    if (x32 * 32 < left) {
                        for(bit = 0; theBits << 31 - bit == 0; ++bit) {
                        }
    
                        if (x32 * 32 + bit < left) {
                            left = x32 * 32 + bit;
                        }
                    }
    
                    if (x32 * 32 + 31 > right) {
                        for(bit = 31; theBits >>> bit == 0; --bit) {
                        }
    
                        if (x32 * 32 + bit > right) {
                            right = x32 * 32 + bit;
                        }
                    }
                }
            }
        }
    
        y = right - left;
        x32 = bottom - top;
        if (y >= 0 && x32 >= 0) {
            return [left, top, y, x32];
        } else {
            return null;
        }
    }
    
    public getTopLeftOnBit(): number[] | null {
        let bitsOffset: number;
        for(bitsOffset = 0; bitsOffset < this.bits.length && this.bits[bitsOffset] == 0; ++bitsOffset) {
        }
    
        if (bitsOffset == this.bits.length) {
            return null;
        } else {
            const y: number = bitsOffset / this.rowSize;
            let x: number = bitsOffset % this.rowSize * 32;
            const theBits: number = this.bits[bitsOffset];
    
            let bit: number;
            for(bit = 0; theBits << 31 - bit == 0; ++bit) {
            }
    
            x += bit;
            return [x, y];
        }
    }
    
    public getBottomRightOnBit(): number[] | null {
        let bitsOffset: number;
        for(bitsOffset = this.bits.length - 1; bitsOffset >= 0 && this.bits[bitsOffset] == 0; --bitsOffset) {
        }
    
        if (bitsOffset < 0) {
            return null;
        } else {
            const y: number = bitsOffset / this.rowSize;
            let x: number = bitsOffset % this.rowSize * 32;
            const theBits: number = this.bits[bitsOffset];
    
            let bit: number;
            for(bit = 31; theBits >>> bit == 0; --bit) {
            }
    
            x += bit;
            return [x, y];
        }
    }
    
    public getWidth(): number {
        return this.width;
    }
    
    public getHeight(): number {
        return this.height;
    }
    
    // public boolean equals(Object o) {
    //     if (!(o instanceof BitMatrix)) {
    //         return false;
    //     } else {
    //         BitMatrix other = (BitMatrix)o;
    //         return this.width == other.width && this.height == other.height && this.rowSize == other.rowSize && Arrays.equals(this.bits, other.bits);
    //     }
    // }
    //
    // public int hashCode() {
    //     int hash = this.width;
    //     hash = 31 * hash + this.width;
    //     hash = 31 * hash + this.height;
    //     hash = 31 * hash + this.rowSize;
    //     hash = 31 * hash + Arrays.hashCode(this.bits);
    //     return hash;
    // }
    //
    // public String toString() {
    //     StringBuilder result = new StringBuilder(this.height * (this.width + 1));
    //
    //     for(int y = 0; y < this.height; ++y) {
    //         for(int x = 0; x < this.width; ++x) {
    //             result.append(this.get(x, y) ? "X " : "  ");
    //         }
    //
    //         result.append('\n');
    //     }
    //
    //     return result.toString();
    // }
    //
    // public BitMatrix clone() {
    //     return new BitMatrix(this.width, this.height, this.rowSize, (int[])this.bits.clone());
    // }
}