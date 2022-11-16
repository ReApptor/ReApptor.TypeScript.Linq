

export default class DecoderResult {
    private readonly rawBytes: number[];
    private readonly text: string;
    private readonly byteSegments: number[];
    private readonly ecLevel: string;
    private errorsCorrected: number = 0;
    private erasures: number = 0;
    private other: object | null = null;
    private readonly structuredAppendParity: number;
    private readonly structuredAppendSequenceNumber: number;

    constructor(rawBytes: number[], text: string, byteSegments: number[], ecLevel: string, saSequence: number = -1, saParity: number = -1) {
        this.rawBytes = rawBytes;
        this.text = text;
        this.byteSegments = byteSegments;
        this.ecLevel = ecLevel;
        this.structuredAppendParity = saParity;
        this.structuredAppendSequenceNumber = saSequence;
    }

    public getRawBytes(): number[] {
        return this.rawBytes;
    }

    public getText(): string {
        return this.text;
    }

    public getByteSegments(): number[] {
        return this.byteSegments;
    }

    public getECLevel(): string {
        return this.ecLevel;
    }

    public getErrorsCorrected(): number {
        return this.errorsCorrected;
    }

    public setErrorsCorrected(errorsCorrected: number): void {
        this.errorsCorrected = errorsCorrected;
    }

    public getErasures(): number {
        return this.erasures;
    }

    public setErasures(erasures: number): void {
        this.erasures = erasures;
    }

    public getOther(): object | null {
        return this.other;
    }

    public setOther(other: object): void {
        this.other = other;
    }

    public hasStructuredAppend(): boolean {
        return this.structuredAppendParity >= 0 && this.structuredAppendSequenceNumber >= 0;
    }

    public getStructuredAppendParity(): number {
        return this.structuredAppendParity;
    }

    public getStructuredAppendSequenceNumber(): number {
        return this.structuredAppendSequenceNumber;
    }
}