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

    test("convertWithText", function () {
        const input: string = " Simple text ";
        const output: (ReactElement | string)[] = ReactUtility.toMarksSmallsAndBolds(input);

        expect(output.length).toEqual(1);
        
        expect((output[0] as string)).toEqual(" Simple text ");
    });
    
    test("convertWithMarkAndSmallAndBoldAndText", function () {
        const input: string = "<mark>address</mark> Simple text <small>Small text</small> <b>Bold Text</b>";
        const output: (ReactElement | string)[] = ReactUtility.toMarksSmallsAndBolds(input);

        expect(output.length).toEqual(5);
        
        expect((output[0] as ReactElement).type).toEqual("mark");
        expect((output[0] as ReactElement).props.children).toEqual("address");
        
        expect((output[1] as string)).toEqual(" Simple text ");
        
        expect((output[2] as ReactElement).type).toEqual("small");
        expect((output[2] as ReactElement).props.children).toEqual("Small text");
        
        expect((output[3] as string)).toEqual(" ");
        
        expect((output[4] as ReactElement).type).toEqual("b");
        expect((output[4] as ReactElement).props.children).toEqual("Bold Text");
    });
    
    //FAILED:
    // test("markInMark", function () {
    //     const input: string = "<mark><mark>test</mark>><mark>";
    //     const output: (ReactElement | string)[] = ReactUtility.toMarks(input);
    //     expect(output.length).toEqual(1);
    //     expect(output[0]).toEqual(input);
    // });
});