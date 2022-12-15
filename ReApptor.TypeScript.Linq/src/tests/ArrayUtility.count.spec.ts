import {ArrayExtensions} from "../index";

ArrayExtensions();

describe("count", function() {
    test("count0-from0", function () {
        const result: number = [].count();
        expect(result).toEqual(0);
    });
    
    test("count1-from1", function () {
        const result: number = [245].count();
        expect(result).toEqual(1);
    });
    
    test("count3-from5-where-greater5", function () {
        const result: number = [1, 2, 7, 8, 9].count(item => item > 5);
        expect(result).toEqual(3);
    });
});
