import "@reapptor/ts-linq";

describe("min", () => {

    // Test ensures that the method returns the correct minimum value based on the specified callback function.
    test("should return the minimum value based on the specified callback", () => {
        const items: {name: string, age: number}[] = [
            { name: "David", age: 30 },
            { name: "Jack", age: 25 },
            { name: "Robin", age: 35 },
            { name: "John", age: 40 },
        ];

        const result: {name: string, age: number} = items
            .min((item) => item.age);

        expect(result).toEqual({ name: "Jack", age: 25 });
    });

    // Test ensures that the method returns the correct minimum value if no callback is specified.
    test("should return the minimum value if no callback is specified", () => {
        const items: number[] = [3, 6, 2, 8, 1];
        const result: number = items.min(null);
        expect(result).toEqual(1);
    });

    // Test ensures that the method throws an error if the input array is empty.
    test("should throw an error if the input array is empty", () => {
        const items: number[] = [];
        expect(() => items.min(null)).toThrow();
    });

});