import "@reapptor/ts-linq";

describe("where",  () => {

     // Test case verifies that the where method filters the items that satisfy the predicate.
     // It creates an array of numbers and passes a predicate that filters out odd numbers. The expected output is an array containing only even numbers.
    test("should filter the items that satisfy the predicate", () => {
        const items: number[] = [1, 2, 3, 4, 5];
        const result: number[] = items.where((item) => item % 2 === 0);
        expect(result).toEqual([2, 4]);
    });

    // Test case checks if the where method returns an empty array if no items satisfy the predicate.
    // It creates an array of odd numbers and passes a predicate that filters out even numbers. The expected output is an empty array since no items satisfy the predicate.
    test("should return an empty array if no items satisfy the predicate", () => {
        const items: number[] = [1, 3, 5, 7, 9];
        const result: number[] = items.where((item) => item % 2 === 0);
        expect(result).toEqual([]);
    });

    // Test case checks if the where method returns an empty array if the input array is empty.
    // It creates an empty array and passes a predicate that filters out even numbers. The expected output is an empty array.
    test("should return an empty array if the input array is empty", () => {
        const items: number[] = [];
        const result: number[] = items.where((item) => item % 2 === 0);
        expect(result).toEqual([]);
    });

});