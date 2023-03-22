// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("single", () => {

    test("single-number", () => {
        const result: number | null = [0].single();
        expect(result).toEqual(0);
    });

    test("single-number-predicate", () => {
        const input: number[] = [0];
        const result: number | null = input.single(item => item == 0);
        expect(result).toEqual(0);
    });

    test("number-predicate-default", () => {
        const input: number[] = [0];
        const result: number | null = input.single(item => item == 1, 100);
        expect(result).toEqual(100);
    });

    test("number-error-1", () => {
        const input: number[] = [1, 2];
        try {
            input.single();
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe(`The input sequence contains more than one element.`);
        }
    });

    test("number-error-2", () => {
        const input: number[] = [];
        try {
            input.single();
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe(`The source sequence is empty.`);
        }
    });

    test("number-predicate-error-1", () => {
        const input: number[] = [0, 0];
        try {
            input.single(item => item == 0);
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe(`The input sequence contains more than one element.`);
        }
    });

    test("number-predicate-not-found", () => {
        const input: number[] = [0];
        try {
            input.single(item => item == 1);
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe(`No item found matching the specified predicate.`);
        }
    });
    
});
