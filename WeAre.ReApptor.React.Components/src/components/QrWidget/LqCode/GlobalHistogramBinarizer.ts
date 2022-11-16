import Binarizer from "./Binarizer";
import LuminanceSource from "./LuminanceSource";
import BitArray from "./BitArray";
import BitMatrix from "./BitMatrix";

export default class GlobalHistogramBinarizer extends Binarizer {

    //private static readonly LUMINANCE_BITS: number = 5;
    //private static readonly LUMINANCE_SHIFT: number = 3;
    //private static readonly LUMINANCE_BUCKETS: number = 32;
    private static readonly EMPTY: number[] = [];
    private luminances: number[];
    private readonly buckets: number[];

    public constructor(source: LuminanceSource) {
        super(source);
        this.luminances = GlobalHistogramBinarizer.EMPTY;
        this.buckets = new Array(32);
    }
    
    public getBlackRow(y: number, row: BitArray): BitArray {
        const source: LuminanceSource = this.getLuminanceSource();
        const width: number = source.getWidth();
        if (row != null && row.getSize() >= width) {
            row.clear();
        } else {
            row = BitArray.new(width);
        }
    
        this.initArrays(width);
        const localLuminances: number[] = source.getRow(y, this.luminances);
        const localBuckets: number[] = this.buckets;
    
        let blackPoint: number;
        let left: number;
        for(blackPoint = 0; blackPoint < width; ++blackPoint) {
            left = localLuminances[blackPoint] & 255;
            ++localBuckets[left >> 3];
        }
    
        blackPoint = GlobalHistogramBinarizer.estimateBlackPoint(localBuckets);
        left = localLuminances[0] & 255;
        let center: number = localLuminances[1] & 255;
    
        for(let x: number = 1; x < width - 1; ++x) {
            let right: number = localLuminances[x + 1] & 255;
            let luminance: number = (center * 4 - left - right) / 2;
            if (luminance < blackPoint) {
                row.set(x);
            }
    
            left = center;
            center = right;
        }
    
        return row;
    }
    
    public getBlackMatrix(): BitMatrix {
        const source: LuminanceSource = this.getLuminanceSource();
        let width: number = source.getWidth();
        let height: number = source.getHeight();
        const matrix: BitMatrix = new BitMatrix(width, height);
        this.initArrays(width);
        const localBuckets: number[] = this.buckets;
    
        let blackPoint: number;
        let offset: number;
        let x: number;
        let pixel: number;
        for(blackPoint = 1; blackPoint < 5; ++blackPoint) {
            let row: number = height * blackPoint / 5;
            const localLuminances: number[] = source.getRow(row, this.luminances);
            offset = width * 4 / 5;
    
            for(x = width / 5; x < offset; ++x) {
                pixel = localLuminances[x] & 255;
                ++localBuckets[pixel >> 3];
            }
        }
    
        blackPoint = GlobalHistogramBinarizer.estimateBlackPoint(localBuckets);
        const localLuminances: number[] = source.getMatrix();
    
        for(let y: number = 0; y < height; ++y) {
            offset = y * width;
    
            for(x = 0; x < width; ++x) {
                pixel = localLuminances[offset + x] & 255;
                if (pixel < blackPoint) {
                    matrix.set(x, y);
                }
            }
        }
    
        return matrix;
    }
    
    public createBinarizer(source: LuminanceSource): Binarizer {
        return new GlobalHistogramBinarizer(source);
    }
    
    private initArrays(luminanceSize: number): void {
        if (this.luminances.length < luminanceSize) {
            this.luminances = new Array(luminanceSize);
        }
    
        for(let x: number = 0; x < 32; ++x) {
            this.buckets[x] = 0;
        }
    
    }
    
    private static estimateBlackPoint(buckets: number[]): number {
        const numBuckets: number = buckets.length;
        let maxBucketCount: number = 0;
        let firstPeak: number = 0;
        let firstPeakSize: number = 0;
    
        let secondPeak: number;
        for(secondPeak = 0; secondPeak < numBuckets; ++secondPeak) {
            if (buckets[secondPeak] > firstPeakSize) {
                firstPeak = secondPeak;
                firstPeakSize = buckets[secondPeak];
            }
    
            if (buckets[secondPeak] > maxBucketCount) {
                maxBucketCount = buckets[secondPeak];
            }
        }
    
        secondPeak = 0;
        let secondPeakScore: number = 0;
    
        let bestValley: number;
        let bestValleyScore: number;
        let x: number;
        for(bestValley = 0; bestValley < numBuckets; ++bestValley) {
            bestValleyScore = bestValley - firstPeak;
            x = buckets[bestValley] * bestValleyScore * bestValleyScore;
            if (x > secondPeakScore) {
                secondPeak = bestValley;
                secondPeakScore = x;
            }
        }
    
        if (firstPeak > secondPeak) {
            bestValley = firstPeak;
            firstPeak = secondPeak;
            secondPeak = bestValley;
        }
    
        if (secondPeak - firstPeak <= numBuckets / 16) {
            throw new Error("NotFoundException");
        } else {
            bestValley = secondPeak - 1;
            bestValleyScore = -1;
    
            for(x = secondPeak - 1; x > firstPeak; --x) {
                const fromFirst: number = x - firstPeak;
                const score: number = fromFirst * fromFirst * (secondPeak - x) * (maxBucketCount - buckets[x]);
                if (score > bestValleyScore) {
                    bestValley = x;
                    bestValleyScore = score;
                }
            }
    
            return bestValley << 3;
        }
    }
}