import LuminanceSource from "./LuminanceSource";
import BitArray from "./BitArray";


export default abstract class Binarizer {
    
    private readonly source: LuminanceSource;

    protected constructor(source: LuminanceSource) {
        this.source = source;
    }
    
    public getLuminanceSource(): LuminanceSource {
        return this.source;
    }
    
    public abstract getBlackRow(var1: number, var2: BitArray): BitArray;
    
    //public abstract getBlackMatrix(): BitMatrix;
    
    public abstract createBinarizer(var1: LuminanceSource): Binarizer;
    
    public getWidth(): number {
        return this.source.getWidth();
    }
    
    public getHeight(): number {
        return this.source.getHeight();
    }
}