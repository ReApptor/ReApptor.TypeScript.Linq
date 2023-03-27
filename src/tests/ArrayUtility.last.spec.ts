// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("last", () => {

    test("number", () => {
        const result: number = [0, 1, 2, 3].last();
        expect(result).toEqual(3);
    });

    test("number-single", () => {
        const result: number = [0].last();
        expect(result).toEqual(0);
    });

    test("number-predicate", () => {
        const input: number[] = [0, 0];
        const result: number | null = input.last(item => item == 0);
        expect(result).toEqual(0);
    });

    test("number-predicate-default", () => {
        const input: number[] = [0];
        const result: number | null = input.last(item => item == 1, 100);
        expect(result).toEqual(100);
    });

    test("empty-default", () => {
        const input: number[] = [];
        const result: number | null = input.last(item => item == 1, 100);
        expect(result).toEqual(100);
    });

    test("empty-error", () => {
        const input: number[] = [];
        try {
            input.last();
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe(`The source sequence is empty.`);
        }
    });

    test("number-predicate-not-found", () => {
        const input: number[] = [0];
        try {
            input.last(item => item == 1);
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe(`No item found matching the specified predicate.`);
        }
    });
    
});
