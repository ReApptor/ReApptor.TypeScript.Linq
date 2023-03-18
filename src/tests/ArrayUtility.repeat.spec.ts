// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("repeat", () => {

    test("repeat-1-3", () => {
        const input: number[] = [];
        const result: number[] = input.repeat(1, 3);
        expect(result).toEqual([1, 1, 1]);
    });
    
});
