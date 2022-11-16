import MathUtils from "./MathUtils";

export default class ResultPoint {
    private readonly x: number;
    private readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    public getX(): number {
        return this.x;
    }
    
    public getY(): number {
        return this.y;
    }
    
    // public final boolean equals(Object other) {
    //     if (!(other instanceof ResultPoint)) {
    //         return false;
    //     } else {
    //         ResultPoint otherPoint = (ResultPoint)other;
    //         return this.x == otherPoint.x && this.y == otherPoint.y;
    //     }
    // }
    //
    // public final int hashCode() {
    //     return 31 * Float.floatToIntBits(this.x) + Float.floatToIntBits(this.y);
    // }
    //
    // public final String toString() {
    //     StringBuilder result = new StringBuilder(25);
    //     result.append('(');
    //     result.append(this.x);
    //     result.append(',');
    //     result.append(this.y);
    //     result.append(')');
    //     return result.toString();
    // }
    
    public static orderBestPatterns(patterns: ResultPoint[]): void {
        const zeroOneDistance: number = ResultPoint.distance(patterns[0], patterns[1]);
        const oneTwoDistance: number = ResultPoint.distance(patterns[1], patterns[2]);
        const zeroTwoDistance: number = ResultPoint.distance(patterns[0], patterns[2]);
        let pointA: ResultPoint;
        let pointB: ResultPoint;
        let pointC: ResultPoint;
        if (oneTwoDistance >= zeroOneDistance && oneTwoDistance >= zeroTwoDistance) {
            pointB = patterns[0];
            pointA = patterns[1];
            pointC = patterns[2];
        } else if (zeroTwoDistance >= oneTwoDistance && zeroTwoDistance >= zeroOneDistance) {
            pointB = patterns[1];
            pointA = patterns[0];
            pointC = patterns[2];
        } else {
            pointB = patterns[2];
            pointA = patterns[0];
            pointC = patterns[1];
        }
    
        if (ResultPoint.crossProductZ(pointA, pointB, pointC) < 0.0) {
            const temp: ResultPoint = pointA;
            pointA = pointC;
            pointC = temp;
        }
    
        patterns[0] = pointA;
        patterns[1] = pointB;
        patterns[2] = pointC;
    }
    
    public static distance(pattern1: ResultPoint, pattern2: ResultPoint): number {
        return MathUtils.distance(pattern1.x, pattern1.y, pattern2.x, pattern2.y);
    }
    
    private static crossProductZ(pointA: ResultPoint, pointB: ResultPoint, pointC: ResultPoint): number {
        const bX: number = pointB.x;
        const bY: number = pointB.y;
        return (pointC.x - bX) * (pointA.y - bY) - (pointC.y - bY) * (pointA.x - bX);
    }
}