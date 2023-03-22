// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("first", () => {

    test("number", () => {
        const result: number = [0].first();
        expect(result).toEqual(0);
    });

    test("number-predicate", () => {
        const input: number[] = [0, 0];
        const result: number | null = input.first(item => item == 0);
        expect(result).toEqual(0);
    });

    test("number-predicate-default", () => {
        const input: number[] = [0];
        const result: number | null = input.first(item => item == 1, 100);
        expect(result).toEqual(100);
    });

    test("empty-default", () => {
        const input: number[] = [];
        const result: number | null = input.first(item => item == 1, 100);
        expect(result).toEqual(100);
    });

    test("empty-error", () => {
        const input: number[] = [];
        try {
            input.first();
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe(`The source sequence is empty.`);
        }
    });

    test("number-predicate-not-found", () => {
        const input: number[] = [0];
        try {
            input.first(item => item == 1);
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe(`No item found matching the specified predicate.`);
        }
    });
    
});
