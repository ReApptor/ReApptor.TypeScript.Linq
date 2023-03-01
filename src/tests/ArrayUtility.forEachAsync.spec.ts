import "@reapptor/ts-linq";

describe("forEachAsync", () => {

    // Test ensures that the callback function is called for each item in the array,
    // and that it’s called with the correct arguments.
    test("should call the callback function for each item in the array", async () => {
        const items: number[] = [1, 2, 3, 4];
        const callback: jest.Mock = jest.fn();

        await items.forEachAsync(callback);

        expect(callback).toHaveBeenCalledTimes(4);
        expect(callback).toHaveBeenCalledWith(1);
        expect(callback).toHaveBeenCalledWith(2);
        expect(callback).toHaveBeenCalledWith(3);
        expect(callback).toHaveBeenCalledWith(4);
    });

    // Test ensures that the function doesn’t throw an error when the input array is empty.
    test("should handle an empty input array", async () => {
        const items: number[] = [];
        const callback: jest.Mock = jest.fn();

        await items.forEachAsync(callback);

        expect(callback).not.toHaveBeenCalled();
    });

    // Test ensures that the callback function is called in the correct order,
    // based on the values in the input array.
    test("should call the callback function in order", async () => {
        const items: number[] = [1, 2, 3, 4];
        const results: number[] = [];

        await items.forEachAsync(async (item) => {
            await new Promise((resolve) => setTimeout(resolve, item));
            results.push(item);
        });

        expect(results).toEqual([1, 2, 3, 4]);
    });

    // Test ensures that the function throws an error if the callback function throws an error.
    test("should throw an error if the callback function throws an error", async () => {
        const items: number[] = [1, 2, 3, 4];
        const callback: jest.Mock= jest.fn().mockRejectedValueOnce(new Error("Test error"));

        await expect(items.forEachAsync(callback)).rejects.toThrow("Test error");
    });

});