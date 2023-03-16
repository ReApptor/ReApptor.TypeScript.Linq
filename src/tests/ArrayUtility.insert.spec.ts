// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("insert", () => {

    test("empty-to-empty", () => {
        const items: number[] = [];
        items.insert(items);
        expect(items).toEqual([]);
    });

    test("empty-to-array", () => {
        const items: number[] = [1];
        items.insert([]);
        expect(items).toEqual([1]);
    });

    test("item-to-empty", () => {
        const items: number[] = [];
        items.insert(1);
        expect(items).toEqual([1]);
    });

    test("array-to-empty", () => {
        const items: number[] = [];
        items.insert([1, 2]);
        expect(items).toEqual([1, 2]);
    });

    test("insert-at-default", () => {
        const items: number[] = [1];
        items.insert(2);
        expect(items).toEqual([2, 1]);
    });

    test("insert-array-at-default", () => {
        const items: number[] = [1];
        items.insert([2, 3]);
        expect(items).toEqual([2, 3, 1]);
    });

    test("insert-at-0", () => {
        const items: number[] = [1];
        items.insert(2, 0);
        expect(items).toEqual([2, 1]);
    });

    test("insert-array-at-0", () => {
        const items: number[] = [1];
        items.insert([2, 3], 0);
        expect(items).toEqual([2, 3, 1]);
    });

    test("insert-at-middle", () => {
        const items: number[] = [1, 3];
        items.insert(2, 1);
        expect(items).toEqual([1, 2, 3]);
    });

    test("insert-array-at-middle", () => {
        const items: number[] = [1, 4];
        items.insert([2, 3], 1);
        expect(items).toEqual([1, 2, 3, 4]);
    });

    test("insert-at-end", () => {
        const items: number[] = [1];
        items.insert(2, 1);
        expect(items).toEqual([1, 2]);
    });

    test("insert-array-at-end", () => {
        const items: number[] = [1];
        items.insert([2, 3], 1);
        expect(items).toEqual([1, 2, 3]);
    });

    test("index-out-of-range-left", () => {
        const items: number[] = [];
        try {
            items.insert(0, -1);
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe(`Array index "-1" out of range, can be in [0..0].`);
        }
    });

    test("index-out-of-range-right", () => {
        const items: number[] = [];
        try {
            items.insert(0, 1);
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe(`Array index "1" out of range, can be in [0..0].`);
        }
    });

});