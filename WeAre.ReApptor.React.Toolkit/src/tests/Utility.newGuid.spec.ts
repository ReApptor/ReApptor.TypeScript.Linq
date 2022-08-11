import Utility from "../Utility";

describe("newGuid", function() {

    const pattern = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

    function testFormat(guid: string): void {
        expect(guid.length).toEqual(36);
        expect(guid[8]).toEqual("-");
        expect(guid[13]).toEqual("-");
        expect(guid[18]).toEqual("-");
        expect(pattern.test(guid)).toBeTruthy();
    }
    
    test("format", function () {
        const guid: string = Utility.newGuid();
        testFormat(guid);
    });
    
    test("uniqueness", function () {
        const count = 1000;
        
        const items: string[] = [];
        for (let i = 0; i < count; i++) {
            const guid: string = Utility.newGuid();
            testFormat(guid);

            items[i] = guid;
        }
        
        expect(items.length).toEqual(count);
    });
    
});