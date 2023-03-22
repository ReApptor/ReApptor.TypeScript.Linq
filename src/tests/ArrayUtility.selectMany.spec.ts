// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("selectMany", () => {

    test("empty", () => {
        const result: number[] = [].selectMany(item => [item]);
        expect(result).toEqual([]);
    });

    test("single", () => {
        const input: number[][] = [[1]];
        const result: number[] = input.selectMany(item => item);
        expect(result).toEqual([1]);
    });

    test("many", () => {
        const input: number[][] = [[1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11, 12]];
        const result: number[] = input.selectMany(item => item);
        expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });
    
});
