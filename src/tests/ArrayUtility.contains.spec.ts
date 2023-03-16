// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("contains", () => {
    
    test("empty", () => {
        const input: number[] = [];
        const result: boolean = input.contains(0);
        expect(result).toEqual(false);
    });
    
});
