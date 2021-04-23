import {ReactElement} from "react";
import ReactUtility from "../ReactUtility";

describe("toTags", function() {

    test("emptyString", function () {
        const input: string = "";
        const output: (ReactElement | string)[] = ReactUtility.toTags(input);
        expect(output).toEqual([]);
    });

    test("nullString", function () {
        const input: any = null;
        const output: (ReactElement | string)[] = ReactUtility.toTags(input);
        expect(output).toEqual([]);
    });

    test("undefinedString", function () {
        const input: any = undefined;
        const output: (ReactElement | string)[] = ReactUtility.toTags(input);
        expect(output).toEqual([]);
    });

    test("object", function () {
        const input: any = {};
        const output: (ReactElement | string)[] = ReactUtility.toTags(input);
        expect(output).toEqual([]);
    });

    test("whitespaceString", function () {
        const input: string = " ";
        const output: (ReactElement | string)[] = ReactUtility.toTags(input);
        expect(output.length).toEqual(1);
        expect(output[0]).toEqual(input);
    });

    test("whitespaceBold", function () {
        const input: string = " <b>boldText</b> ";
        const output: (ReactElement | string)[] = ReactUtility.toTags(input);
        expect(output.length).toEqual(3);
        expect(output[0]).toEqual(" ");
        expect((output[1] as ReactElement).type).toEqual("b");
        expect((output[1] as ReactElement).props.children).toEqual("boldText");
        expect(output[2]).toEqual(" ");
    });

    test("whitespaceSmall", function () {
        const input: string = " <small>smallText</small> ";
        const output: (ReactElement | string)[] = ReactUtility.toTags(input);
        expect(output.length).toEqual(3);
        expect(output[0]).toEqual(" ");
        expect((output[1] as ReactElement).type).toEqual("small");
        expect((output[1] as ReactElement).props.children).toEqual("smallText");
        expect(output[2]).toEqual(" ");
    });
    
    test("convertWithMarkAndSmallAndBoldAndText", function () {
        const input: string = "<mark>address</mark> Simple text <small>Small text</small> <b>Bold Text</b>";
        const output: (ReactElement | string)[] = ReactUtility.toTags(input);

        expect(output.length).toEqual(5);
        
        expect((output[0] as ReactElement).type).toEqual("mark");
        expect((output[0] as ReactElement).props.children).toEqual("address");
        
        expect((output[1] as string)).toEqual(" Simple text ");
        
        expect((output[2] as ReactElement).type).toEqual("small");
        expect((output[2] as ReactElement).props.children).toEqual("Small text");
        
        expect((output[3] as string)).toEqual(" ");
        
        expect((output[4] as ReactElement).type).toEqual("b");
        expect((output[4] as ReactElement).props.children).toEqual("Bold Text");
        
        const keys: (string | number | null)[] = output.filter(item => (typeof item !== "string")).map(item => (item as ReactElement).key);
        expect(keys.length).toEqual(keys.distinct(key => key).length);
    });
    
});