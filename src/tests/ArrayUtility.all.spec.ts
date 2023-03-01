import "@reapptor/ts-linq";

describe("all", () => {

    test("all-true-from0", () => {
        const result: boolean = [].all(item => item > 9);
        expect(result).toEqual(true);
    });
    
    test("all-true-greater-9", () => {
        const result: boolean = [10, 11, 12].all(item => item > 9);
        expect(result).toEqual(true);
    });
    
    test("all-false-smaller-9", () => {
        const result: boolean = [10, 1, 12].all(item => item < 9);
        expect(result).toEqual(false);
    });
    
});
