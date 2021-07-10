import {Utility} from "..";

describe("format", function() {    
    
    test("number", function () {
        const input: number = 4.0;
        const result = Utility.format("{0}", input);
        const formatValueResult = Utility.formatValue(input);
        const formatValueEmptyFormatResult = Utility.formatValue(input, "");
        expect(result).toEqual(input.toString());
        expect(formatValueResult).toEqual(input.toString());
        expect(formatValueEmptyFormatResult).toEqual(input.toString());
    });
    
    test("number.any", function () {
        const input: any = 4.0;
        const result = Utility.format("{0}", input);
        const formatValueResult = Utility.formatValue(input);
        const formatValueEmptyFormatResult = Utility.formatValue(input, "");
        expect(result).toEqual(input.toString());
        expect(formatValueResult).toEqual(input.toString());
        expect(formatValueEmptyFormatResult).toEqual(input.toString());
    });
    
    test("number.object", function () {
        const input: object = 4.0 as any as object;
        const result = Utility.format("{0}", input);
        const formatValueResult = Utility.formatValue(input);
        const formatValueEmptyFormatResult = Utility.formatValue(input, "");
        expect(result).toEqual(input.toString());
        expect(formatValueResult).toEqual(input.toString());
        expect(formatValueEmptyFormatResult).toEqual(input.toString());
    });
    
    test("string", function () {
        const input: string = "4.0";
        const result = Utility.format("{0}", input);
        const formatValueResult = Utility.formatValue(input);
        const formatValueEmptyFormatResult = Utility.formatValue(input, "");
        expect(result).toEqual(input);
        expect(formatValueResult).toEqual(input);
        expect(formatValueEmptyFormatResult).toEqual(input.toString());
    });
    
    test("string.any", function () {
        const input: any = "4.0";
        const result = Utility.format("{0}", input);
        const formatValueResult = Utility.formatValue(input);
        const formatValueEmptyFormatResult = Utility.formatValue(input, "");
        expect(result).toEqual(input);
        expect(formatValueResult).toEqual(input);
        expect(formatValueEmptyFormatResult).toEqual(input.toString());
    });
    
    test("string.object", function () {
        const input: object = "4.0" as any as object;
        const result = Utility.format("{0}", input);
        const formatValueResult = Utility.formatValue(input);
        const formatValueEmptyFormatResult = Utility.formatValue(input, "");
        expect(result).toEqual(input);
        expect(formatValueResult).toEqual(input);
        expect(formatValueEmptyFormatResult).toEqual(input.toString());
    });
    
});