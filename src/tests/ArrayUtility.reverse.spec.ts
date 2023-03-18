// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("reverse", () => {

    test("reverse-empty", () => {
        const input: number[] = [];
        const result: number[] = input.reverse();
        expect(result).toEqual([]);
    });

    test("reverse-single", () => {
        const input: number[] = [1];
        const result: number[] = input.reverse();
        expect(result).toEqual([1]);
    });

    test("reverse-3", () => {
        const input: number[] = [1, 2, 3];
        const result: number[] = input.reverse();
        expect(result).toEqual([3, 2, 1]);
    });
    
});
