import {Utility} from "..";
import {Dictionary} from "typescript-collections";

describe("copyTo", function() {
    
    class IdentitySettings {
        public userCanRequestAccess: boolean = false;

        public frontPagePageUrl: string | null = null;

        public ssoLoginPageUrl: string | null = null;

        public userAttributeId: string | null = null;
    }
    
    class Request {
        public id: string | null = null;

        public name: string = "";

        public description: string | null = null;

        public settings: IdentitySettings = new IdentitySettings();
    }
    
    test("FromDictionaryWithCompositeKey", function () {
        
        const data = new Dictionary<string, any>();
        data.setValue("name", "value-name");
        data.setValue("description", "value-description");
        data.setValue("settings.frontPagePageUrl", "value-frontPagePageUrl");
        data.setValue("settings.ssoLoginPageUrl", "value-ssoLoginPageUrl");
        data.setValue("settings.userAttributeId", "value-userAttributeId");
        data.setValue("settings.userCanRequestAccess", true);
        
        const request = new Request();

        Utility.copyTo(data, request);

        expect(request.name).toBe("value-name");
        expect(request.description).toBe("value-description");
        expect(request.settings.frontPagePageUrl).toBe("value-frontPagePageUrl");
        expect(request.settings.ssoLoginPageUrl).toBe("value-ssoLoginPageUrl");
        expect(request.settings.userAttributeId).toBe("value-userAttributeId");
        expect(request.settings.userCanRequestAccess).toBe(true);
    });
    
    test("FromObjectWithCompositeKey", function () {
        
        const data = {
            name: "value-name",
            description: "value-description",
            settings: {
                frontPagePageUrl: "value-frontPagePageUrl",
                ssoLoginPageUrl: "value-ssoLoginPageUrl",
                userAttributeId: "value-userAttributeId",
                userCanRequestAccess: true,
            }
        }
        
        const request = new Request();

        Utility.copyTo(data, request);

        expect(request.name).toBe("value-name");
        expect(request.description).toBe("value-description");
        expect(request.settings.frontPagePageUrl).toBe("value-frontPagePageUrl");
        expect(request.settings.ssoLoginPageUrl).toBe("value-ssoLoginPageUrl");
        expect(request.settings.userAttributeId).toBe("value-userAttributeId");
        expect(request.settings.userCanRequestAccess).toBe(true);
    });
    
});