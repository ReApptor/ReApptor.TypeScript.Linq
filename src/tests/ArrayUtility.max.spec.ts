// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("max", () => {

    // Test checks if the method returns the maximum value based on the specified callback,
    // which in this case is the 'age' property of each object in the array.
    test("should return the maximum value based on the specified callback", () => {
        const items: {name: string, age: number}[] = [
            { name: "Marry", age: 30 },
            { name: "Rob", age: 25 },
            { name: "Billy", age: 35 },
            { name: "Michael", age: 40 },
        ];
        const result: {name: string, age: number} = items.max((item) => item.age);
        expect(result).toEqual({ name: "Michael", age: 40 });
    });

    // Test checks if the method returns the maximum value of an array of numbers if no callback is specified.
    test("should return the maximum value if no callback is specified", () => {
        const items: number[] = [3, 6, 2, 8, 1];
        const result = items.max(null);
        expect(result).toEqual(8);
    });

    // Test checks if the method throws an error when the input array is empty.
    test("should throw an error if the input array is empty", () => {
        const items: number[] = [];
        expect(() => items.max(null)).toThrow();
    });

});