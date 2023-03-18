// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("firstOrDefault", () => {

    test("first-empty", () => {
        const result: number | null = [].firstOrDefault();
        expect(result).toEqual(null);
    });
    
});
