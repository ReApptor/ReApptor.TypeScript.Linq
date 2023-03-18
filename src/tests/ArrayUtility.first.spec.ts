// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("first", () => {

    test("first-number", () => {
        const result: number = [0].first();
        expect(result).toEqual(0);
    });
    
});
