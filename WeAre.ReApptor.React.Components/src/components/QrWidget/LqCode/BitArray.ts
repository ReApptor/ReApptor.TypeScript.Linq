import System from "./System";
import Integer from "./Integer";


export default class BitArray {
    private bits: number[];
    private size: number;
    
    public static new(size: number): BitArray {
        const bits: number[] = BitArray.makeArray(size);
        return new BitArray(bits, size);
    }
    
    constructor(bits: number[], size: number) {
        this.bits = bits;
        this.size = size;
    }
    
    public getSize(): number {
        return this.size;
    }
    
    public getSizeInBytes(): number {
        return (this.size + 7) / 8;
    }

    private ensureCapacity(size: number): void {
        if (size > this.bits.length * 32) {
            const newBits: number[] = BitArray.makeArray(size);
            System.arraycopy(this.bits, 0, newBits, 0, this.bits.length);
            this.bits = newBits;
        }
    }
    
    public get(i: number): boolean {
        return (this.bits[i / 32] & 1 << (i & 31)) != 0;
    }
    
    public set(i: number): void {
        const var10000: number[] = this.bits;
        var10000[i / 32] |= 1 << (i & 31);
    }
    
    public flip(i: number): void {
        const var10000: number[] = this.bits;
        var10000[i / 32] ^= 1 << (i & 31);
    }
    
    public getNextSet(from: number): number {
        if (from >= this.size) {
            return this.size;
        } else {
            let bitsOffset: number = from / 32;
            let currentBits: number = this.bits[bitsOffset];
    
            for(currentBits &= ~((1 << (from & 31)) - 1); currentBits == 0; currentBits = this.bits[bitsOffset]) {
                ++bitsOffset;
                if (bitsOffset == this.bits.length) {
                    return this.size;
                }
            }
    
            const result: number = bitsOffset * 32 + Integer.numberOfTrailingZeros(currentBits);
            return result > this.size ? this.size : result;
        }
    }
    
    public getNextUnset(from: number): number {
        if (from >= this.size) {
            return this.size;
        } else {
            let bitsOffset: number = from / 32;
            let currentBits: number = ~this.bits[bitsOffset];
    
            for(currentBits &= ~((1 << (from & 31)) - 1); currentBits == 0; currentBits = ~this.bits[bitsOffset]) {
                ++bitsOffset;
                if (bitsOffset == this.bits.length) {
                    return this.size;
                }
            }
    
            const result: number = bitsOffset * 32 + Integer.numberOfTrailingZeros(currentBits);
            return result > this.size ? this.size : result;
        }
    }
    
    public setBulk(i: number, newBits: number): void {
        this.bits[i / 32] = newBits;
    }
    
    public setRange(start: number, end: number): void {
        if (end < start) {
            throw new Error();
        } else if (end != start) {
            --end;
            let firstInt: number = start / 32;
            let lastInt: number = end / 32;
    
            for(let i: number = firstInt; i <= lastInt; ++i) {
                let firstBit: number = i > firstInt ? 0 : start & 31;
                let lastBit: number = i < lastInt ? 31 : end & 31;
                let mask: number;
                if (firstBit == 0 && lastBit == 31) {
                    mask = -1;
                } else {
                    mask = 0;
    
                    for(let j: number = firstBit; j <= lastBit; ++j) {
                        mask |= 1 << j;
                    }
                }
    
                const var10000: number[] = this.bits;
                var10000[i] |= mask;
            }
    
        }
    }
    
    public clear(): void {
        const max: number = this.bits.length;
    
        for(let i: number = 0; i < max; ++i) {
            this.bits[i] = 0;
        }
    
    }
    
    public isRange(start: number, end: number, value: number): boolean {
        if (end < start) {
            throw new Error();
        } else if (end == start) {
            return true;
        } else {
            --end;
            let firstInt: number = start / 32;
            let lastInt: number = end / 32;
    
            for(let i: number = firstInt; i <= lastInt; ++i) {
                let firstBit: number = i > firstInt ? 0 : start & 31;
                let lastBit: number = i < lastInt ? 31 : end & 31;
                let mask: number;
                if (firstBit == 0 && lastBit == 31) {
                    mask = -1;
                } else {
                    mask = 0;
    
                    for(let j: number = firstBit; j <= lastBit; ++j) {
                        mask |= 1 << j;
                    }
                }
    
                if ((this.bits[i] & mask) != (value ? mask : 0)) {
                    return false;
                }
            }
    
            return true;
        }
    }
    
