// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("split", () => {
    
    test("split-count1-from0", () => {
        const result: number[][] = [].split(1);
        expect(result).toEqual([]);
    });

    test("split-count3-from9", () => {
        const result: number[][] = [1, 2, 3, 4, 5, 6, 7, 8, 9].split(3);
        expect(result.length).toEqual(3);
        expect(result[0].length).toEqual(3);
        expect(result[1].length).toEqual(3);
        expect(result[2].length).toEqual(3);
    });

    test("split-count3-from10", () => {
        const result: number[][] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].split(3);
        expect(result.length).toEqual(3);
        expect(result[0].length).toEqual(4);
        expect(result[1].length).toEqual(4);
        expect(result[2].length).toEqual(2);
    });

    test("split-count2-from3", () => {
        const result: number[][] = [1, 2, 3].split(2);
        expect(result.length).toEqual(2);
        expect(result[0].length).toEqual(2);
        expect(result[1].length).toEqual(1);
    });

    test("split-count3-from2", () => {
        const result: number[][] = [1, 2].split(3);
        expect(result.length).toEqual(2);
        expect(result[0].length).toEqual(1);
        expect(result[1].length).toEqual(1);
    });
    
});
