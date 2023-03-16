// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("singleOrDefault", () => {

    test("empty", () => {
        const result: any | null = [].singleOrDefault();
        expect(result).toEqual(null);
    });

    test("predicate-empty", () => {
        const result: any | null = [].singleOrDefault(item => item);
        expect(result).toEqual(null);
    });
    
    test("number-empty-default", () => {
        const input: number[] = [];
        const result: number | null = input.singleOrDefault(null, 0);
        expect(result).toEqual(0);
    });
    
    test("predicate-number-empty-default", () => {
        const input: number[] = [];
        const result: number | null = input.singleOrDefault(item => item > 0, 0);
        expect(result).toEqual(0);
    });
    
    test("boolean-empty-default", () => {
        const input: boolean[] = [];
        const result: boolean | null = input.singleOrDefault(null, false);
        expect(result).toEqual(false);
    });
    
    test("predicate-boolean-empty-default", () => {
        const input: boolean[] = [];
        const result: boolean | null = input.singleOrDefault(item => item, false);
        expect(result).toEqual(false);
    });
    
    test("number-error", () => {
        try {
            [0, 0].singleOrDefault();
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe(`The input sequence contains more than one element.`);
        }
    });

    test("predicate-number-error", () => {
        try {
            [0, 0].singleOrDefault(item => item === 0);
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe(`The input sequence contains more than one element.`);
        }
    });
    
    test("boolean-error", () => {
        try {
            [false, false].singleOrDefault();
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe(`The input sequence contains more than one element.`);
        }
    });
    
    test("predicate-boolean-false", () => {
        const result: boolean | null = [false, false].singleOrDefault(item => item);
        expect(result).toEqual(null);
    });
    
    test("predicate-boolean-error", () => {
        try {
            [false, false].singleOrDefault(item => !item);
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe(`The input sequence contains more than one element.`);
        }
    });

    test("single-number", () => {
        const result: number | null = [0].singleOrDefault();
        expect(result).toEqual(0);
    });

    test("predicate-single-number", () => {
        const result: number | null = [0].singleOrDefault(item => item === 0);
        expect(result).toEqual(0);
    });

    test("single-boolean", () => {
        const result: boolean | null = [false].singleOrDefault();
        expect(result).toEqual(false);
    });

    test("predicate-single-false", () => {
        const result: boolean | null = [false].singleOrDefault(item => item);
        expect(result).toEqual(null);
    });

    test("predicate-single-true", () => {
        const result: boolean | null = [false].singleOrDefault(item => !item);
        expect(result).toEqual(false);
    });

    test("predicate-unique-collection", () => {
        const result: number | null = [1,2,3,4,5].singleOrDefault(item => item === 2);
        expect(result).toEqual(2);
    });
    
});
