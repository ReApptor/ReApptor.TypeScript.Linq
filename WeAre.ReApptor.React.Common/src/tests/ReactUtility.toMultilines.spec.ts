import {ReactElement} from "react";
import ReactUtility from "../ReactUtility";

describe("toMultiLines", function() {

    test("emptyString", function () {
        const input: string = "";
        const output: (ReactElement | string)[] = ReactUtility.toMultiLines(input);
        expect(output).toEqual([]);
    });

    test("nullString", function () {
        const input: any = null;
        const output: (ReactElement | string)[] = ReactUtility.toMultiLines(input);
        expect(output).toEqual([]);
    });

    test("undefinedString", function () {
        const input: any = undefined;
        const output: (ReactElement | string)[] = ReactUtility.toMultiLines(input);
        expect(output).toEqual([]);
    });

    test("object", function () {
        const input: any = {};
        const output: (ReactElement | string)[] = ReactUtility.toMultiLines(input);
        expect(output).toEqual([]);
    });

    test("whitespaceString", function () {
        const input: string = " ";
        const output: (ReactElement | string)[] = ReactUtility.toMultiLines(input);
        expect(output.length).toEqual(1);
        expect(output[0]).toEqual(input);
    });

    test("whitespaceBr", function () {
        const input: string = " <br/> ";
        const output: (ReactElement | string)[] = ReactUtility.toMultiLines(input);
        expect(output.length).toEqual(3);
        expect(output[0]).toEqual(" ");
        expect((output[1] as ReactElement).type).toEqual("br");
        expect(output[2]).toEqual(" ");
    });

    test("textAndBr", function () {
        const input: string = "Simple text <br/>";
        const output: (ReactElement | string)[] = ReactUtility.toMultiLines(input);
        expect(output.length).toEqual(2);
        expect("Simple text ").toEqual(output[0]);
        expect((output[1] as ReactElement).type).toEqual("br");
    });

    test("brAndText", function () {
        const input: string = "<br/> Simple text";
        const output: (ReactElement | string)[] = ReactUtility.toMultiLines(input);
        expect(output.length).toEqual(2);
        expect((output[0] as ReactElement).type).toEqual("br");
        expect(" Simple text").toEqual(output[1]);
    });
    
    test("multiLines", function () {
        const input: string = "Prefix\nsecond line\r\nline 3<br/>postfix\n";
        const output: (ReactElement | string)[] = ReactUtility.toMultiLines(input);
        expect(output.length).toEqual(8);
        expect(output[0]).toEqual("Prefix");
        expect((output[1] as ReactElement).type).toEqual("br");
        expect(output[2]).toEqual("second line");
        expect((output[3] as ReactElement).type).toEqual("br");
        expect(output[4]).toEqual("line 3");
        expect((output[5] as ReactElement).type).toEqual("br");
        expect(output[6]).toEqual("postfix");
        expect((output[7] as ReactElement).type).toEqual("br");
    });
    
    test("multiLinesWithTags", function () {
        const input: string = "<small>Small</small>Prefix\nM<b>second line</b>\r\nline 3<br/>post<mark>fix</mark>\n";
        const output: (ReactElement | string)[] = ReactUtility.toMultiLines(input);
        expect(output.length).toEqual(11);
        expect((output[0] as ReactElement).type).toEqual("small");
        expect((output[0] as ReactElement).props.children).toEqual("Small");
        expect(output[1]).toEqual("Prefix");
        expect((output[2] as ReactElement).type).toEqual("br");
        expect(output[3]).toEqual("M");
        expect((output[4] as ReactElement).type).toEqual("b");
        expect((output[4] as ReactElement).props.children).toEqual("second line");
        expect((output[5] as ReactElement).type).toEqual("br");
        expect(output[6]).toEqual("line 3");
        expect((output[7] as ReactElement).type).toEqual("br");
        expect(output[8]).toEqual("post");
        expect((output[9] as ReactElement).type).toEqual("mark");
        expect((output[9] as ReactElement).props.children).toEqual("fix");
        expect((output[10] as ReactElement).type).toEqual("br");
    });
});