// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("toHashSet", () => {
    
    test("empty", () => {
        const result: Set<any> = [].toHashSet();
        expect(result.size).toEqual(0);
    });
    
    test("single", () => {
        const result: Set<number> = [1].toHashSet();
        expect(result.size).toEqual(1);
    });
    
    test("2-unique", () => {
        const result: Set<number> = [1, 2].toHashSet();
        expect(result.size).toEqual(2);
    });
    
    test("2-unique-key-selector", () => {
        const result: Set<string> = [1, 2].toHashSet(item => item.toString());
        expect(result.size).toEqual(2);
        expect(result.has("1")).toEqual(true);
        expect(result.has("2")).toEqual(true);
    });
    
    test("2-unique-from-3-selector", () => {
        const result: Set<any> = [1, 2, 2].toHashSet(item => item.toString());
        expect(result.size).toEqual(2);
        expect(result.has("1")).toEqual(true);
        expect(result.has("2")).toEqual(true);
    });
    
});
