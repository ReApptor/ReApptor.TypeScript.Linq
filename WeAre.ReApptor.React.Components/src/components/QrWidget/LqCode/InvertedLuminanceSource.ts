import LuminanceSource from "./LuminanceSource";


export default class InvertedLuminanceSource extends LuminanceSource {
    private readonly delegate: LuminanceSource;

    public constructor(delegate: LuminanceSource) {
        super(delegate.getWidth(), delegate.getHeight());
        this.delegate = delegate;
    }

    public getRow(y: number, row: number[]): number[] {
        row = this.delegate.getRow(y, row);
        const width: number = this.getWidth();

        for (let i: number = 0; i < width; ++i) {
            //row[i] = (byte)(255 - (row[i] & 255));
            row[i] = (255 - (row[i] & 255));
        }

        return row;
    }

    public getMatrix(): number[] {
        const matrix: number[] = this.delegate.getMatrix();
        const length: number = this.getWidth() * this.getHeight();
        const invertedMatrix: number[] = [length];

        for (let i: number = 0; i < length; ++i) {
            //invertedMatrix[i] = (byte)(255 - (matrix[i] & 255));
            invertedMatrix[i] = (255 - (matrix[i] & 255));
        }

        return invertedMatrix;
    }

    public isCropSupported(): boolean {
        return this.delegate.isCropSupported();
    }

    public crop(left: number, top: number, width: number, height: number): LuminanceSource {
        return new InvertedLuminanceSource(this.delegate.crop(left, top, width, height));
    }

    public isRotateSupported(): boolean {
        return this.delegate.isRotateSupported();
    }

    public invert(): LuminanceSource {
        return this.delegate;
    }

    public rotateCounterClockwise(): LuminanceSource {
        return new InvertedLuminanceSource(this.delegate.rotateCounterClockwise());
    }

    public rotateCounterClockwise45(): LuminanceSource {
        return new InvertedLuminanceSource(this.delegate.rotateCounterClockwise45());
    }
}