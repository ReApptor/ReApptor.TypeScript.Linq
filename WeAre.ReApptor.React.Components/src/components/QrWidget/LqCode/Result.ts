import {Dictionary} from "typescript-collections";
import System from "./System";
import {BarcodeFormat, ResultMetadataType} from "./Types";
import ResultPoint from "./ResultPoint";

export default class Result {
    private readonly text: string;
    private readonly rawBytes: number[];
    private resultPoints: ResultPoint[] | null;
    private readonly format: BarcodeFormat;
    private resultMetadata: Dictionary<ResultMetadataType, object> | null;
    private readonly timestamp: number;

    // constructor(String text, byte[] rawBytes, ResultPoint[] resultPoints, BarcodeFormat format) {
    //     this(text, rawBytes, resultPoints, format, System.currentTimeMillis());
    // }

    constructor(text: string, rawBytes: number[], resultPoints: ResultPoint[], format: BarcodeFormat, timestamp?: number) {
        this.text = text;
        this.rawBytes = rawBytes;
        this.resultPoints = resultPoints;
        this.format = format;
        this.resultMetadata = null;
        this.timestamp = System.currentTimeMillis();
    }
    
    public getText(): string {
        return this.text;
    }
    
    public getRawBytes(): number[] {
        return this.rawBytes;
    }
    
    public getResultPoints(): ResultPoint[] | null {
        return this.resultPoints;
    }
    
    public getBarcodeFormat(): BarcodeFormat {
        return this.format;
    }
    
    public getResultMetadata(): Dictionary<ResultMetadataType, object> | null {
        return this.resultMetadata;
    }
    
    public putMetadata(type: ResultMetadataType, value: object): void {
        if (this.resultMetadata == null) {
            this.resultMetadata = new Dictionary<ResultMetadataType, object>();
        }
    
        this.resultMetadata.setValue(type, value);
    }
    
    public putAllMetadata(metadata: Dictionary<ResultMetadataType, object>): void {
        if (metadata != null) {
            if (this.resultMetadata == null) {
                this.resultMetadata = metadata;
            } else {
                //this.resultMetadata.putAll(metadata);
                const keys: ResultMetadataType[] = metadata.keys();
                for (let i: number = 0; i < keys.length; i++) {
                    const value: object = metadata.getValue(keys[i])!;
                    this.resultMetadata.setValue(keys[i], value);
                }
            }
        }
    }
    
    public addResultPoints(newPoints: ResultPoint[]): void {
        const oldPoints: ResultPoint[] | null = this.resultPoints;
        if (oldPoints == null) {
            this.resultPoints = newPoints;
        } else if (newPoints != null && newPoints.length > 0) {
            const allPoints: ResultPoint[] = new Array(oldPoints.length + newPoints.length);
            System.arraycopy(oldPoints, 0, allPoints, 0, oldPoints.length);
            System.arraycopy(newPoints, 0, allPoints, oldPoints.length, newPoints.length);
            this.resultPoints = allPoints;
        }
    }
    
    public getTimestamp(): number {
        return this.timestamp;
    }
    
    public toString(): string {
        return this.text;
    }
}