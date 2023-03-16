// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("toDictionary", () => {
    
    test("empty", () => {
        const result: Map<any, any> = [].toDictionary();
        expect(result.size).toEqual(0);
    });
    
});
