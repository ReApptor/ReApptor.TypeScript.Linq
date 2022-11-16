

export default class MathUtils {

    public static round(d: number): number {
        return Math.trunc(d + (d < 0.0 ? -0.5 : 0.5));
    }
    
    public static distance(aX: number, aY: number, bX: number, bY: number): number {
        const xDiff: number = aX - bX;
        const yDiff: number = aY - bY;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }
}