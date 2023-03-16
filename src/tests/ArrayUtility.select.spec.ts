// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("select", () => {

    test("empty", () => {
        const result: number[] = [].select(item => item);
        expect(result).toEqual([]);
    });
    
});
