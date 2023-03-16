// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("minValue", () => {

    // Test case checks that the 'minValue' method returns the minimum value of the array.
    // The test data is an array of numbers.
    test("should return the minimum value", () => {
        const items: number[] = [3, 6, 2, 8, 1];
        const result: number = items.minValue(item => item);
        expect(result).toEqual(1);
    });

    // Test case checks that the 'minValue' method returns the minimum value of the array based on the specified callback function.
    // The test data is an array of objects with 'name' and 'age' properties,
    // and the callback function extracts the 'age' property to find the minimum age.
    test("should return the minimum value based on the specified callback", () => {
        const items: {name: string, age: number}[] = [
            { name: "Robin", age: 30 },
            { name: "Sam", age: 25 },
            { name: "Arnold", age: 35 },
            { name: "Michael", age: 40 },
        ];

        const result: number = items.minValue((item) => item.age);
        expect(result).toEqual(25);
    });

    // Test case checks that the 'minValue' method throws an error if the input array is empty.
    test("should throw an error if the input array is empty", () => {
        const items: number[] = [];
        expect(() => items.minValue((item) => item)).toThrow();
    });

});