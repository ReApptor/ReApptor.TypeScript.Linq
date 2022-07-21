import Utility from "../Utility";

describe("getHashCode", function() {
    
    test("object", function () {
        const x1 = { a: 0, b: "1" };
        const x2 = { b: "1", a: 0 };
        
        const x1HashCode = Utility.getHashCode(x1);
        const x2HashCode = Utility.getHashCode(x2);
        
        expect(x1HashCode).not.toEqual(0);
        expect(x2HashCode).not.toEqual(0);
        expect(x2HashCode).toBe(x1HashCode);
    });
    
    test("recursive-object", function () {
        const x1 = { a: 0, b: "1" };
        const x2 = { b: "1", a: 0 };

        (x1 as any).ref = x2;
        (x2 as any).ref = x1;
        
        const x1HashCode = Utility.getHashCode(x1);
        const x2HashCode = Utility.getHashCode(x2);
        
        expect(x1HashCode).not.toEqual(0);
        expect(x2HashCode).not.toEqual(0);
        expect(x2HashCode).toBe(x1HashCode);
    });
    
});