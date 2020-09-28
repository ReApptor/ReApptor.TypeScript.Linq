import Utility from "../Utility";

describe("Utility tests", () => {
    describe("round", () => {
        test("Should round the number up", () => {
            expect(Utility.round(1.3456, 2)).toBe(1.35);
            expect(Utility.round(1.35, 1)).toBe(1.4);
        });
        
        test("Should round the number down", () => {
            expect(Utility.round(1.3416, 2)).toBe(1.35);
            expect(Utility.round(1.31, 1)).toBe(1.4);
        });
    })
})