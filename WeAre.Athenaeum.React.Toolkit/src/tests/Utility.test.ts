import Utility from "../Utility";

describe('roundTests', function() {
    test('roundUp', function () {
        const result: number = Utility.round(5.678, 2);
        expect(result).toBe(5.68);
    });
    test('roundDown', function () {
        const result: number = Utility.round(5.432, 2);
        expect(result).toBe(5.43);
    });
});

describe('dateTests', function() {
    test('getDayOfWeekFromNumber', function () {
        const date = 1;
        const result: string = Utility.getDayOfWeek(date);
        expect(result).toBe("Monday");
    });

    test('getDayOfWeekFromDate', function () {
        const date = new Date(2020, 0, 1);
        const result: string = Utility.getDayOfWeek(date);
        expect(result).toBe("Wednesday");
    });

    test('getDayOfWeekFromString', function () {
        const date = "2020-01-03";
        const result: string = Utility.getDayOfWeek(date);
        expect(result).toBe("Friday");
    });
    
    test('addDays', function () {
        const date: Date = Utility.addDays(new Date("2020-01-01"), 2);
        const result = new Date("2020-01-03");
        expect(result).toStrictEqual(date);
    });
    
    test('addMonthsByString', function () {
        const date = "2020-01-01";
        const result: Date = Utility.addMonths(new Date(date), 2);
        expect(result).toStrictEqual(new Date("2020-03-01"));
    });
    
    //TODO: Investigate and fix
    // test('addMonthsByDate', function () {
    //     const date = new Date(2020, 0, 1, 0, 0, 0, 0);
    //     const result: Date = Utility.addMonths(date, 2);
    //     expect(result).toStrictEqual(new Date("2020-03-01"));
    // });
    
    test('getDaysInMonth', function () {
        const result: number = Utility.getDaysInMonth(new Date(2020, 1, 1));
        expect(result).toBe(29);
    });
});