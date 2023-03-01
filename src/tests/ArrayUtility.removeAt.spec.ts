import "@reapptor/ts-linq";

describe("removeAt", () => {

    // Test checks if the method removes the item at the specified index correctly.
    // It creates an array items and removes the item at index 2 using the removeAt method.
    // Then, it expects the items array to be equal to the expected result.
    test("should remove the item at the specified index", () => {
        const items: string[] = ["a", "b", "c", "d", "e"];
        items.removeAt(2);
        expect(items).toEqual(["a", "b", "d", "e"]);
    });

    // Test checks if the method throws an error if the index is out of range.
    // It creates an array items and tries to remove an item at an index that is less than 0 or greater than or equal to the length of the array using the removeAt method.
    // Then, it expects the method to throw an error.
    test("should throw an error if the index is out of range", () => {
        const items: string[] = ["a", "b", "c", "d", "e"];
        expect(() => items.removeAt(-1)).toThrow();
        expect(() => items.removeAt(5)).toThrow();
    });

    // Test checks if the method throws an error if the given array is empty.
    // It creates an empty array items and tries to remove an item at index 0 using the removeAt method.
    // Then, it expects the method to throw an error.
    test("should throw an error if the array is empty", () => {
        const items: string[] = [];
        expect(() => items.removeAt(0)).toThrow();
    });

});