import Integer from "../Integer";
import GenericGFPoly from "./GenericGFPoly";

export default class GenericGF {
    public static readonly AZTEC_DATA_12: GenericGF = new GenericGF(4201, 4096, 1);
    public static readonly AZTEC_DATA_10: GenericGF = new GenericGF(1033, 1024, 1);
    public static readonly AZTEC_DATA_6: GenericGF = new GenericGF(67, 64, 1);
    public static readonly AZTEC_PARAM: GenericGF = new GenericGF(19, 16, 1);
    public static readonly QR_CODE_FIELD_256: GenericGF = new GenericGF(285, 256, 0);
    public static readonly DATA_MATRIX_FIELD_256: GenericGF = new GenericGF(301, 256, 1);
    public static readonly AZTEC_DATA_8: GenericGF = GenericGF.DATA_MATRIX_FIELD_256;
    public static readonly MAXICODE_FIELD_64: GenericGF = GenericGF.AZTEC_DATA_6;
    
    private readonly expTable: number[];
    private readonly logTable: number[];
    private readonly zero: GenericGFPoly;
    private readonly one: GenericGFPoly;
    private readonly size: number;
    private readonly primitive: number;
    private readonly generatorBase: number;

    constructor(primitive: number, size: number, b: number) {
        this.primitive = primitive;
        this.size = size;
        this.generatorBase = b;
        this.expTable = new Array(size);
        this.logTable = new Array(size);
        let x: number = 1;
    
        let i: number;
        for(i = 0; i < size; ++i) {
            this.expTable[i] = x;
            x *= 2;
            if (x >= size) {
                x ^= primitive;
                x &= size - 1;
            }
        }
    
        for(i = 0; i < size - 1; this.logTable[this.expTable[i]] = i++) {
        }
        
        this.zero = new GenericGFPoly(this, [0]);
        this.one = new GenericGFPoly(this, [1]);
    }

    public getZero(): GenericGFPoly {
        return this.zero;
    }

    public getOne(): GenericGFPoly {
        return this.one;
    }

    public buildMonomial(degree: number, coefficient: number): GenericGFPoly {
        if (degree < 0) {
            throw new Error("IllegalArgumentException");
        } else if (coefficient == 0) {
            return this.zero;
        } else {
            const coefficients: number[] = new Array(degree + 1);
            coefficients[0] = coefficient;
            return new GenericGFPoly(this, coefficients);
        }
    }
    
    public static addOrSubtract(a: number, b: number): number {
        return a ^ b;
    }

    public exp(a: number): number {
        return this.expTable[a];
    }

    public log(a: number): number {
        if (a == 0) {
            throw new Error("IllegalArgumentException");
        } else {
            return this.logTable[a];
        }
    }

    public inverse(a: number): number {
        if (a == 0) {
            throw new Error("ArithmeticException");
        } else {
            return this.expTable[this.size - this.logTable[a] - 1];
        }
    }

    public multiply(a: number, b: number): number {
        return a != 0 && b != 0 ? this.expTable[(this.logTable[a] + this.logTable[b]) % (this.size - 1)] : 0;
    }
    
    public getSize(): number {
        return this.size;
    }
    
    public getGeneratorBase(): number {
        return this.generatorBase;
    }

    public equals(other: GenericGF): boolean {
        return (
            (this.primitive == other.primitive) &&
            (this.size == other.size) &&
            (this.generatorBase == other.generatorBase)
        );
    }
    
    public toString(): string {
        return "GF(0x" + Integer.toHexString(this.primitive) + ',' + this.size + ')';
    }
}