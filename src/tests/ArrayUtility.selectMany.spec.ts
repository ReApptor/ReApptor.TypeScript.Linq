// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("selectMany", () => {

    test("empty", () => {
        const result: number[] = [].selectMany(item => [item]);
        expect(result).toEqual([]);
    });
    
});
