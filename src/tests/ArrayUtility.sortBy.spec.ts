import "@reapptor/ts-linq";

interface Person {
    name: string;
    age: number;
}

describe("sortBy", () => {
    
    const people: Person[] = [
        { name: 'Theodore', age: 30 },
        { name: 'Lucas', age: 25 },
        { name: 'Mia', age: 35 },
        { name: 'Charlotte', age: 40 },
    ];

    // Test case is testing whether the array is sorted in ascending order by default
    // when the 'sortBy' method is called with only one sorting function.
    test("should sort the array in ascending order by default", () => {
        people.sortBy(person => person.age);

        expect(people).toEqual([
            { name: 'Lucas', age: 25 },
            { name: 'Theodore', age: 30 },
            { name: 'Mia', age: 35 },
            { name: 'Charlotte', age: 40 },
        ]);
    });

    // Test case is testing whether the array is sorted in ascending order by the first 'key'
    // when the 'sortBy' method is called with two sorting functions.
    test("should sort the array in ascending order by the first key", () => {
        people.sortBy(person => person.name, person => person.age);

        expect(people).toEqual([
            { name: 'Charlotte', age: 40 },
            { name: 'Lucas', age: 25 },
            { name: 'Mia', age: 35 },
            { name: 'Theodore', age: 30 },
        ]);
    });

    // Test case is testing whether the array is sorted in ascending order by the second 'key'
    // when the 'sortBy' method is called with a 'null' first sorting function and a second sorting function.
    test("should sort the array in ascending order by the second key", () => {
        people.sortBy(null, person => person.name);

        expect(people).toEqual([
            { name: 'Charlotte', age: 40 },
            { name: 'Lucas', age: 25 },
            { name: 'Mia', age: 35 },
            { name: 'Theodore', age: 30 },
        ]);
    });

    // Test case is testing whether the array is sorted in descending order by the first 'key'
    // when the 'sortBy' method is called with three sorting functions,
    // where the last one is used to specify that the sorting order should be descending.
    test("should sort the array in descending order by the first key", () => {
        people.sortBy(person => person.name, person => person.age, person => person.age);

        expect(people).toEqual([
            { name: 'Charlotte', age: 40 },
            { name: 'Lucas', age: 25 },
            { name: 'Mia', age: 35 },
            { name: 'Theodore', age: 30 },
        ]);
    });

});