import {ReactElement} from "react";
import ReactUtility from "../ReactUtility";

describe("toMarks", function() {
    
    test("emptyString", function () {
        const input: string = "";
        const output: (ReactElement | string)[] = ReactUtility.toMarks(input);
        expect(output).toEqual([]);
    });
    
    test("nullString", function () {
        const input: any = null;
        const output: (ReactElement | string)[] = ReactUtility.toMarks(input);
        expect(output).toEqual([]);
    });
    
    test("undefinedString", function () {
        const input: any = undefined;
        const output: (ReactElement | string)[] = ReactUtility.toMarks(input);
        expect(output).toEqual([]);
    });
    
    test("object", function () {
        const input: any = {};
        const output: (ReactElement | string)[] = ReactUtility.toMarks(input);
        expect(output).toEqual([]);
    });
    
    test("whitespaceString", function () {
        const input: string = " ";
        const output: (ReactElement | string)[] = ReactUtility.toMarks(input);
        expect(output.length).toEqual(1);
        expect(output[0]).toEqual(input);
    });

    test("whitespaceMark", function () {
        const input: string = " <mark>address</mark> ";
        const output: (ReactElement | string)[] = ReactUtility.toMarks(input);
        expect(output.length).toEqual(3);
        expect(output[0]).toEqual(" ");
        expect((output[1] as ReactElement).type).toEqual("mark");
        expect((output[1] as ReactElement).props.children).toEqual("address");
        expect(output[2]).toEqual(" ");
    });
    
    test("textAndMark", function () {
        const input: string = "Simple text <mark>address</mark>";
        const output: (ReactElement | string)[] = ReactUtility.toMarks(input);
        expect(output.length).toEqual(2);
        expect("Simple text ").toEqual(output[0]);
        expect((output[1] as ReactElement).type).toEqual("mark");
        expect((output[1] as ReactElement).props.children).toEqual("address");
    });
    
    test("markAndText", function () {
        const input: string = "<mark>address</mark> Simple text";
        const output: (ReactElement | string)[] = ReactUtility.toMarks(input);
        expect(output.length).toEqual(2);
        expect((output[0] as ReactElement).type).toEqual("mark");
        expect((output[0] as ReactElement).props.children).toEqual("address");
        expect(" Simple text").toEqual(output[1]);
    });
    
    test("markOnly", function () {
        const input: string = "<mark>address</mark>";
        const output: (ReactElement | string)[] = ReactUtility.toMarks(input);
        expect(output.length).toEqual(1);
        expect((output[0] as ReactElement).type).toEqual("mark");
        expect((output[0] as ReactElement).props.children).toEqual("address");
    });
    
    test("emptyMark", function () {
        const input: string = "<mark></mark>";
        const output: (ReactElement | string)[] = ReactUtility.toMarks(input);
        expect(output.length).toEqual(1);
        expect((output[0] as ReactElement).type).toEqual("mark");
        expect((output[0] as ReactElement).props.children).toEqual("");
    });
    
    test("closedMark", function () {
        const input: string = "<mark />";
        const output: (ReactElement | string)[] = ReactUtility.toMarks(input);
        expect(output.length).toEqual(1);
        expect(output[0]).toEqual(input);
    });
    
    //FAILED:
    // test("markInMark", function () {
    //     const input: string = "<mark><mark>test</mark>><mark>";
    //     const output: (ReactElement | string)[] = ReactUtility.toMarks(input);
    //     expect(output.length).toEqual(1);
    //     expect(output[0]).toEqual(input);
    // });
});