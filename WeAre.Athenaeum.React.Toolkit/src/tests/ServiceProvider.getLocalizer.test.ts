import {BaseLocalizer, ILocalizer, ServiceProvider, TypeResolver} from "..";

describe("getLocalizer", function() {
    
    class Localizer extends BaseLocalizer {
        constructor() {
            super([], "en");
        }
    }
    
    test("noLocalizer", function () {
        const result: ILocalizer | null = ServiceProvider.getLocalizer();
        expect(result).toBeNull();
    });
    
    test("getLocalizer", function () {
        const localizer = new Localizer();
        const result: ILocalizer | null = ServiceProvider.getLocalizer();
        expect(result).toBe(localizer);
    });
    
});