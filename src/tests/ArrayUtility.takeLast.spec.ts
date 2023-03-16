// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("takeLast", () => {
    
    test("take0from0", () => {
        const result: number[] = [].takeLast(0);
        expect(result).toEqual([]);
    });
    
    test("take-1from0", () => {
        const result: number[] = [].takeLast(-1);
        expect(result).toEqual([]);
    });
    
    test("take1from0", () => {
        const result: number[] = [].takeLast(1);
        expect(result).toEqual([]);
    });

    test("take-1from2", () => {
        const result: number[] = [1, 2].takeLast(-1);
        expect(result).toEqual([]);
    });
    
    test("take0from2", () => {
        const result: number[] = [1, 2].takeLast(0);
        expect(result).toEqual([]);
    });
    
    test("take1from2", () => {
        const result: number[] = [1, 2].takeLast(1);
        expect(result).toEqual([2]);
    });
    
    test("take2from4", () => {
        const result: number[] = [1, 2, 3].takeLast(2);
        expect(result).toEqual([2, 3]);
    });
    
    test("take2from2", () => {
        const result: number[] = [1, 2].takeLast(2);
        expect(result).toEqual([1, 2]);
    });

    test("take3from2", () => {
        const result: number[] = [1, 2].takeLast(3);
        expect(result).toEqual([1, 2]);
    });
    
});
