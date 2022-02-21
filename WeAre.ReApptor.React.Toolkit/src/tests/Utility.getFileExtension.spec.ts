import Utility from "../Utility";
import {TimeSpan} from "@weare/reapptor-toolkit";

describe("getFileExtension", function() {    
    
    test("getWoff2", function () {
        const input: string = "KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.woff2";
        const expected: string = ".woff2";
        const result: string = Utility.getFileExtension(input);
        expect(result).toEqual(expected);
    });
    
    test("noExtension", function () {
        const input: string = "KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ";
        const expected: string = "";
        const result: string = Utility.getFileExtension(input);
        expect(result).toEqual(expected);
    });
    
});