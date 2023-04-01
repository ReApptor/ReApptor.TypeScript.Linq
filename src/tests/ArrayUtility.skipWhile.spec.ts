// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("skipWhile", () => {

    test("true-from0", () => {
        const result: number[] = [].skipWhile(() => true);
        expect(result).toEqual([]);
    });

    test("false-from0", () => {
        const result: number[] = [].skipWhile(() => false);
        expect(result).toEqual([]);
    });

    test("0-from-2", () => {
        const result: number[] = [1, 2].skipWhile((item: number) => item < 1);
        expect(result).toEqual([1, 2]);
    });

    test("1-from-2", () => {
        const result: number[] = [1, 2].skipWhile((item: number) => item == 1);
        expect(result).toEqual([2]);
    });

    test("2-from-2", () => {
        const result: number[] = [1, 2].skipWhile((item: number) => item <= 2);
        expect(result).toEqual([]);
    });

    test("1-from-3-by-index", () => {
        const result: number[] = [1, 2, 3].skipWhile((item: number, index: number) => index < 1);
        expect(result).toEqual([2, 3]);
    });

    test("2-from-3", () => {
        const result: number[] = [1, 2, 3].skipWhile((item: number) => item <= 2);
        expect(result).toEqual([3]);
    });

});