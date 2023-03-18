// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("last", () => {

    test("last-number", () => {
        const result: number = [0].last();
        expect(result).toEqual(0);
    });
    
});
