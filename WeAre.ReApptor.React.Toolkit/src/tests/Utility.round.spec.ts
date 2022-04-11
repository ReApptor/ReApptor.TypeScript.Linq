import Utility from "../Utility";

describe("round", function() {
    
    test("10", function () {
        const x = 999999999;
        
        const y = Utility.round(x, 10);
        
        expect(y).toEqual(999999999);
    });
    
    test("10", function () {
        const x = 99999999;
        
        const y = Utility.round(x, 10);
        
        expect(y).toEqual(99999999);
    });
    
    test("2", function () {
        const x = 999999.99;
        
        const y = Utility.round(x, 2);
        
        expect(y).toEqual(999999.99);
    });
    
    test("4trunc", function () {
        const x = 999999.9944;
        
        const y = Utility.round(x, 2);
        
        expect(y).toEqual(999999.99);
    });
    
    test("4round", function () {
        const x = 999999.9999;
        
        const y = Utility.round(x, 2);
        
        expect(y).toEqual(1000000.00);
    });
    
});