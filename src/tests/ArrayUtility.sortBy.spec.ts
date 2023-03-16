// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";
import { Linq } from "@reapptor/ts-linq";

interface Person {
    name: string;
    age: number;
}

describe("sortBy", () => {
    
    const people: Person[] = [
        { name: "Theodore", age: 30 },
        { name: "Lucas", age: 25 },
        { name: "Mia", age: 35 },
        { name: "Charlotte", age: 40 },
    ];

    // Test case is testing whether the array is sorted in ascending order by default
    // when the "sortBy" method is called with only one sorting function.
    test("should sort the array in ascending order by default", () => {
        people.sortBy(person => person.age);

        expect(people).toEqual([
            { name: "Lucas", age: 25 },
            { name: "Theodore", age: 30 },
            { name: "Mia", age: 35 },
            { name: "Charlotte", age: 40 },
        ]);
    });

    // Test case is testing whether the array is sorted in ascending order by the first "key"
    // when the "sortBy" method is called with two sorting functions.
    test("should sort the array in ascending order by the first key", () => {
        people.sortBy(person => person.name, person => person.age);

        expect(people).toEqual([
            { name: "Charlotte", age: 40 },
            { name: "Lucas", age: 25 },
            { name: "Mia", age: 35 },
            { name: "Theodore", age: 30 },
        ]);
    });

    // Test case is testing whether the array is sorted in ascending order by the second "key"
    // when the "sortBy" method is called with a "null" first sorting function and a second sorting function.
    test("should sort the array in ascending order by the second key", () => {
        people.sortBy(null, person => person.name);

        expect(people).toEqual([
            { name: "Charlotte", age: 40 },
            { name: "Lucas", age: 25 },
            { name: "Mia", age: 35 },
            { name: "Theodore", age: 30 },
        ]);
    });

    // Test case is testing whether the array is sorted in descending order by the first "key"
    // when the "sortBy" method is called with three sorting functions,
    // where the last one is used to specify that the sorting order should be descending.
    test("should sort the array in descending order by the first key", () => {
        people.sortBy(person => person.name, person => person.age, person => person.age);

        expect(people).toEqual([
            { name: "Charlotte", age: 40 },
            { name: "Lucas", age: 25 },
            { name: "Mia", age: 35 },
            { name: "Theodore", age: 30 },
        ]);
    });

    test("date", () => {
        const date0 = new Date(Date.UTC(2023, 0, 0));
        const date1 = new Date(Date.UTC(2023, 0, 1));
        const date2 = new Date(Date.UTC(2023, 0, 2));
        const date3 = new Date(Date.UTC(2023, 1, 2));
        const date4 = new Date(Date.UTC(2023, 1, 3));
        const date5 = new Date(Date.UTC(2024, 1, 3));
        const date6 = new Date(Date.UTC(2025, 0, 0));
        
        const items: Date[] = [date1, date0, date2, date3, date6, date5, date4];
        
        items.sortBy();

        expect(items).toEqual([date0, date1, date2, date3, date4, date5, date6]);
    });

    test("date-as-string-and-string-to-date-cast-enabled", () => {
        Linq.settings.stringToDateCastEnabled = true;
        
        const offset: number = new Date().getTimezoneOffset();

        const date0 = "2002-01-10T00:00:00.000Z";
        const date1 = "2002-01-10T00:00:00+03:00";
        const date2 = "2019-09-24T24:00:00.000Z";
        const date3 = "2019-09-25T01:00:00.000";
        const date4 = "2019-09-25T01:00:00.000Z";
        const date5 = "2019-09-26";
        const date6 = "2019-09-26T16:00:20.817";

        const items: string[] = [date2, date1, date5, date0, date3, date4, date6];

        items.sortBy();
        
        const expected: string[] = (offset < 0)
            ? [date1, date0, date3, date2, date4, date5, date6]
            : [date1, date0, date2, date3, date4, date5, date6]

        expect(items).toEqual(expected);
    });

    test("date-as-string-and-string-to-date-cast-disabled", () => {
        Linq.settings.stringToDateCastEnabled = false;

        const date0 = "2002-01-10T00:00:00.000Z";
        const date1 = "2002-01-10T00:00:00+03:00";
        const date2 = "2019-09-24T24:00:00.000Z";
        const date3 = "2019-09-25T01:00:00.000";
        const date4 = "2019-09-25T01:00:00.000Z";
        const date5 = "2019-09-26";
        const date6 = "2019-09-26T16:00:20.817";
        
        const items: string[] = [date2, date1, date5, date0, date3, date4, date6];
        
        items.sortBy();

        expect(items).toEqual([date1, date0, date2, date3, date4, date5, date6]);
    });

});