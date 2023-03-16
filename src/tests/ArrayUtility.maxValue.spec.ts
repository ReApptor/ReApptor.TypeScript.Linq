// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("maxValue", () => {

    // Test case checks that the 'maxValue' method returns the maximum value of the array.
    // The test data is an array of numbers.
    test("should return the maximum value", () => {
        const items: number[] = [3, 6, 2, 8, 1];
        const result: number = items.maxValue(item => item);
        expect(result).toEqual(8);
    });

    // Test checks that 'maxValue' returns the maximum value based on the specified callback.
    // It uses an array of objects containing 'name' and 'age' properties and a callback that returns the 'age' property of each object.
    // It then expects the result to be 40, which is the maximum age in the array.
    test("should return the maximum value based on the specified callback", () => {
        const items: {name: string, age: number}[] = [
            { name: "David", age: 30 },
            { name: "Jack", age: 25 },
            { name: "Robin", age: 35 },
            { name: "John", age: 40 },
        ];

        const result: number = items.maxValue((item) => item.age);
        expect(result).toEqual(40);
    });

    // Test checks that 'maxValue' throws an error if the input array is empty.
    // It uses an empty array and expects an error to be thrown when 'maxValue' is called with a callback.
    test("should throw an error if the input array is empty", () => {
        const items: number[] = [];
        expect(() => items.maxValue((item) => item)).toThrow();
    });

});