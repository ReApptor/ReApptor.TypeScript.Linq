// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("take", () => {
    
    test("take0from0", () => {
        const result: number[] = [].take(0);
        expect(result).toEqual([]);
    });
    
    test("take-1from0", () => {
        const result: number[] = [].take(-1);
        expect(result).toEqual([]);
    });
    
    test("take1from0", () => {
        const result: number[] = [].take(1);
        expect(result).toEqual([]);
    });

    test("take-1from2", () => {
        const result: number[] = [1, 2].take(-1);
        expect(result).toEqual([]);
    });
    
    test("take0from2", () => {
        const result: number[] = [1, 2].take(0);
        expect(result).toEqual([]);
    });
    
    test("take1from2", () => {
        const result: number[] = [1, 2].take(1);
        expect(result).toEqual([1]);
    });
    
    test("take2from2", () => {
        const result: number[] = [1, 2].take(2);
        expect(result).toEqual([1, 2]);
    });

    test("take3from2", () => {
        const result: number[] = [1, 2].take(3);
        expect(result).toEqual([1, 2]);
    });
    
});
