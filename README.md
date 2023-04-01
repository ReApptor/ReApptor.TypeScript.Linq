![ReApptor](https://raw.githubusercontent.com/ReApptor/ReApptor.TypeScript.Linq/main/ReApptor.png)
# ReApptor TypeScript LINQ

It is a complete, fully tested analog of [C# Language-Integrated Query (LINQ)](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable?view=net-7.0)
written in [TypeScript](https://www.typescriptlang.org/).

LINQ package generally operates on the collection types and comes as
extension methods serving a variety of
purposes in working with collections of types.

It's a simple, lightweight, intuitive set of features with good
documentation and examples.\
No complicated or superfluous interfaces, structures, or logic.\
No additional or external types or objects.

The original idea behind this package is to make TypeScript syntax look
like C# to ease the work for developers using both C# and TypeScript
in their day-to-day work.

## Installation

Install from the command line:

```npm
npm install @reapptor/ts-linq
```

Install via package.json:

```npm
"@reapptor/ts-linq": "^1.*"
```

## Usage

Add `import "@reapptor/ts-linq";` into the main project file (i.e. index.ts) to register extensions.

## License

The ReApptor TypeScript LINQ package is licensed under the terms of the [MIT license](https://raw.githubusercontent.com/ReApptor/ReApptor.TypeScript.Linq/main/LICENSE.md) and is available for free.

## Testing

The code is <b>100%</b> covered by the JEST tests.\
The generated coverage result is here:\
[Coverage Summary](https://raw.githubusercontent.com/ReApptor/ReApptor.TypeScript.Linq/main/coverage/coverage-summary.json)

## Links
- [Overview](https://reapptor.github.io/ReApptor.TypeScript.Linq/)
- [Source code](https://github.com/ReApptor/ReApptor.TypeScript.Linq)
- [Package (GitHub)](https://github.com/ReApptor/ReApptor.TypeScript.Linq/pkgs/npm/ts-linq)
- [Package (NPM)](https://www.npmjs.com/package/@reapptor/ts-linq)
- [Discussions](https://github.com/ReApptor/ReApptor.TypeScript.Linq/discussions)
- [About ReApptor](https://www.reapptor.com)
- [ReApptor on GitHub](https://github.com/ReApptor)
- [ReApptor in LinkedIn](https://www.linkedin.com/company/reapptor/)

## Other projects
- [ReApptor.TypeScript.PagedList](https://reapptor.github.io/ReApptor.TypeScript.PagedList/)
  [<small>@reapptor/ts-paged-list</small>](https://github.com/ReApptor/ReApptor.TypeScript.Linq/pkgs/npm/ts-paged-list)\
  <small>It is a complete, fully tested pagination library for splitting the array into pages and selecting a specific page by an index.</small>

## IList functions

* [`Remove`](#Remove)
* [`RemoveAt`](#RemoveAt)
* [`Insert`](#Insert)

## LINQ (IEnumerable) functions

* [`All`](#All)
* [`Any`](#Any)
* [`Average`](#Average)
* [`Chunk`](#Chunk)
* [`Concat`](#Concat)
* [`Count`](#Count)
* [`Distinct`](#Distinct)
* [`Distinct`](#Distinct)
* [`Except`](#Except)
* [`FirstOrDefault`](#FirstOrDefault)
* [`Last`](#Last)
* [`LastOrDefault`](#LastOrDefault)
* [`Max`](#Max)
* [`Min`](#Min)
* [`Repeat`](#Repeat)
* [`Reverse`](#Reverse)
* [`Select`](#Select)
* [`Single`](#Single)
* [`SingleOrDefault`](#SingleOrDefault)
* [`SelectMany`](#SelectMany)
* [`Skip`](#Skip)
* [`SkipLast`](#SkipLast)
* [`SkipWhile`](#SkipWhile)
* [`Sum`](#Sum)
* [`Take`](#Take)
* [`TakeLast`](#TakeLast)
* [`TakeWhile`](#TakeWhile)
* [`ToDictionary`](#ToDictionary)
* [`ToHashSet`](#ToHashSet)
* [`GroupBy`](#GroupBy)

## Async functions

* [`ForEachAsync`](#ForEachAsync)
* [`WhereAsync`](#WhereAsync)

### Remove
#### [MSDN: System.Collections.Generic.IList.Remove](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1.remove?view=net-8.0)

Removes the first occurrence of a specific object from the Array<T>.
```typescript
/**
 * @param item - The object(s) to remove from the Array<T>. The value can be null for reference types.
 * @returns boolean - true if item is successfully removed; otherwise, false. This method also returns false if item was not found in the Array<T>.
 */
remove(item: T | readonly T[]): void;
```
#### Example #1
Removes a single occurrence of an item from the array.
```typescript
const items: number[] = [1, 2, 3, 4, 5];

items.remove(3);

console.log(items);
```
#### Code produces the following output:
```
[1, 2, 4, 5] 
``````
#### Example #2
Removes all specified items from the array.
```typescript
const items: number[] = [1, 2, 3, 4, 5];

items.remove([2, 4]);

console.log(items);
```
#### Code produces the following output:
```
[1, 3, 5] 
`````````
#### Example #3
Removes nothing if the specified item is not in the array.
```typescript
const items: number[] = [1, 2, 3, 4, 5];

items.remove(6);

console.log(items);
```
#### Code produces the following output:
```
[1, 2, 3, 4, 5]
```
***

### RemoveAt
#### [MSDN: System.Collections.Generic.IList.RemoveAt](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1.removeat?view=net-8.0)

Removes the element at the specified index of the Array<T>.
```typescript
/**
 * @param index - The zero-based index of the element to remove.
 * @exception ArgumentOutOfRangeException - index is less than 0 -or- index is equal to or greater than Count.
 */
removeAt(index: number): void;
```
#### Example #1
Removes the item at index 2.

```typescript
const items: string[] = ["a", "b", "c", "d", "e"];

items.removeAt(2);

console.log(items);
```
#### Code produces the following output:
```
["a", "b", "d", "e"]
`````````
#### Example #2
Removes an item at an index that is less than 0 or greater than or 
equal to the length of the array.

```typescript
const items: string[] = ["a", "b", "c", "d", "e"];

try {
  items.removeAt(-1)
} catch (error: any) {
  console.log(error.message);
}
```
#### Code produces the following output:
```
"Array index \"-1\" out of range, can be in [0..5]."
``````
#### Example #2
Removing an item at an index that is less than 0 or greater than or 
equal to the length of the array throws error.

```typescript
const items: string[] = ["a", "b", "c", "d", "e"];

try {
  items.removeAt(-1)
} catch (error: any) {
  console.log(error.message);
}
```
#### Code produces the following output:
```
"Array index \"-1\" out of range, can be in [0..5]."
``````
#### Example #3
Removing an item at index 0 on empty array throws error.

```typescript
const items: string[] = [];

try {
  items.removeAt(0)
} catch (error: any) {
  console.log(error.message);
}
```
#### Code produces the following output:
```
"Array index "0" out of range, array is empty."
``````
***

### Insert
#### [MSDN: System.Collections.Generic.IList.Insert](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1.insert?view=net-8.0)

Inserts an element into the Array<T> at the specified index.
```typescript
 /**
 * @param item - The object to insert.
 * @param index - The zero-based index at which item should be inserted.
 */
insert(item: T | readonly T[], index?: number | null): void;
```
#### Example #1
Inserting one array to another array.

```typescript
const items: number[] = [1];

items.insert([2, 3]);
```
#### Code produces the following output:
```
[2, 3, 1]
`````````
#### Example #2
Inserting an item into array.

```typescript
const items: number[] = [1];

items.insert(2);
```
#### Code produces the following output:
```
[2, 1]
`````````
#### Example #3
Inserting an item 2 into a 1 index of an array.

```typescript
const items: number[] = [1, 3];

items.insert(2, 1);
```
#### Code produces the following output:
```
[1, 2, 3]
`````````
#### Example #4
Inserting an array into a 1 index of another array.

```typescript
const items: number[] = [1, 4];

items.insert([2, 3], 1);
```
#### Code produces the following output:
```
[1, 2, 3, 4]
`````````
***

### All
#### [MSDN: System.Linq.Enumerable.All](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.all?view=net-7.0)

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
#### [MSDN: System.Linq.Enumerable.Any](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.any?view=net-7.0)
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

### Average
#### [MSDN: System.Linq.Enumerable.Average](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.average?view=net-7.0)
Computes the average of a sequence of numeric values.
```typescript
/**
 * Computes the sum of a sequence of nullable number values.
 * @param selector - A transform function to apply to each element.
 * @returns number - the sum of the values in the sequence.
 */
average(selector?: ((item: T) => number | null | undefined) | null): number;
```
#### Example
The following code example demonstrates how to use Any to determine whether a sequence contains any elements.
```typescript
const numbers: number[] = [1, 2, 3];

const average1: number = numbers.average();
console.log("average1 = ", average);

const average2: number = numbers.average(item => item);
console.log("average2 = ", average2);
```

#### Code produces the following output:
```
average1 = 2;

average2 = 2;
```
***

### Chunk
#### [MSDN: System.Linq.Enumerable.Chunk](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.chunk?view=net-7.0)
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
### Concat
Native function (ES5).
### Count
#### [MSDN: System.Linq.Enumerable.Count](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.count?view=net-7.0)
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
### Distinct
#### [MSDN: System.Linq.Enumerable.Distinct](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.distinct?view=net-7.0)
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
#### [MSDN: System.Linq.Enumerable.First](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.first?view=net-7.0)
Returns the first element of a sequence, or a default value if no element is found, or throw error if no default element is not specified.
```typescript
/**
 * @param predicate - A function to test each element for a condition.
 * @param defaultValue - The default value to return if the sequence is empty.
 * @returns T - defaultValue if source is empty or if no element passes the test specified by predicate; otherwise, the first element in source that passes the test specified by predicate.
 */
first(predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T;
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
### Except
#### [MSDN: System.Linq.Enumerable.Except](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.except?view=net-7.0)
Produces the set difference of two sequences (the elements from the source collection not existing in the excepted collection).
```typescript
/**
 * @param except - An Array<T> whose elements that also occur in the source sequence will cause those elements to be removed from the returned sequence.
 * @param comparer - A function to compare values.
 * @returns T[] - An Array<T> sequence that contains the set difference of the elements of two sequences.
 */
except(except: readonly T[], comparer?: ((x: T, y: T) => boolean) | null): T[];
```
#### Examples

The following code exampled demonstrates how to use the 
method to compare two sequences of numbers and return first sequence elements that don't 
appear in the second sequence.

###### Returns first sequence elements excluding elements from the second sequence if appears
```typescript
const numbers1: number[] = [9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];
const numbers2: number[] = [87, 3];

const result: number[] = numbers1.except(numbers2);

console.log(result);
```

#### Code produces the following output:
```
[9, 34, 65, 92, 87, 435, 54, 83, 23, 435, 67, 12, 19]
```
###### Returns first sequence elements excluding elements from the second sequence utilizing custom comparer

```typescript
const numbers: number[] = [1, 2, 3];

const result = numbers.except([2], (x: number, y: number) => x === y);


console.log(result);
```

#### Code produces the following output:
```
[1, 3]
```

The following code example demonstrates how to use the 
method with the comparer to compare two sequences of human objects and produce a sequence of humans
whose age differs from the age of humans from the second sequence.

###### Returns first sequence elements excluding elements from the second sequence utilizing custom comparer

```typescript

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
const maria: Human = new Human("Maria", 23);

const comparer = (x: Human, y: Human): boolean => {
  return (x.age == y.age);
}

const boys: Human[] = [aleks, andrey, artem];
const girls: Human[] = [anastasiia, maria];

const humansExceptSameAge: Human[] = boys.except(girls, comparer);

const result: string[] = humansExceptSameAge.select(human => human.name);

console.log(result)
```

#### Code produces the following output:
```
["Aleks", "Artem"]
```

### FirstOrDefault
#### [MSDN: System.Linq.Enumerable.FirstOrDefault](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.firstOrDefault?view=net-7.0)
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
a condition or a default value if the defaultValue parameter is specified, otherwise null.

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
console.log("Default value is -1 if none of the elements matching the predicate. The return value = ", defaultProvidedIfNotFound);
```
#### Code produces the following output:
```
First in the sequence = 9
First in the sequence that is greater than 400 = 435
None of the items matching the predicate. The return value = null
Return -1 if none of the elements matching the predicate. The return value = -1
```
***
### Last
#### [MSDN: System.Linq.Enumerable.Last](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.last?view=net-7.0)
Returns the last element of a sequence, or a default value if no element is found, or throw error if no default element is not specified.
```typescript
/**
 * @param predicate - A function to test each element for a condition.
 * @param defaultValue - The default value to return if the sequence is empty.
 * @returns T - defaultValue if source is empty or if no element passes the test specified by predicate; otherwise, the last element in source that passes the test specified by predicate.
 */
last(predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T;
```
#### Example
The following code example demonstrates how to use Last to return
the last element of an array that satisfies a condition, last or default.

###### Return last element in the sequence
```typescript
const numbers: number[] = [ 9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];
const last: number = numbers.last();
console.log("Last = ", last);
```
###### Return last element in the sequence that satisfies a condition
```typescript
const numbers: number[] = [ 9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];
const lastGreaterThan80: number = numbers.last(item => item > 80);
console.log("Last number in the sequence greater than 80 = ", last);
```
###### Return a default value if none of the elements in the sequence satisfies a condition
```typescript
const numbers: number[] = [ 9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];
const defaultValue: number = numbers.last(item => item == 1, -1);
console.log("Default value = ", defaultValue);
```
#### Code produces the following output:
```
Last = 19
Last number in the sequence greater than 80 = 435
Default value = -1
```

#### Exceptions
Sequence has none elements matching the predicate.

```typescript
const numbers: number[] = [ 9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];

try {
    const lastGreaterThan80: number = numbers.last(item => item == 1);
} catch (e: any) {
    console.log(e.message);
}
```
#### Code produces the following output:
```
No item found matching the specified predicate.
```
***
### LastOrDefault
#### [MSDN: System.Linq.Enumerable.LastOrDefault](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.lastOrDefault?view=net-7.0)
Returns the last element of a sequence, or a specified default value if the sequence contains no elements.
```typescript
/**
 * @param predicate - A function to test each element for a condition.
 * @param defaultValue - The default value to return if the sequence is empty.
 * @returns T - defaultValue if source is empty or if no element passes the test specified by predicate; otherwise, the last element in source that passes the test specified by predicate.
 */
lastOrDefault(predicate?: ((item: T) => boolean) | null, defaultValue?: T | null): T | null;
```
#### Example
The following code examples demonstrates how to use LastOrDefault
to return the last element of an array that satisfies
a condition or a default value if the defaultValue parameter is specified, otherwise null.

###### Return last element in the sequence
```typescript
const numbers: number[] = [ 9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];
const lastInSequence: number | null = numbers.lastOrDefault();
console.log("Last in the sequence = ", lastInSequence);
```
###### Return last element in the sequence that satisfies a condition
```typescript
const numbers: number[] = [ 9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];
const lastMatching: number | null = numbers.lastOrDefault(item => item > 435);
console.log("Last in the sequence that is greater than 400 = ", lastMatching);
```
###### None of the elements in the sequence satisfies a condition
```typescript
const numbers: number[] = [ 9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];
const defaultIfNotFound: number = numbers.lastOrDefault(item => item == -1);
console.log("None of the items matching the predicate. The return value = ", defaultIfNotFound);
```

###### Specified default value if none of the elements in the sequence satisfies a condition
```typescript
const numbers: number[] = [ 9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 435, 67, 12, 19];
const defaultProvidedIfNotFound: number = numbers.lastOrDefault(item => item > 1000, -1);
console.log("Default value is -1 if none of the elements matching the predicate. The return value = ", defaultProvidedIfNotFound);
```
#### Code produces the following output:
```
Last in the sequence = 19
Last in the sequence that is greater than 400 = 435
None of the items matching the predicate. The return value = null
Return -1 if none of the elements matching the predicate. The return value = -1
```
***
### Max
#### [MSDN: System.Linq.Enumerable.Max](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.max?view=net-7.0)
Returns the maximum value in a sequence of values.
```typescript
/**
 * @param predicate - A function to test each element for a condition.
 * @returns T - The maximum value in the sequence.
 */
max(predicate: ((item: T) => number) | null): T;
```
#### Example
The following code example demonstrates how to use Max to determine the maximum value in a sequence.

```typescript
const values: any[] = [null, 1.5E+104, 9E+103, -2E+103];

const max = values.max();

console.log(`The largest number is ${max}`);
```
#### Code produces the following output:
```
The largest number is 1.5e+104
```
***
### Min
#### [MSDN: System.Linq.Enumerable.Min](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.min?view=net-7.0)
Returns the minimum value in a sequence of values.
```typescript
/**
 * @param predicate - A function to test each element for a condition.
 * @returns T - The minimum value in the sequence.
 */
min(predicate: ((item: T) => number) | null): T;
```
#### Example
The following code example demonstrates how to use Min to determine the minimum value in a sequence.

```typescript
const grades: any[] = [78, 92, null, 99, 37, 81];

const min = values.min();

console.log(`The lowest grade is ${min}`);
```
#### Code produces the following output:
```
The lowest grade is 37
```

***
### Repeat
#### [MSDN: System.Linq.Enumerable.Repeat](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.repeat?view=net-7.0)
Generates a sequence that contains one repeated value.
```typescript
/**
 * @param element - The value to be repeated.
 * @param count - The number of times to repeat the value in the generated sequence.
 * @returns T[] - An Array<T> that contains a repeated value.
 */
repeat(element: T, count: number): T[];
```
#### Example
The following code example demonstrates how to use Repeat to generate a sequence of a repeated value.

```typescript
const values: string[] = Array.prototype.repeat("I like programming.", 5);

for (let i = 0; i < values.length; i ++) {
    console.log(values[i]);
}
```
#### Code produces the following output:
```
I like programming.
I like programming.
I like programming.
I like programming.
I like programming.
```
***
### Reverse
Native function (ES5)
### Select
Documentation is under construction and upcoming soon.\
<i>Use the built-in code comment instead.</i>
### SelectMany
Projects each element of a sequence to an Array<T> and flattens the resulting sequences into one sequence.
```typescript
/**
 * @param collectionSelector - A transform function to apply to each element of the input sequence.
 * @returns Array<TOut> - An Array<TOut> whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of source and then mapping each of those sequence elements and their corresponding source element to a result element.
 */
selectMany<TOut>(collectionSelector: (item: T) => TOut[]): TOut[];
```
#### Example
The following code example demonstrates how to use SelectMany
to perform a one-to-many projection over an array.

```typescript
class PetOwner
{
    constructor(name: string, pets: string[]) {
        this.name = name;
        this.pets = pets;
    }

    public name: string;
    public pets: string[];
}

const higa = new PetOwner("Higa", ["Scruffy", "Sam"]);
const ashkenazi = new PetOwner("Ashkenazi", ["Walker", "Sugar"]);
const price = new PetOwner("Price", ["Scratches", "Diesel"]);
const hines = new PetOwner("Hines", ["Dusty"]);

const petOwners: PetOwner[] = [higa, ashkenazi, price, hines];

const query = petOwners
    .selectMany(petOwner => petOwner.pets)
    .where(ownerAndPet => ownerAndPet.startsWith("S"));

console.log(query);
```
#### Code produces the following output:
```
[ 'Scruffy', 'Sam', 'Sugar', 'Scratches' ]
```
***
### Single
Documentation is under construction and upcoming soon.\
<i>Use the built-in code comment instead.</i>
### SingleOrDefault
Documentation is under construction and upcoming soon.\
<i>Use the built-in code comment instead.</i>
### Skip
#### [MSDN: System.Linq.Enumerable.Skip](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.skip?view=net-7.0)
Bypasses a specified number of elements in a sequence and then returns the remaining elements.
```typescript
/**
 * @param count - A function to test each element for a condition.
 * @returns Array<T> - An Array<T> that contains the elements that occur after the specified index in the input sequence.
 */
skip(count: number): T[];
```
#### Example
The following code example demonstrates how to use Skip to skip a
specified number of elements in a sorted array and return the remaining
elements.

```typescript
const grades: number[] = [ 59, 82, 70, 56, 92, 98, 85 ];

grades.order(item => item);

const skipped3Grades: number[] = grades.skip(3);

console.log("All grades except the top three are:", skippedGrades);
```
#### Code produces the following output:
```
All grades except the top three are: [ 82, 85, 92, 98 ]
```
***
### SkipLast
Documentation is under construction and upcoming soon.\
<i>Use the built-in code comment instead.</i>
### SkipWhile
Documentation is under construction and upcoming soon.\
<i>Use the built-in code comment instead.</i>
### Sum
#### [MSDN: System.Linq.Enumerable.Sum](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.sum?view=net-7.0)
Computes the sum of a sequence of numeric values.
```typescript
/**
 * @param predicate - A function to test each element for a condition.
 * @returns number - The sum of the values in the sequence.
 */
sum(predicate: (item: T) => number | null | undefined): number;
```
#### Example
The following code example demonstrates how to use Sum
to sum the values of a sequence.

```typescript
const grades: number[] = [ 43.68, 1.25, 583.7, 6.5 ];

const sum: number = grades.sum(item => item);

console.log(`The sum of the numbers is ${sum}.`);
```
#### Code produces the following output:
```
The sum of the numbers is 635.13.
```
***
### Take
#### [MSDN: System.Linq.Enumerable.Take](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.take?view=net-7.0)
Returns a specified number of contiguous elements from the start of a sequence.
```typescript
/**
 * @param count - The number of elements to return.
 * @returns Array<T> - An Array<T> that contains the specified number of elements from the start of the input sequence.
 */
take(count: number): T[];
```
#### Example
The following code example demonstrates how to use Take to
return elements from the start of a sequence.

```typescript
const grades: number[] = [ 59, 82, 70, 56, 92, 98, 85 ];

grades.sort((a, b) => b - a);

const top3Grades: number[] = grades.take(3);

console.log(`The top three grades are:${top3Grades}`);
```
#### Code produces the following output:
```
The top three grades are:98,92,85
```
***
### TakeLast
#### [MSDN: System.Linq.Enumerable.TakeLast](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.takeLast?view=net-7.0)
Returns a new array that contains the last count elements from source.
```typescript
/**
 * @param count - The number of elements to take from the end of the collection.
 * @returns Array<T> - A new array that contains the last count elements from source.
 */
takeLast(count: number): T[];
```
#### Example
The following code example demonstrates how to use TakeLast to
return elements from the start of a sequence.

```typescript
const grades: number[] = [ 59, 82, 70, 56, 92, 98, 85 ];

grades.sort((a, b) => b - a);

const worst3Grades: number[] = grades.takeLast(3);

console.log(`The worst three grades are:${worst3Grades}`);
```
#### Code produces the following output:
```
The worst three grades are:70,59,56
```
***
### TakeWhile
#### [MSDN: System.Linq.Enumerable.TakeWhile](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.takeWhile?view=net-7.0)
Returns elements from an array as long as a specified condition is true.
```typescript
/**
 * @param predicate - A function to test each element for a condition.
 * @returns Array<T> - An new array that contains the elements from the input sequence that occur before the element at which the test no longer passes.
 */
takeWhile(predicate: (item: T, index: number) => boolean): T[];
```
#### Example
The following code example demonstrates how to use TakeWhile
to return elements from the start of a sequence as long as a condition
is true.

```typescript
const fruits: string[] = [ "apple", "banana", "mango", "orange", "passionfruit", "grape" ];

const query = fruits.takeWhile(fruit => fruit != "orange");

console.log(query);
```
#### Code produces the following output:
```
[ 'apple', 'banana', 'mango' ]
```
***
### ToDictionary
Documentation is under construction and upcoming soon.\
<i>Use the built-in code comment instead.</i>
### ToHashSet
Documentation is under construction and upcoming soon.\
<i>Use the built-in code comment instead.</i>
### GroupBy
#### [MSDN: System.Linq.Enumerable.GroupBy](https://learn.microsoft.com/en-us/dotnet/api/System.Linq.Enumerable.groupBy?view=net-7.0)
Groups the elements of a sequence according to a key selector function. The keys are compared by using a comparer and each group's elements are projected by using a specified function.
```typescript
 /**
 * Groups the elements of a sequence according to a key selector function. The keys are compared by using a comparer and each group's elements are projected by using a specified function.
 * @param keySelector - An optional function to extract the key for each element.
 * @param elementSelector - An optional function to map each source element to an element in the result grouped element.
 * @returns Array<TElement[]> - An array of grouped objects of type TElement.
 */
groupBy<TKey = T, TElement = TKey>(keySelector?: ((item: T, index: number) => TKey) | null, elementSelector?: ((item: T, index: number) => TElement) | null): TElement[][];
```
#### Examples

###### Example #1
The following code example method groups the items by the specified property.
It creates an array of objects with the name and age properties and calls
the groupBy method on it with the callback function that groups the objects
by their age.\
The expected result is an array with two sub-arrays, where each sub-array
contains objects with the same age.

```typescript
const items: {name: string, age: number}[] = [
    { name: "Sam", age: 30 },
    { name: "Jack", age: 25 },
    { name: "Richard", age: 30 },
    { name: "Helen", age: 25 },
];

const result: {name: string, age: number}[][] = items.groupBy(item => item.age);

console.log(result);
```
#### Code produces the following output:
```
 [{ name: "Sam", age: 30 }, { name: "Richard", age: 30 }],
 [{ name: "Jack", age: 25 }, { name: "Helen", age: 25 }],
```
###### Example #2
The following code example method groups the items into a single group if 
the callback is not specified.It creates an array of numbers and calls 
the groupBy method on it without specifying the callback function.\
The expected result is an array with a single sub-array that contains all the numbers.
```typescript
 const items: number[] = [1, 1, 2, 2, 2];
 const result: number[][] = items.groupBy();
 
 console.log(result);
```
#### Code produces the following output:
```
 [[1, 1], [2, 2, 2]]
```

###### Example #3
The following code example method groups the items into a single group 
if the callback is not specified. It creates an array of numbers and calls 
the groupBy method on it without specifying the callback function.\
The expected result is an array with a single sub-array that contains all 
the numbers.
```typescript
 const items: number[] = [1, 2, 3, 4, 5];
 const result: number[][] = items.groupBy(() => null);
 
 console.log(result);
```
#### Code produces the following output:
```
 [[1, 2, 3, 4, 5]]
```
###### Example #4
The following code example method returns an empty array if the input 
array is empty. It creates an empty array and calls the groupBy method on 
it with a callback function that groups the items based on whether they are
even or odd./
The expected result is an empty array since there are no items to group.
```typescript
 const items: number[] = [];
 const result: number[][] = items.groupBy(item => item % 2 === 0);
 
 console.log(result);
```
#### Code produces the following output:
```
 []
```


***
### SortBy

Sorts an array in ascending order.
```typescript
 /**
 * @param keySelector1..keySelectorN - A function to extract the key for each element.
 */
sortBy<TKey1, TKey2, TKey3, TKey4, TKey5, TKey6>(keySelector1?: ((item: T) => TKey1) | null,
    keySelector2?: ((item: T) => TKey2) | null,
    keySelector3?: ((item: T) => TKey3) | null,
    keySelector4?: ((item: T) => TKey4) | null,
    keySelector5?: ((item: T) => TKey5) | null,
    keySelector6?: ((item: T) => TKey6) | null): void;
```
#### Examples

###### Example #1
Array is sorted in ascending order by default when the "sortBy" method is 
called with only one sorting function.

```typescript
 const people: Person[] = [
    { name: "Theodore", age: 30 },
    { name: "Lucas", age: 25 },
    { name: "Mia", age: 35 },
    { name: "Charlotte", age: 40 },
 ];

 people.sortBy(person => person.age);

 console.log(people);
```
#### Code produces the following output:
```
[
    { name: "Lucas", age: 25 },
    { name: "Theodore", age: 30 },
    { name: "Mia", age: 35 },
    { name: "Charlotte", age: 40 },
]
```
###### Example #2
Array is sorted in ascending order by the first "key"
when the "sortBy" method is called with two sorting functions.
```typescript
 const people: Person[] = [
    { name: "Theodore", age: 30 },
    { name: "Lucas", age: 25 },
    { name: "Mia", age: 35 },
    { name: "Charlotte", age: 40 },
 ];

 people.sortBy(person => person.name, person => person.age);
 
 console.log(people);
```
#### Code produces the following output:
```
[
    { name: "Charlotte", age: 40 },
    { name: "Lucas", age: 25 },
    { name: "Mia", age: 35 },
    { name: "Theodore", age: 30 },
]
```

###### Example #3
Array is sorted in ascending order by the second "key"
when the "sortBy" method is called with a "null" first sorting function
and a second sorting function.
```typescript
 const people: Person[] = [
    { name: "Theodore", age: 30 },
    { name: "Lucas", age: 25 },
    { name: "Mia", age: 35 },
    { name: "Charlotte", age: 40 },
 ];

 people.sortBy(null, person => person.name);
 
 console.log(people);
```
#### Code produces the following output:
```
 [
    { name: "Charlotte", age: 40 },
    { name: "Lucas", age: 25 },
    { name: "Mia", age: 35 },
    { name: "Theodore", age: 30 },
]
```
###### Example #4
Array of dates is sorted in ascending order.
```typescript
 const date0 = new Date(Date.UTC(2023, 0, 0));
 const date1 = new Date(Date.UTC(2023, 0, 1));
 const date2 = new Date(Date.UTC(2023, 0, 2));
 const date3 = new Date(Date.UTC(2023, 1, 2));
 const date4 = new Date(Date.UTC(2023, 1, 3));
 const date5 = new Date(Date.UTC(2024, 1, 3));
 const date6 = new Date(Date.UTC(2025, 0, 0));

 const items: Date[] = [date1, date0, date2, date3, date6, date5, date4];
 
 items.sortBy();
 
 console.log(items);
```
#### Code produces the following output:
```
 [date0, date1, date2, date3, date4, date5, date6]
```
### ForEachAsync
Documentation is under construction and upcoming soon.\
<i>Use the built-in code comment instead.</i>
### WhereAsync
Documentation is under construction and upcoming soon.\
<i>Use the built-in code comment instead.</i>

## Hashtags

#linq #language-integrated-query #ts #typescripts #array-extension #collection-extension #npm #github