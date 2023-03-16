// noinspection JSMismatchedCollectionQueryUpdate

import "@reapptor/ts-linq";

describe("except", () => {

    test("numbers1-except-number2", () => {
        const numbers1: number[] = [9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];
        const numbers2: number[] = [87, 3];
        const first: number[] = numbers1.except(numbers2);
        
        expect(first).toEqual([9, 34, 65, 92, 435, 54, 83, 23, 67, 12, 19]);
    });

    test("humans-except-same-age", () => {
        class Human {
            constructor(name: string, age: number) {
                this.name = name;
                this.age = age;
            }
            name: string;
            age: number;
        }
        
        const aleks: Human = new Human("Aleks", 25);
        const andrey: Human = new Human("Andrey", 21);
        const artem: Human = new Human("Artem", 25);
        
        const anastasiia: Human = new Human("Anastasiia", 21);
        const demian: Human = new Human("Demian", 39);
        
        const comparer = (x: Human, y: Human): boolean => {
            return (x.age == y.age);
        }
        
        const humans: Human[] = [aleks, andrey, artem];
        const humans2: Human[] = [anastasiia, demian];
        
        const humansExceptSameAge: Human[] = humans.except(humans2, comparer);
        
        expect(humansExceptSameAge).toEqual([aleks, artem]);
    });
});
