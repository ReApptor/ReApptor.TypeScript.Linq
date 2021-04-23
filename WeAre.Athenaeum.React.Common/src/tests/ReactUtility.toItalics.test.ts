import {ReactElement} from "react";
import ReactUtility from "../ReactUtility";

describe("toItalics", function() {

    test("emptyString", function () {
        const input: string = "";
        const output: (ReactElement | string)[] = ReactUtility.toItalics(input);
        expect(output).toEqual([]);
    });

    test("nullString", function () {
        const input: any = null;
        const output: (ReactElement | string)[] = ReactUtility.toItalics(input);
        expect(output).toEqual([]);
    });

    test("undefinedString", function () {
        const input: any = undefined;
        const output: (ReactElement | string)[] = ReactUtility.toItalics(input);
        expect(output).toEqual([]);
    });

    test("object", function () {
        const input: any = {};
        const output: (ReactElement | string)[] = ReactUtility.toItalics(input);
        expect(output).toEqual([]);
    });

    test("whitespaceString", function () {
        const input: string = " ";
        const output: (ReactElement | string)[] = ReactUtility.toItalics(input);
        expect(output.length).toEqual(1);
        expect(output[0]).toEqual(input);
    });

    test("whitespaceItalic", function () {
        const input: string = " <i>text</i> ";
        const output: (ReactElement | string)[] = ReactUtility.toItalics(input);
        expect(output.length).toEqual(3);
        expect(output[0]).toEqual(" ");
        expect((output[1] as ReactElement).type).toEqual("i");
        expect((output[1] as ReactElement).props.children).toEqual("text");
        expect(output[2]).toEqual(" ");
    });

    test("textAndItalic", function () {
        const input: string = "Simple text <i>text</i>";
        const output: (ReactElement | string)[] = ReactUtility.toItalics(input);
        expect(output.length).toEqual(2);
        expect("Simple text ").toEqual(output[0]);
        expect((output[1] as ReactElement).type).toEqual("i");
        expect((output[1] as ReactElement).props.children).toEqual("text");
    });

    test("italicAndText", function () {
        const input: string = "<i>text</i> Simple text";
        const output: (ReactElement | string)[] = ReactUtility.toItalics(input);
        expect(output.length).toEqual(2);
        expect((output[0] as ReactElement).type).toEqual("i");
        expect((output[0] as ReactElement).props.children).toEqual("text");
        expect(" Simple text").toEqual(output[1]);
    });
    
    test("italicOnly", function () {
        const input: string = "<i>text</i>";
        const output: (ReactElement | string)[] = ReactUtility.toItalics(input);
        expect(output.length).toEqual(1);
        expect((output[0] as ReactElement).type).toEqual("i");
        expect((output[0] as ReactElement).props.children).toEqual("text");
    });
    
    test("emptyItalic", function () {
        const input: string = "<i></i>";
        const output: (ReactElement | string)[] = ReactUtility.toItalics(input);
        expect(output.length).toEqual(1);
        expect((output[0] as ReactElement).type).toEqual("i");
        expect((output[0] as ReactElement).props.children).toEqual("");
    });
    
    test("closedItalic", function () {
        const input: string = "<i />";
        const output: (ReactElement | string)[] = ReactUtility.toItalics(input);
        expect(output.length).toEqual(1);
        expect(output[0]).toEqual(input);
    });
});