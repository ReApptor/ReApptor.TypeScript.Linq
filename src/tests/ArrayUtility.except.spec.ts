// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("except", () => {
    
    test("three-except-one", () => {
        const result: number[] = [1, 2, 3].except([2]);
        expect(result).toEqual([1, 3]);
    });
    
    test("three-except-one-comparer", () => {
        const result: number[] = [1, 2, 3].except([2], (x: number, y: number) => x === y);
        expect(result).toEqual([1, 3]);
    });
    
    test("three-except-zero", () => {
        const result: number[] = [1, 2, 3].except([]);
        expect(result).toEqual([1, 2, 3]);
    });
    
    test("three-except-zero-comparer", () => {
        const result: number[] = [1, 2, 3].except([], (x: number, y: number) => x === y);
        expect(result).toEqual([1, 2, 3]);
    });
    
    test("zero-except-one", () => {
        const input: number[] = [];
        const result: number[] = input.except([2]);
        expect(result).toEqual([]);
    });
    
    test("zero-except-one-comparer", () => {
        const input: number[] = [];
        const result: number[] = input.except([2], (x: number, y: number) => x === y);
        expect(result).toEqual([]);
    });
    
    test("zero-except-zero", () => {
        const input: number[] = [];
        const result: number[] = input.except([]);
        expect(result).toEqual([]);
    });
    
    test("zero-except-zero-comparer", () => {
        const input: number[] = [];
        const result: number[] = input.except([], (x: number, y: number) => x === y);
        expect(result).toEqual([]);
    });

    test("three-except-three", () => {
        const result: number[] = [1, 2, 3].except([1, 2, 3]);
        expect(result).toEqual([]);
    });

    test("three-except-three-comparer", () => {
        const result: number[] = [1, 2, 3].except([1, 2, 3], (x: number, y: number) => x === y);
        expect(result).toEqual([]);
    });

    test("three-except", () => {
        const result: number[] = [1, 2, 3].except([5]);
        expect(result).toEqual([1, 2, 3]);
    });

    test("three-except-comparer", () => {
        const result: number[] = [1, 2, 3].except([5], (x: number, y: number) => x === y);
        expect(result).toEqual([1, 2, 3]);
    });
    
});
