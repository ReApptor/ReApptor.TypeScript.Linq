// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("distinct", () => {
    
    test("distinct9-from12", () => {
        const values: any[] = [1, 1, "red", 2, 3, 3, 4, "green", 5, 6, 10, "green"];
        const distinctValues = values.distinct();
        expect(distinctValues.length).toEqual(9);
    });
    
});