    public appendBit(bit: boolean): void {
        this.ensureCapacity(this.size + 1);
        if (bit) {
            const var10000: number[] = this.bits;
            const var10001: number = this.size / 32;
            var10000[var10001] |= 1 << (this.size & 31);
        }
    
        ++this.size;
    }
    
    public appendBits(value: number, numBits: number): void {
        if (numBits >= 0 && numBits <= 32) {
            this.ensureCapacity(this.size + numBits);
    
            for(let numBitsLeft: number = numBits; numBitsLeft > 0; --numBitsLeft) {
                this.appendBit((value >> numBitsLeft - 1 & 1) == 1);
            }
    
        } else {
            throw new Error("Num bits must be between 0 and 32");
        }
    }
    
    public appendBitArray(other: BitArray): void {
        const otherSize: number = other.size;
        this.ensureCapacity(this.size + otherSize);
    
        for(let i: number = 0; i < otherSize; ++i) {
            this.appendBit(other.get(i));
        }
    
    }
    
    public xor(other: BitArray): void {
        if (this.bits.length != other.bits.length) {
            throw new Error("Sizes don't match");
        } else {
            for(let i: number = 0; i < this.bits.length; ++i) {
                const var10000: number[] = this.bits;
                var10000[i] ^= other.bits[i];
            }
    
        }
    }
    
    public toBytes(bitOffset: number, array: number[], offset: number, numBytes: number): void {
        for(let i: number = 0; i < numBytes; ++i) {
            let theByte: number = 0;
    
            for(let j: number = 0; j < 8; ++j) {
                if (this.get(bitOffset)) {
                    theByte |= 1 << 7 - j;
                }
    
                ++bitOffset;
            }
    
            array[offset + i] = theByte;
        }
    
    }
    
    public getBitArray(): number[] {
        return this.bits;
    }
    
    public reverse(): void {
        const newBits: number[] = [this.bits.length];
        const len: number = (this.size - 1) / 32;
        const oldBitsLen: number = len + 1;
    
        let leftOffset: number;
        for(leftOffset = 0; leftOffset < oldBitsLen; ++leftOffset) {
            let x: number = this.bits[leftOffset];
            x = x >> 1 & 1431655765 | (x & 1431655765) << 1;
            x = x >> 2 & 858993459 | (x & 858993459) << 2;
            x = x >> 4 & 252645135 | (x & 252645135) << 4;
            x = x >> 8 & 16711935 | (x & 16711935) << 8;
            x = x >> 16 & 65535 | (x & 65535) << 16;
            newBits[len - leftOffset] = x;
        }
    
        if (this.size != oldBitsLen * 32) {
            leftOffset = oldBitsLen * 32 - this.size;
            let mask: number = 1;
    
            let currentInt: number;
            for(currentInt = 0; currentInt < 31 - leftOffset; ++currentInt) {
                mask = mask << 1 | 1;
            }
    
            currentInt = newBits[0] >> leftOffset & mask;
    
            for(let i: number = 1; i < oldBitsLen; ++i) {
                const nextInt: number = newBits[i];
                currentInt |= nextInt << 32 - leftOffset;
                newBits[i - 1] = currentInt;
                currentInt = nextInt >> leftOffset & mask;
            }
    
            newBits[oldBitsLen - 1] = currentInt;
        }
    
        this.bits = newBits;
    }
    
    private static makeArray(size: number): number[] {
        return [(size + 31) / 32];
    }
    
    // public equals(other: BitArray): boolean {
    //     return this.size == other.size && Arrays.equals(this.bits, other.bits);
    // }
    
    // public int hashCode() {
    //     return 31 * this.size + Arrays.hashCode(this.bits);
    // }
    
    // public String toString() {
    //     StringBuilder result = new StringBuilder(this.size);
    //
    //     for(int i = 0; i < this.size; ++i) {
    //         if ((i & 7) == 0) {
    //             result.append(' ');
    //         }
    //
    //         result.append((char)(this.get(i) ? 'X' : '.'));
    //     }
    //
    //     return result.toString();
    // }
    //
    // public BitArray clone() {
    //     return new BitArray((int[])this.bits.clone(), this.size);
    // }
}