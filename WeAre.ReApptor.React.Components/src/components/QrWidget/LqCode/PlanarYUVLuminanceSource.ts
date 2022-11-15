import LuminanceSource from "./LuminanceSource";
import LqCodeSystem from "./LqCodeSystem";


export default class PlanarYUVLuminanceSource extends LuminanceSource {

    //private static readonly THUMBNAIL_SCALE_FACTOR: number = 2;
    private readonly yuvData: number[];
    private readonly dataWidth: number;
    private readonly dataHeight: number;
    private readonly left: number;
    private readonly top: number;

    constructor(yuvData: number[], dataWidth: number, dataHeight: number, left: number, top: number, width: number, height: number, reverseHorizontal: boolean) {
        super(width, height);

        if (left + width <= dataWidth && top + height <= dataHeight) {
            this.yuvData = yuvData;
            this.dataWidth = dataWidth;
            this.dataHeight = dataHeight;
            this.left = left;
            this.top = top;
            if (reverseHorizontal) {
                this.reverseHorizontal(width, height);
            }

        } else {
            throw new Error("Crop rectangle does not fit within image data.");
        }
    }

    public getRow(y: number, row: number[]): number[] {
        if (y >= 0 && y < this.getHeight()) {
            const width: number = this.getWidth();
            if (row == null || row.length < width) {
                row = [width];
            }

            const offset: number = (y + this.top) * this.dataWidth + this.left;
            LqCodeSystem.arraycopy(this.yuvData, offset, row, 0, width);

            return row;
        } else {
            throw new Error("Requested row is outside the image: " + y);
        }
    }

    public getMatrix(): number[] {
        const width: number = this.getWidth();
        const height: number = this.getHeight();
        if (width == this.dataWidth && height == this.dataHeight) {
            return this.yuvData;
        } else {
            const area: number = width * height;
            const matrix: number[] = [area];
            let inputOffset: number = this.top * this.dataWidth + this.left;
            if (width == this.dataWidth) {
                LqCodeSystem.arraycopy(this.yuvData, inputOffset, matrix, 0, area);
                return matrix;
            } else {
                const yuv: number[] = this.yuvData;

                for (let y: number = 0; y < height; ++y) {
                    let outputOffset: number = y * width;
                    LqCodeSystem.arraycopy(yuv, inputOffset, matrix, outputOffset, width);
                    inputOffset += this.dataWidth;
                }

                return matrix;
            }
        }
    }

    public isCropSupported(): boolean {
        return true;
    }

    public crop(left: number, top: number, width: number, height: number): LuminanceSource {
        return new PlanarYUVLuminanceSource(this.yuvData, this.dataWidth, this.dataHeight, this.left + left, this.top + top, width, height, false);
    }

    public renderThumbnail(): number[] {
        const width: number = this.getWidth() / 2;
        const height: number = this.getHeight() / 2;
        const pixels: number[] = [width * height];
        const yuv: number[] = this.yuvData;
        let inputOffset: number = this.top * this.dataWidth + this.left;

        for (let y: number = 0; y < height; ++y) {
            const outputOffset: number = y * width;

            for (let x = 0; x < width; ++x) {
                const grey: number = yuv[inputOffset + x * 2] & 255;
                pixels[outputOffset + x] = -16777216 | grey * 65793;
            }

            inputOffset += this.dataWidth * 2;
        }

        return pixels;
    }

    public getThumbnailWidth(): number {
        return this.getWidth() / 2;
    }

    public getThumbnailHeight(): number {
        return this.getHeight() / 2;
    }

    private reverseHorizontal(width: number, height: number): void {
        const yuvData: number[] = this.yuvData;
        let y: number = 0;

        for (let rowStart: number = this.top * this.dataWidth + this.left; y < height; rowStart += this.dataWidth) {
            const middle: number = rowStart + width / 2;
            let x1: number = rowStart;

            for (let x2: number = rowStart + width - 1; x1 < middle; --x2) {
                const temp: number = yuvData[x1];
                yuvData[x1] = yuvData[x2];
                yuvData[x2] = temp;
                ++x1;
            }

            ++y;
        }
    }
}