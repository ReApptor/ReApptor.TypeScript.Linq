// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("concat", () => {
    
    test("empty-empty", () => {
        const input: number[] = [];
        const result: number[] = input.concat([]);
        expect(result).toEqual([]);
    });
    
});
