import "@reapptor/ts-linq";

describe("any", () => {
    
    test("any-false-from0", () => {
        const result: boolean = [].any();
        expect(result).toEqual(false);
    });
    
    test("any-true-from1", () => {
        const result: boolean = [23].any();
        expect(result).toEqual(true);
    });
    
    test("any-false-from1-by-index2", () => {
        const result: boolean = [23].any((item: number, index: number) => index == 2);
        expect(result).toEqual(false);
    });
    
    test("any-true-from3-by-index2", () => {
        const result: boolean = [23, 26, 1].any((item: number, index: number) => index == 2);
        expect(result).toEqual(true);
    });
    
    test("any-false-item-is-25", () => {
        const result: boolean = [23, 26, 1].any((item: number) => item == 25);
        expect(result).toEqual(false);
    });
    
    test("any-true-item-is-26", () => {
        const result: boolean = [23, 26, 1].any((item: number) => item == 25);
        expect(result).toEqual(false);
    });
    
});
