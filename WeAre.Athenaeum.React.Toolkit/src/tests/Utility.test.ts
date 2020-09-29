import Utility from "../Utility";

describe('roundTests', function() {
    test('roundUp', function () {
        const result: number = Utility.round(5.678, 2);
        expect(result).toBe(5.68);
    });
    test('roundDown', function () {
        const result: number = Utility.round(5.432, 2);
        expect(result).toBe(5.43);
    });
});