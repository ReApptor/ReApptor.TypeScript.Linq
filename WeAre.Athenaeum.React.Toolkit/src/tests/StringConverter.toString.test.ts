import BaseTransformProvider, {TFormat} from "../providers/BaseTransformProvider";
import Utility from "../Utility";
import StringConverter, {IStringConverter, ToString, TStringConverter} from "../providers/StringConverter";

describe("StringConverter", function() {
    
    function itemToString(item: TestClassWithInterface | TestClassWithFunctionConverter | null, format?: TFormat | null): string {
        return "TestClass:" + (item ? item.value : "NULL") + format;
    }

    class TestClassTransformer implements IStringConverter {
        public toString(item: TestClassWithInterface | null, format?: TFormat | null): string {
            return itemToString(item, format);
        }
    }

    @ToString(TestClassWithFunctionConverter.toString)
    // @ts-ignore
    class TestClassWithFunctionConverter {
        public value: string = "";

        constructor(value: string | null = null) {
            this.value = value || "VALUE-1";
        }

        public static toString(item: TestClassWithFunctionConverter | null): string {
            return itemToString(item);
        }
    }
    
    @ToString(new TestClassTransformer())
    // @ts-ignore
    class TestClassWithInterface {
        public value: string = "";

        constructor(value: string | null = null) {
            this.value = value || "VALUE-2";
        }
    }
    
    class MyTransformProvider extends BaseTransformProvider {
        public constructor() {
            super();
        }
    }

    test("TypeConverter.null", function () {
        const result: string = StringConverter.toString(null);

        expect(result).toBe("");
    });

    test("TypeConverter.function", function () {
        const testClass = new TestClassWithFunctionConverter();
        const expected: string = itemToString(testClass);
        const result: string = StringConverter.toString(testClass);
        
        expect(result).toBe(expected);
    });

    test("TypeConverter.interface", function () {
        const testClass = new TestClassWithInterface();
        const expected: string = itemToString(testClass);
        const result: string = StringConverter.toString(testClass);

        expect(result).toBe(expected);
    });

    test("TransformProvider.null", function () {
        const transformProvider = new MyTransformProvider();
        const result: string = transformProvider.toString(null);

        expect(result).toBe("");
    });

    test("TransformProvider.function", function () {
        const testClass = new TestClassWithFunctionConverter();
        const expected: string = itemToString(testClass);
        const transformProvider = new MyTransformProvider();
        const result: string = transformProvider.toString(testClass);

        expect(result).toBe(expected);
    });

    test("TransformProvider.interface", function () {
        const testClass = new TestClassWithInterface();
        const expected: string = itemToString(testClass);
        const transformProvider = new MyTransformProvider();
        const result: string = transformProvider.toString(testClass);

        expect(result).toBe(expected);
    });

    test("Utility.Format.null", function () {
        const result: string = Utility.format("{0}", null);

        expect(result).toBe("");
    });

    test("Utility.Format.function", function () {
        const testClass = new TestClassWithFunctionConverter();
        const expected: string = itemToString(testClass);
        const result: string = Utility.format("{0}", testClass);

        expect(result).toBe(expected);
    });

    test("Utility.Format.interface", function () {
        const testClass = new TestClassWithInterface();
        const expected: string = itemToString(testClass);
        const result: string = Utility.format("{0}", testClass);

        expect(result).toBe(expected);
    });

    test("getService", function () {
        const converter: IStringConverter | TStringConverter | null = StringConverter.getConverter(TestClassWithInterface.name);
        
        expect(converter).not.toBeNull();

        const testClass = new TestClassWithInterface();
        const expected: string = itemToString(testClass);
        const result: string = (typeof converter === "function") ? converter(testClass) : converter!.toString(testClass);
        
        expect(result).toBe(expected);
    });
});