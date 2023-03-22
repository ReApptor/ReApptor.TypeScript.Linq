// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("select", () => {

    test("empty", () => {
        const result: number[] = [].select(item => item);
        expect(result).toEqual([]);
    });

    test("single", () => {
        const input: number[] = [1];
        const result: number[] = input.select(item => item + 1);
        expect(result).toEqual([2]);
    });

    test("single-index", () => {
        const input: number[] = [1];
        const result: number[] = input.select((item, index) => index);
        expect(result).toEqual([0]);
    });

    test("many", () => {
        const input: number[] = [1, 7 ,2];
        const result: number[] = input.select(item => item + 1);
        expect(result).toEqual([2, 8, 3]);
    });

    test("many-index", () => {
        const input: number[] = [1, 7 ,2];
        const result: number[] = input.select((item, index) => index);
        expect(result).toEqual([0, 1, 2]);
    });
    
});
