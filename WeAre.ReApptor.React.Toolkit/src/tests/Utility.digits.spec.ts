import Utility from "../Utility";

describe("digits", function() {
    
    test("<1", function () {
        const x = 0.1;
        
        const y = Utility.digits(x);
        
        expect(y).toEqual(1);
    });
    
    test("0", function () {
        const x = 0;
        
        const y = Utility.digits(x);
        
        expect(y).toEqual(1);
    });
    
    test("exact2", function () {
        const x = 10;
        
        const y = Utility.digits(x);
        
        expect(y).toEqual(2);
    });
    
    test("around2", function () {
        const x = 14.23232;
        
        const y = Utility.digits(x);
        
        expect(y).toEqual(2);
    });
    
});