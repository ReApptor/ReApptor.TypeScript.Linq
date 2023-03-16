// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("single", () => {

    test("single-number", () => {
        const result: number | null = [0].single();
        expect(result).toEqual(0);
    });
    
});
