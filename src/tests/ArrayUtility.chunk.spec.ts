// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("chunk", () => {
    
    test("chunk-size1-from0", () => {
        const result: number[][] = [].chunk(1);
        expect(result).toEqual([]);
    });

    test("chunk-size3-from9", () => {
        const result: number[][] = [1, 2, 3, 4, 5, 6, 7, 8, 9].chunk(3);
        expect(result.length).toEqual(3);
        expect(result[0].length).toEqual(3);
        expect(result[1].length).toEqual(3);
        expect(result[2].length).toEqual(3);
    });

    test("chunk-size2-from3", () => {
        const result: number[][] = [1, 2, 3].chunk(2);
        expect(result.length).toEqual(2);
        expect(result[0].length).toEqual(2);
        expect(result[1].length).toEqual(1);
    });

    test("chunk-size-1-from0", () => {
        try {
            [1, 2].chunk(-1);
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe("Size \"-1\" out of range, must be at least 1 or greater.");
        }
    });
    
});
