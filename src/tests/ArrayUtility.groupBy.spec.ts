import "@reapptor/ts-linq";

// These tests cover different scenarios and ensure that the groupBy method works correctly in each case.
describe("groupBy", () => {

    // Test case is checking that the method should group the items by the specified property.
    // It creates an array of objects with the name and age properties and calls the groupBy method on it with the callback function that groups the objects by their age.
    // The expected result is an array with two sub-arrays, where each sub-array contains objects with the same age.
    test("should group the items by the specified property", () => {
        const items: {name: string, age: number}[] = [
            { name: "Sam", age: 30 },
            { name: "Jack", age: 25 },
            { name: "Richard", age: 30 },
            { name: "Helen", age: 25 },
        ];
        const result: {name: string, age: number}[][] = items.groupBy((item) => item.age);
        expect(result).toEqual([
            [{ name: "Sam", age: 30 }, { name: "Richard", age: 30 }],
            [{ name: "Jack", age: 25 }, { name: "Helen", age: 25 }],
        ]);
    });

    // Test case is checking that the method should group the items into a single group if the callback is not specified.
    // It creates an array of numbers and calls the groupBy method on it without specifying the callback function.
    // The expected result is an array with a single sub-array that contains all the numbers.
    test("should group the items into a single group if the callback is not specified", () => {
        const items: number[] = [1, 1, 2, 2, 2];
        const result: number[][] = items.groupBy();
        expect(result).toEqual([[1, 1], [2, 2, 2]]);
    });

    // Test case is checking that the method should group the items into a single group if the callback is not specified.
    // It creates an array of numbers and calls the groupBy method on it without specifying the callback function.
    // The expected result is an array with a single sub-array that contains all the numbers.
    test("should group the items into a single group if the callback is not specified", () => {
        const items: number[] = [1, 2, 3, 4, 5];
        const result: number[][] = items.groupBy(() => null);
        expect(result).toEqual([[1, 2, 3, 4, 5]]);
    });

    // Test case is checking that the method should return an empty array if the input array is empty.
    // It creates an empty array and calls the groupBy method on it with a callback function that groups the items based on whether they are even or odd.
    // The expected result is an empty array since there are no items to group.
    test("should return an empty array if the input array is empty", () => {
        const items: number[] = [];
        const result: number[][] = items.groupBy((item) => item % 2 === 0);
        expect(result).toEqual([]);
    });

});