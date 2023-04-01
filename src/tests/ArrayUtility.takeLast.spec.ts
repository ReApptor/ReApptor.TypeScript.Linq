// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("takeLast", () => {
    
    test("0from0", () => {
        const result: number[] = [].takeLast(0);
        expect(result).toEqual([]);
    });
    
    test("-1from0", () => {
        const result: number[] = [].takeLast(-1);
        expect(result).toEqual([]);
    });
    
    test("1from0", () => {
        const result: number[] = [].takeLast(1);
        expect(result).toEqual([]);
    });

    test("-1from2", () => {
        const result: number[] = [1, 2].takeLast(-1);
        expect(result).toEqual([]);
    });
    
    test("0from2", () => {
        const result: number[] = [1, 2].takeLast(0);
        expect(result).toEqual([]);
    });
    
    test("1from2", () => {
        const result: number[] = [1, 2].takeLast(1);
        expect(result).toEqual([2]);
    });
    
    test("2from4", () => {
        const result: number[] = [1, 2, 3].takeLast(2);
        expect(result).toEqual([2, 3]);
    });
    
    test("2from2", () => {
        const result: number[] = [1, 2].takeLast(2);
        expect(result).toEqual([1, 2]);
    });

    test("3from2", () => {
        const result: number[] = [1, 2].takeLast(3);
        expect(result).toEqual([1, 2]);
    });
    
});
