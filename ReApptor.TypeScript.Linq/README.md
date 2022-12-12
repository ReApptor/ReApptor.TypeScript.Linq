![alt text](https://www.reapptor.com/wp-content/uploads/2021/09/ReApptor-logo-pink-l.png)
# ReApptor TypeScript LINQ

It is a complete, fully tested analog of C# Language-Integrated Query (LINQ) 
written in TypeScript. 

LINQ package generally operates on the collection types and comes as 
extension methods serving a variety of 
purposes in working with collections of types. 

The original idea behind this package is to make TypeScript syntax look
like C# to ease the work for developers using both C# and TypeScript
in their day-to-day work.

## Included query functions

* [`All`](#All)
* [`Any`](#Any)
* [`Chunk`](#All)
* [`Count`](#All)
* [`Distinct`](#All)
* [`First`](#All)
* [`FirstOrDefault`](#All)
* [`Last`](#All)
* [`LastOrDefault`](#All)
* [`Max`](#All)
* [`Min`](#All)
* [`Repeat`](#All)
* [`SelectMany`](#All)
* [`Skip`](#All)
* [`Sum`](#All)
* [`Take`](#All)
* [`TakeLast`](#All)
* [`TakeWhile`](#All)


### All

Determines whether all elements of a sequence satisfy a condition.
```typescript
    /**
    * @param predicate - A function to test each element for a condition.
    * @returns boolean - true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
    */
    all(predicate: (item: T, index: number) => boolean): boolean;
```
#### Example
The following code examples demonstrates how to use All to determine whether all the elements in 
a sequence satisfy a condition. The result is true if every element of the source sequence 
passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
```typescript
const numbers: number[] = [1, 2, 3];

const empty: number[] = [];

const allFive: number[] = [5, 5, 5];

const hasAllTwo: boolean = numbers.all(item => item == 2);
console.log("hasAllTwo = ", hasAllTwo);

const hasAllOnEmpty: boolean = empty.all(item => item == 1);
console.log("hasAllOnEmpty = ", hasAllOnEmpty);

const hasAllFive: boolean = allFive.all(item => item == 5);
console.log("hasAllFive = ", hasAllFive);
```
#### Code produces the following output:
```
hasAllTwo = false;

hasAllOnEmpty = true;

hasAllFive = true;

```
***
### Any
Determines whether a sequence contains any elements in the collection, 
which satisfies an optional condition. If no condition is provided, 
the method just returns if the collection is empty or not.
```typescript
    /**
     * @param predicate - A function to test each element for a condition.
     * @returns boolean - true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
     */
    any(predicate?: (item: T, index: number) => boolean): boolean;
```
#### Example
The following code example demonstrates how to use Any to determine whether a sequence contains any elements.
```typescript
const numbers: number[] = [1, 2, 3];

const empty: number[] = [];

const hasSecond: boolean = numbers.any(item => item == 2);
console.log("hasSecond = ", hasSecond);

const hasFifth: boolean = numbers.any(item => item == 5);
console.log("hasFifth = ", hasFifth);

const hasAnyNumber: boolean = numbers.any();
console.log("hasAnyNumber = ", hasAnyNumber);

const hasEmptyAnyNumber: boolean = empty.any();
console.log("hasEmptyAnyNumber = ", hasEmptyAnyNumber);
```

#### Code produces the following output:
```
hasSecond = true;

hasFifth = false;

hasAny = true;

hasEmptyAnyNumber = false;
```
***

***
### Chunk
Splits the elements of a sequence into chunks of the parameter size at most size.
```typescript
/**
 * @param size - The maximum size of each chunk.
 * @returns Array<T>[] - An Array<T> that contains the elements the input sequence split into chunks of size size.
 */
chunk(size: number): T[][];
```
#### Example
The following code example demonstrates how to use Chunk on a sequence. 
Each chunk except the last one will be of size size. 
The last chunk will contain the remaining elements and may be of a smaller size.
```typescript
const numbers: number[] = [1, 2, 3, 4];

let size: number = 1;
const chunkedNumbersSize1 = numbers.chunk(size);
console.log("[1, 2, 3, 4] chunk with size of 1 = ", chunkedNumbersSize1);

size = 10;
const chunkedNumbersSize10 = numbers.chunk(size);
console.log("[1, 2, 3, 4] chunk with size of 10 = ", chunkedNumbersSize10);

const empty: number[] = [];
const chunkedOnEmpty = numbers.chunk(size);
console.log("[] chunk with size of 10 = ", chunkedOnEmpty);

```

#### Code produces the following output:
```
[1, 2, 3, 4] chunk with size of 1 =  [ [ 1 ], [ 2 ], [ 3 ], [ 4 ] ]

[1, 2, 3, 4] chunk with size of 10 =  [ [ 1, 2, 3, 4 ] ]

[] chunk with size of 10 =  []

hasEmptyAnyNumber = false;
```
***

#### Exceptions
Parameter size is below 1. 

```typescript
const numbers: number[] = [1, 2, 3, 4];

let size: number = 0;
try {
    const chunkedNumbers = numbers.chunk(0);
} catch (e: any) {
    console.log(e.message);
}
```
#### Code produces the following output:
```
Size "0" out of range, must be at least 1 or greater.
```

***
### Count
Returns the number of elements in a sequence.
```typescript
/**
 * @param predicate - A function to test each element for a condition.
 * @returns number - The number of elements in the input sequence if the predicate is not specified or, otherwise, the number of elements source that passes the test, specified by the predicate.
 */
count(predicate?: ((item: T, index: number) => boolean) | null): number;
```
#### Example
The following code example demonstrates how to use Count to count the elements in an array.
```typescript
const numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const count = numbers.count();

console.log(`There are ${count} numbers in the collection`);
```

#### Code produces the following output:
```
There are 10 numbers in the collection
```
***

***
### Distinct
Returns distinct elements from a sequence.
```typescript
 /**
 * @param predicate - A predicate function to get comparable value.
 * @returns Array<T> - An Array<T> that contains distinct elements from the source sequence.
 */
distinct(predicate?: ((item: T) => any) | null): T[];

```
#### Examples
The following code examples demonstrates how to use Count to count the elements in an array.

###### Example #1
```typescript
const values: any[] = [1, 1, "red", 2, 3, 3, 4, "green", 5, 6, 10, "green"];
const distinctValues = values.distinct();
console.log("distinctValues = ", distinctValues);
```

###### Example #1 produces the following output:
```
distinctValues = [ 1, 'red', 2, 3, 4, 'green', 5, 6, 10 ]
```
***

###### Example #2
```typescript
class Human {
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    public name: string;
    public age: number;
}

const aleks: Human = new Human("Aleks", 23);
const youngJack: Human = new Human("Jack", 14);
const oldJack: Human = new Human("Jack", 64);

const distinctNameHumans = humans.distinct(item => item.name);
console.log("distinctNameHumans = ", distinctNameHumans);

const distinctAgeHumans = humans.distinct(item => item.age);
console.log("distinctAgeHumans = ", distinctAgeHumans);
```

###### Example #2 produces the following output:
```
distinctValues = [ 1, 'red', 2, 3, 4, 'green', 5, 6, 10 ]
 
distinctNameHumans =  [ 
    Human { name: 'Aleks', age: 23 }, 
    Human { name: 'Jack', age: 64 } 
]
 
distinctAgeHumans =  [
    Human { name: 'Aleks', age: 23 },
    Human { name: 'Jack', age: 14 },
    Human { name: 'Jack', age: 64 }
]
```
***
### First
Returns the first element of a sequence, or a default value if no element is found, or throw error if no default element is not specified.
```typescript
/**
 * 
 * @param predicate - A function to test each element for a condition.
 * @param defaultValue - The default value to return if the sequence is empty.
 * @returns T - defaultValue if source is empty or if no element passes the test specified by predicate; otherwise, the first element in source that passes the test specified by predicate.
 */
```
#### Example
The following code examples demonstrates how to use First
to return the first element of an array that satisfies
a condition, first or default.

###### Return first element in the sequence
```typescript
const numbers: number[] = [ 9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];
const first: number = numbers.first();
console.log("First = ", first);
```
###### Return first element in the sequence that satisfies a condition
```typescript
const numbers: number[] = [ 9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];
const firstGreaterThan80: number = numbers.first(item => item > 80);
console.log("First number in the sequence greater than 80 = ", first);
```
###### Return a default value if none of the elements in the sequence satisfies a condition
```typescript
const numbers: number[] = [ 9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];
const defaultValue: number = numbers.first(item => item == 1, -1);
console.log("Default value = ", defaultValue);
```
#### Code produces the following output:
```
First = 9
First number in the sequence greater than 80 = 92
Default value = -1
```

#### Exceptions
Sequence has none elements matching the predicate.

```typescript
const numbers: number[] = [ 9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];

try {
    const firstGreaterThan80: number = numbers.first(item => item == 1);
} catch (e: any) {
    console.log(e.message);
}
```
#### Code produces the following output:
```
No item found matching the specified predicate.
```

***
### FirstOrDefault
Returns the first element of a sequence, or a default value if no element is found.
```typescript
/**
 * @param callback - A function to test each element for a condition.
 * @param defaultValue - The default value to return if the sequence is empty.
 * @returns T - defaultValue if source is empty or if no element passes the test specified by predicate; otherwise, the first element in source that passes the test specified by predicate.
 */
firstOrDefault(callback?: ((item: T) => boolean) | null, defaultValue?: T | null): T | null;
```
#### Example
The following code examples demonstrates how to use FirstOrDefault
to return the first element of an array that satisfies
a condition or a default value if the defaultValue has a value and not.

###### Return first element in the sequence
```typescript
const numbers: number[] = [ 9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];
const firstInSequence: number | null = numbers.firstOrDefault();
console.log("First in the sequence = ", firstInSequence);
```
###### Return first element in the sequence that satisfies a condition
```typescript
const numbers: number[] = [ 9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];
const firstMatching: number | null = numbers.firstOrDefault(item => item > 435);
console.log("First in the sequence that is greater than 400 = ", firstMatching);
```
###### None of the elements in the sequence satisfies a condition
```typescript
const numbers: number[] = [ 9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];
const defaultIfNotFound: number = numbers.firstOrDefault(item => item == -1);
console.log("None of the items matching the predicate. The return value = ", defaultIfNotFound);
```

###### Specified default value if none of the elements in the sequence satisfies a condition
```typescript
const numbers: number[] = [ 9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];
const defaultProvidedIfNotFound: number = numbers.firstOrDefault(item => item > 1000, -1);
console.log("Return -1 if none of the elements matching the predicate. The return value = ", defaultProvidedIfNotFound);
```
#### Code produces the following output:
```
First in the sequence = 9
First in the sequence that is greater than 400 = 435
None of the items matching the predicate. The return value = null
Return -1 if none of the elements matching the predicate. The return value = -1
```