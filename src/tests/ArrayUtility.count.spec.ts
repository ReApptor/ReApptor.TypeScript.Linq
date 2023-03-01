import "@reapptor/ts-linq";

describe("count", () => {

    test("count0-from0", () => {
        const result: number = [].count();
        expect(result).toEqual(0);
    });
    
    test("count1-from1", () => {
        const result: number = [245].count();
        expect(result).toEqual(1);
    });
    
    test("count3-from5-where-greater5", () => {
        const result: number = [1, 2, 7, 8, 9].count(item => item > 5);
        expect(result).toEqual(3);
    });
    
});
