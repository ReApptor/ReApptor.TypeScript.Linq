// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("remove", () => {

    // Test checks whether the method correctly removes a single occurrence of an item from the array.
    test("should remove the specified item from the array", () => {
        const items: number[] = [1, 2, 3, 4, 5];
        items.remove(3);
        expect(items).toEqual([1, 2, 4, 5]);
    });

    // Test checks whether the method removes only the first occurred specified item from the array.
    test("should remove only the first occured specified item from the array", () => {
        const items: number[] = [1, 2, 3, 4, 3, 5];
        items.remove(3);
        expect(items).toEqual([1, 2, 4, 3, 5]);
    });

    // Test checks whether the method removes all specified items from the array.
    test("should remove all specified items from the array", () => {
        const items: number[] = [1, 2, 3, 4, 5];
        items.remove([2, 4]);
        expect(items).toEqual([1, 3, 5]);
    });

    // Test checks whether the method removes nothing if the specified item is not in the array.
    test("should remove nothing if the specified item is not in the array", () => {
        const items: number[] = [1, 2, 3, 4, 5];
        items.remove(6);
        expect(items).toEqual([1, 2, 3, 4, 5]);
    });

    // Test checks whether the method removes nothing if the specified item is an empty array.
    test("should remove nothing from the array if the specified item is an empty array", () => {
        const items = [1, 2, 3, 4, 5];
        items.remove([]);
        expect(items).toEqual([1, 2, 3, 4, 5]);
    });

    // Test checks whether the method removes nothing from the array if the input array is empty.
    test("should remove nothing from the array if the input array is empty", () => {
        const items: number[] = [];
        items.remove(3);
        expect(items).toEqual([]);
    });

});