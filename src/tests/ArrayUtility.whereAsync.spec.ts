// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("whereAsync", () => {

    // Test checks if the method returns an array of items that satisfy the condition in the callback.
    test("should return an array of items that satisfy the condition in the callback", async () => {
        const items: {name: string, age: number}[] = [
            { name: "David", age: 30 },
            { name: "Jack", age: 25 },
            { name: "Michael", age: 35 },
            { name: "Olivia", age: 40 },
        ];

        const result: {name: string, age: number}[] = await items.whereAsync(async (item) => item.age > 30);

        expect(result).toEqual([
            { name: "Michael", age: 35 },
            { name: "Olivia", age: 40 },
        ]);
    });

    // Test checks if the method returns an empty array if no items satisfy the condition in the callback.
    test("should return an empty array if no items satisfy the condition in the callback", async () => {
        const items: number[] = [1, 2, 3, 4, 5];
        const result: number[] = await items.whereAsync(async (item) => item > 5);

        expect(result).toEqual([]);
    });

    // Test checks if the method returns an empty array if the input array is empty.
    test("should return an empty array if the input array is empty", async () => {
        const items: number[] = [];
        const result: number[] = await items.whereAsync(async (item) => item > 5);

        expect(result).toEqual([]);
    });

    // Test checks if the method handles async callbacks that throw an error.
    test("should handle async callbacks that throw an error", async () => {
        const items: number[] = [1, 2, 3, 4, 5];

        await expect(items.whereAsync(async (item) => {
            if (item === 3) {
                throw new Error("error");
            }
            return true;
        })).rejects.toThrow("error");
    });

});