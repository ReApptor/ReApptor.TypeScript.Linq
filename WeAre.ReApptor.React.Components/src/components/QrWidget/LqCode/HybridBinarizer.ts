import GlobalHistogramBinarizer from "./GlobalHistogramBinarizer";
import BitMatrix from "./BitMatrix";
import LuminanceSource from "./LuminanceSource";
import Binarizer from "./Binarizer";

export default class HybridBinarizer extends GlobalHistogramBinarizer {
    // private static readonly BLOCK_SIZE_POWER: number = 3;
    // private static readonly BLOCK_SIZE: number = 8;
    // private static readonly BLOCK_SIZE_MASK: number = 7;
    // private static readonly MINIMUM_DIMENSION: number = 40;
    // private static readonly MIN_DYNAMIC_RANGE: number = 24;
    private matrix: BitMatrix | null = null;

    constructor(source: LuminanceSource) {
        super(source);
    }

    public getBlackMatrix(): BitMatrix {
        if (this.matrix != null) {
            return this.matrix;
        } else {
            const source: LuminanceSource = this.getLuminanceSource();
            const width: number = source.getWidth();
            const height: number = source.getHeight();
            if (width >= 40 && height >= 40) {
                const luminances: number[] = source.getMatrix();
                let subWidth: number = width >> 3;
                if ((width & 7) != 0) {
                    ++subWidth;
                }

                let subHeight: number = height >> 3;
                if ((height & 7) != 0) {
                    ++subHeight;
                }

                const blackPoints: number[][] = HybridBinarizer.calculateBlackPoints(luminances, subWidth, subHeight, width, height);
                const newMatrix: BitMatrix = new BitMatrix(width, height);
                HybridBinarizer.calculateThresholdForBlock(luminances, subWidth, subHeight, width, height, blackPoints, newMatrix);
                this.matrix = newMatrix;
            } else {
                this.matrix = super.getBlackMatrix();
            }

            return this.matrix;
        }
    }

    public createBinarizer(source: LuminanceSource): Binarizer {
        return new HybridBinarizer(source);
    }

    private static calculateThresholdForBlock(luminances: number[], subWidth: number, subHeight: number, width: number, height: number, blackPoints: number[][], matrix: BitMatrix): void {
        for (let y: number = 0; y < subHeight; ++y) {
            let yoffset: number = y << 3;
            const maxYOffset: number = height - 8;
            if (yoffset > maxYOffset) {
                yoffset = maxYOffset;
            }

            for (let x: number = 0; x < subWidth; ++x) {
                let xoffset: number = x << 3;
                const maxXOffset: number = width - 8;
                if (xoffset > maxXOffset) {
                    xoffset = maxXOffset;
                }

                let left: number = HybridBinarizer.cap(x, 2, subWidth - 3);
                let top: number = HybridBinarizer.cap(y, 2, subHeight - 3);
                let sum: number = 0;

                let average: number;
                for (average = -2; average <= 2; ++average) {
                    const blackRow: number[] = blackPoints[top + average];
                    sum += blackRow[left - 2] + blackRow[left - 1] + blackRow[left] + blackRow[left + 1] + blackRow[left + 2];
                }

                average = sum / 25;
                HybridBinarizer.thresholdBlock(luminances, xoffset, yoffset, average, width, matrix);
            }
        }
    }

    private static cap(value: number, min: number, max: number): number {
        return value < min ? min : (value > max ? max : value);
    }

    private static thresholdBlock(luminances: number[], xoffset: number, yoffset: number, threshold: number, stride: number, matrix: BitMatrix): void {
        let y: number = 0;

        for (let offset: number = yoffset * stride + xoffset; y < 8; offset += stride) {
            for (let x: number = 0; x < 8; ++x) {
                if ((luminances[offset + x] & 255) <= threshold) {
                    matrix.set(xoffset + x, yoffset + y);
                }
            }

            ++y;
        }

    }

    private static createArray(d1: number, d2: number): number[][] {
        const items: number[][] = new Array(d1);
        for (let i: number = 0; i < d1; i++) {
            items[i] = new Array(d2);
        }
        return items;
    }

    private static calculateBlackPoints(luminances: number[], subWidth: number, subHeight: number, width: number, height: number): number[][] {
        const blackPoints: number[][] = HybridBinarizer.createArray(subHeight, subWidth);

        for (let y: number = 0; y < subHeight; ++y) {
            let yoffset: number = y << 3;
            const maxYOffset: number = height - 8;
            if (yoffset > maxYOffset) {
                yoffset = maxYOffset;
            }

            for (let x: number = 0; x < subWidth; ++x) {
                let xoffset: number = x << 3;
                const maxXOffset: number = width - 8;
                if (xoffset > maxXOffset) {
                    xoffset = maxXOffset;
                }

                let sum: number = 0;
                let min: number = 255;
                let max: number = 0;
                let yy: number = 0;

                let offset: number;
                for (offset = yoffset * width + xoffset; yy < 8; offset += width) {
                    let xx: number;
                    for (xx = 0; xx < 8; ++xx) {
                        const pixel: number = luminances[offset + xx] & 255;
                        sum += pixel;
                        if (pixel < min) {
                            min = pixel;
                        }

                        if (pixel > max) {
                            max = pixel;
                        }
                    }

                    if (max - min > 24) {
                        ++yy;

                        for (offset += width; yy < 8; offset += width) {
                            for (xx = 0; xx < 8; ++xx) {
                                sum += luminances[offset + xx] & 255;
                            }

                            ++yy;
                        }
                    }

                    ++yy;
                }

                yy = sum >> 6;
                if (max - min <= 24) {
                    yy = min / 2;
                    if (y > 0 && x > 0) {
                        offset = (blackPoints[y - 1][x] + 2 * blackPoints[y][x - 1] + blackPoints[y - 1][x - 1]) / 4;
                        if (min < offset) {
                            yy = offset;
                        }
                    }
                }

                blackPoints[y][x] = yy;
            }
        }

        return blackPoints;
    }
}