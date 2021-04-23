import {ReactElement} from "react";
import ReactUtility from "../ReactUtility";

describe("toBolds", function() {

    test("emptyString", function () {
        const input: string = "";
        const output: (ReactElement | string)[] = ReactUtility.toBolds(input);
        expect(output).toEqual([]);
    });

    test("nullString", function () {
        const input: any = null;
        const output: (ReactElement | string)[] = ReactUtility.toBolds(input);
        expect(output).toEqual([]);
    });

    test("undefinedString", function () {
        const input: any = undefined;
        const output: (ReactElement | string)[] = ReactUtility.toBolds(input);
        expect(output).toEqual([]);
    });

    test("object", function () {
        const input: any = {};
        const output: (ReactElement | string)[] = ReactUtility.toBolds(input);
        expect(output).toEqual([]);
    });

    test("whitespaceString", function () {
        const input: string = " ";
        const output: (ReactElement | string)[] = ReactUtility.toBolds(input);
        expect(output.length).toEqual(1);
        expect(output[0]).toEqual(input);
    });

    test("whitespaceBold", function () {
        const input: string = " <b>boldText</b> ";
        const output: (ReactElement | string)[] = ReactUtility.toBolds(input);
        expect(output.length).toEqual(3);
        expect(output[0]).toEqual(" ");
        expect((output[1] as ReactElement).type).toEqual("b");
        expect((output[1] as ReactElement).props.children).toEqual("boldText");
        expect(output[2]).toEqual(" ");
    });

    test("textAndBold", function () {
        const input: string = "Simple text <b>boldText</b>";
        const output: (ReactElement | string)[] = ReactUtility.toBolds(input);
        expect(output.length).toEqual(2);
        expect("Simple text ").toEqual(output[0]);
        expect((output[1] as ReactElement).type).toEqual("b");
        expect((output[1] as ReactElement).props.children).toEqual("boldText");
    });

    test("boldAndText", function () {
        const input: string = "<b>boldText</b> Simple text";
        const output: (ReactElement | string)[] = ReactUtility.toBolds(input);
        expect(output.length).toEqual(2);
        expect((output[0] as ReactElement).type).toEqual("b");
        expect((output[0] as ReactElement).props.children).toEqual("boldText");
        expect(" Simple text").toEqual(output[1]);
    });
    
    test("boldOnly", function () {
        const input: string = "<b>boldText</b>";
        const output: (ReactElement | string)[] = ReactUtility.toBolds(input);
        expect(output.length).toEqual(1);
        expect((output[0] as ReactElement).type).toEqual("b");
        expect((output[0] as ReactElement).props.children).toEqual("boldText");
    });
    
    test("emptyBold", function () {
        const input: string = "<b></b>";
        const output: (ReactElement | string)[] = ReactUtility.toBolds(input);
        expect(output.length).toEqual(1);
        expect((output[0] as ReactElement).type).toEqual("b");
        expect((output[0] as ReactElement).props.children).toEqual("");
    });
    
    test("closedBold", function () {
        const input: string = "<b />";
        const output: (ReactElement | string)[] = ReactUtility.toBolds(input);
        expect(output.length).toEqual(1);
        expect(output[0]).toEqual(input);
    });
});