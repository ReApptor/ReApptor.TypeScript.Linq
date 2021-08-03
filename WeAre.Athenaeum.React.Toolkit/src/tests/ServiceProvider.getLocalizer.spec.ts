import {BaseLocalizer, ILocalizer, ServiceProvider} from "../index";

describe("getLocalizer", function() {
    
    class Localizer extends BaseLocalizer {
        constructor() {
            super([], "en");
        }
    }
    
    test("noLocalizer", function () {
        const result: ILocalizer | null = ServiceProvider.findLocalizer();
        expect(result).toBeNull();
    });
    
    test("findLocalizer", function () {
        const localizer = new Localizer();
        const result: ILocalizer | null = ServiceProvider.findLocalizer();
        expect(result).toBe(localizer);
    });
    
});
