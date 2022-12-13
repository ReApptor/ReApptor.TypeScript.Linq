import {ArrayExtensions} from "../index";

ArrayExtensions();

class PetOwner
{
    constructor(name: string, pets: string[]) {
        this.name = name;
        this.pets = pets;
    }
    
    public name: string;
    public pets: string[];
}


describe('skip', function() {
    test("skip01from01", function () {
        const fruits: string[] = [ "apple", "banana", "mango", "orange", "passionfruit", "grape" ];

        const query = fruits.takeWhile(fruit => fruit != "orange");
        
        console.log(query);
    });
    
    test('skip0from0', function () {
        const result: number[] = [].skip(0);
        expect(result).toEqual([]);
    });
    
    test('skip-from0', function () {
        const result: number[] = [].skip(-1);
        expect(result).toEqual([]);
    });

    test('skip-1from2', function () {
        const result: number[] = [1, 2].skip(-1);
        expect(result).toEqual([1, 2]);
    });
    
    test('skip0from2', function () {
        const result: number[] = [1, 2].skip(0);
        expect(result).toEqual([1, 2]);
    });
    
    test('skip1from2', function () {
        const result: number[] = [1, 2].skip(1);
        expect(result).toEqual([2]);
    });
    
    test('skip2from2', function () {
        const result: number[] = [1, 2].skip(2);
        expect(result).toEqual([]);
    });

    test('skip3from2', function () {
        const result: number[] = [1, 2].skip(3);
        expect(result).toEqual([]);
    });
    
});
