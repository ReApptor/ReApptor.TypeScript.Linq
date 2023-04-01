// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("skipLast", () => {
    
    test("0from0", () => {
        const result: number[] = [].skipLast(0);
        expect(result).toEqual([]);
    });
    
    test("-1from0", () => {
        const result: number[] = [].skipLast(-1);
        expect(result).toEqual([]);
    });
    
    test("1from0", () => {
        const result: number[] = [].skipLast(1);
        expect(result).toEqual([]);
    });

    test("-1from2", () => {
        const result: number[] = [1, 2].skipLast(-1);
        expect(result).toEqual([1, 2]);
    });
    
    test("0from2", () => {
        const result: number[] = [1, 2].skipLast(0);
        expect(result).toEqual([1, 2]);
    });
    
    test("1from2", () => {
        const result: number[] = [1, 2].skipLast(1);
        expect(result).toEqual([1]);
    });
    
    test("2from4", () => {
        const result: number[] = [1, 2, 3].skipLast(2);
        expect(result).toEqual([1]);
    });
    
    test("2from2", () => {
        const result: number[] = [1, 2].skipLast(2);
        expect(result).toEqual([]);
    });

    test("3from2", () => {
        const result: number[] = [1, 2].skipLast(3);
        expect(result).toEqual([]);
    });
    
});
