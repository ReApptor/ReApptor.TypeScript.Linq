// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("skip", () => {
    
    test("skip0from0", () => {
        const result: number[] = [].skip(0);
        expect(result).toEqual([]);
    });
    
    test("skip-1from0", () => {
        const result: number[] = [].skip(-1);
        expect(result).toEqual([]);
    });

    test("skip-1from2", () => {
        const result: number[] = [1, 2].skip(-1);
        expect(result).toEqual([1, 2]);
    });
    
    test("skip0from2", () => {
        const result: number[] = [1, 2].skip(0);
        expect(result).toEqual([1, 2]);
    });
    
    test("skip1from2", () => {
        const result: number[] = [1, 2].skip(1);
        expect(result).toEqual([2]);
    });
    
    test("skip2from2", () => {
        const result: number[] = [1, 2].skip(2);
        expect(result).toEqual([]);
    });

    test("skip3from2", () => {
        const result: number[] = [1, 2].skip(3);
        expect(result).toEqual([]);
    });
    
});
