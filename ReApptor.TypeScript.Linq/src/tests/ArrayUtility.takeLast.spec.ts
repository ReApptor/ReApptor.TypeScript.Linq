import {Linq} from "../index";

Linq.init();

describe("takeLast", function() {
    
    test("take0from0", function () {
        const result: number[] = [].takeLast(0);
        expect(result).toEqual([]);
    });
    
    test("take-1from0", function () {
        const result: number[] = [].takeLast(-1);
        expect(result).toEqual([]);
    });
    
    test("take1from0", function () {
        const result: number[] = [].takeLast(1);
        expect(result).toEqual([]);
    });

    test("take-1from2", function () {
        const result: number[] = [1, 2].takeLast(-1);
        expect(result).toEqual([]);
    });
    
    test("take0from2", function () {
        const result: number[] = [1, 2].takeLast(0);
        expect(result).toEqual([]);
    });
    
    test("take1from2", function () {
        const result: number[] = [1, 2].takeLast(1);
        expect(result).toEqual([2]);
    });
    
    test("take2from4", function () {
        const result: number[] = [1, 2, 3].takeLast(2);
        expect(result).toEqual([2, 3]);
    });
    
    test("take2from2", function () {
        const result: number[] = [1, 2].takeLast(2);
        expect(result).toEqual([1, 2]);
    });

    test("take3from2", function () {
        const result: number[] = [1, 2].takeLast(3);
        expect(result).toEqual([1, 2]);
    });
    
});
