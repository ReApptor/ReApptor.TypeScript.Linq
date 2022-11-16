import Binarizer from "./Binarizer";
import BitMatrix from "./BitMatrix";
import BitArray from "./BitArray";
import LuminanceSource from "./LuminanceSource";

export default class BinaryBitmap {
    private readonly binarizer: Binarizer;
    private matrix: BitMatrix | null = null;

    constructor(binarizer: Binarizer) {
        if (binarizer == null) {
            throw new Error("Binarizer must be non-null.");
        } else {
            this.binarizer = binarizer;
        }
    }
    
    public getWidth(): number {
        return this.binarizer.getWidth();
    }
    
    public getHeight(): number {
        return this.binarizer.getHeight();
    }
    
    public getBlackRow(y: number, row: BitArray): BitArray {
        return this.binarizer.getBlackRow(y, row);
    }
    
    public getBlackMatrix(): BitMatrix {
        if (this.matrix == null) {
            this.matrix = this.binarizer.getBlackMatrix();
        }
        return this.matrix;
    }
    
    public isCropSupported(): boolean {
        return this.binarizer.getLuminanceSource().isCropSupported();
    }
    
    public crop(left: number, top: number, width: number, height: number): BinaryBitmap {
        const newSource: LuminanceSource = this.binarizer.getLuminanceSource().crop(left, top, width, height);
        return new BinaryBitmap(this.binarizer.createBinarizer(newSource));
    }
    
    public isRotateSupported(): boolean {
        return this.binarizer.getLuminanceSource().isRotateSupported();
    }
    
    public rotateCounterClockwise(): BinaryBitmap {
        const newSource: LuminanceSource = this.binarizer.getLuminanceSource().rotateCounterClockwise();
        return new BinaryBitmap(this.binarizer.createBinarizer(newSource));
    }
    
    public rotateCounterClockwise45(): BinaryBitmap {
        const newSource: LuminanceSource = this.binarizer.getLuminanceSource().rotateCounterClockwise45();
        return new BinaryBitmap(this.binarizer.createBinarizer(newSource));
    }
    
    public toString(): string {
        try {
            return this.getBlackMatrix().toString();
        } catch (e) {
            return "";
        }
    }
}