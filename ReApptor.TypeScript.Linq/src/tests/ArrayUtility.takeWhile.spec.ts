import {Linq} from "../index";

Linq.init();

describe("takeWhile", function() {
    
    test("take-true-from0", function () {
        const result: number[] = [].takeWhile(() => true);
        expect(result).toEqual([]);
    });
    
    test("take-false-from0", function () {
        const result: number[] = [].takeWhile(() => true);
        expect(result).toEqual([]);
    });

    test("take-1-from-2", function () {
        const result: number[] = [1, 2].takeWhile((item: number) => item != 2);
        expect(result).toEqual([1]);
    });

    test("take-1-from-2-by-index", function () {
        const result: number[] = [1, 2].takeWhile((item: number, index: number) => index < 1);
        expect(result).toEqual([1]);
    });
    
    test("take-2-from-3", function () {
        const result: number[] = [1, 2, 3].takeWhile((item: number) => item >= 2);
        expect(result).toEqual([]);
    });
    
    test("take-2-from-2", function () {
        const result: number[] = [1, 2].takeWhile((item: number) => item >= 1);
        expect(result).toEqual([1, 2]);
    });
    
});
