// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("lastOrDefault", () => {

    test("last-empty", () => {
        const result: number | null = [].lastOrDefault();
        expect(result).toEqual(null);
    });
    
});
