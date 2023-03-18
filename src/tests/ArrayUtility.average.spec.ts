// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("average", () => {
    
    test("average-numbers", () => {
        const result: number = [1, 2, 3].average();
        expect(result).toEqual(2);
    });

    test("average-keySelector-one-element", () => {
        const result: number = [1].average();
        expect(result).toEqual(1);
    });

    test("average-objects", () => {
        const result: number = [1, 2, 3].average(item => item);
        expect(result).toEqual(2);
    });

    test("average-keySelector-one-element", () => {
        const result: number = [1].average(item => item);
        expect(result).toEqual(1);
    });

    test("average-empty", () => {
        try {
            [].average();
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe(`The source sequence is empty.`);
        }
    });
    
});
