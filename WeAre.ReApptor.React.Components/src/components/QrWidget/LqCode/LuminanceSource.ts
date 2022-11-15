import InvertedLuminanceSource from "./InvertedLuminanceSource";


export default abstract class LuminanceSource {

    private readonly width: number;
    private readonly height: number;

    protected constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public abstract getRow(var1: number, var2: number[]): number[];

    public abstract getMatrix(): number[];

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public isCropSupported(): boolean {
        return false;
    }

    public crop(left: number, top: number, width: number, height: number): LuminanceSource {
        throw new Error("This luminance source does not support cropping.");
    }

    public isRotateSupported(): boolean {
        return false;
    }

    public invert(): LuminanceSource {
        return new InvertedLuminanceSource(this);
    }

    public rotateCounterClockwise(): LuminanceSource {
        throw new Error("This luminance source does not support rotation by 90 degrees.");
    }

    public rotateCounterClockwise45(): LuminanceSource {
        throw new Error("This luminance source does not support rotation by 45 degrees.");
    }

    public toString(): string {
        let row: number[] = [this.width];
        let result: string = "";

        for (let y: number = 0; y < this.height; ++y) {
            row = this.getRow(y, row);

            for (let x: number = 0; x < this.width; ++x) {
                const luminance: number = row[x] & 255;
                let c: string;

                if (luminance < 64) {
                    c = '#';
                } else if (luminance < 128) {
                    c = '+';
                } else if (luminance < 192) {
                    c = '.';
                } else {
                    c = ' ';
                }

                result += c;
            }

            result += '\n';
        }

        return result;
    }
}