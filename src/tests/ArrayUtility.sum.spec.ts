// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

// The sum method takes an array of items and a callback function that returns a numeric value for each item.
// The method returns the sum of all the numeric values returned by the callback for each item in the array.
describe("sum", () => {

    // Test case checks if the 'sum' method returns the correct sum of the items based on the specified callback.
    // It uses an array of objects with 'name' and 'age' properties and specifies the 'age' property as the callback.
    // The expected result is the sum of the 'age' properties of the objects in the array.
    test("should return the sum of the items based on the specified callback", () => {
        const items: {name: string, age: number}[] = [
            { name: "Laura", age: 30 },
            { name: "Philip", age: 25 },
            { name: "Liam", age: 35 },
            { name: "Oliver", age: 40 },
        ];
        const result: number = items.sum((item) => item.age);
        expect(result).toEqual(130);
    });

    // Test case checks if the 'sum' method returns 0 when the input array is empty.
    // It passes an empty array and a callback that returns each item unchanged.
    test("should return 0 if the input array is empty", () => {
        const items: number[] = [];
        const result: number = items.sum((item) => item);
        expect(result).toEqual(0);
    });

    // Test case checks if the 'sum' method correctly skips 'null' and 'undefined' items when calculating the sum.
    // It passes an array of numbers that includes 'null' and 'undefined' values, and a callback that returns each item unchanged.
    // The expected result is the sum of the non-null and non-undefined values in the array.
    test("should skip null and undefined items when calculating the sum", () => {
        const items: (number | null | undefined)[] = [1, 2, null, undefined, 3];
        const result: number = items.sum((item) => item);
        expect(result).toEqual(6);
    });

});