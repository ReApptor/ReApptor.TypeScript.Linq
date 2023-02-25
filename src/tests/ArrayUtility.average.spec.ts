import "@reapptor/ts-linq";

describe("average", function () {
    test("average-numbers", function () {
        const result: number = [1, 2, 3].average();
        expect(result).toEqual(2);
    });

    test("average-keySelector-one-element", function () {
        const result: number = [1].average();
        expect(result).toEqual(1);
    });

    test("average-objects", function () {
        const result: number = [1, 2, 3].average(item => item);
        expect(result).toEqual(2);
    });

    test("average-keySelector-one-element", function () {
        const result: number = [1].average(item => item);
        expect(result).toEqual(1);
    });
});
