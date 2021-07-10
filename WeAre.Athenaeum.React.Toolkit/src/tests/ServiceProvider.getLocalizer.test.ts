import BaseLocalizer, {ILocalizer} from "../localization/BaseLocalizer";
import ServiceProvider from "../providers/ServiceProvider";

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