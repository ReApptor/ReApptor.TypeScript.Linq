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

    test('addMonthsByDate', function () {
        const date = new Date(2020, 0, 1, 0, 0, 0, 0);
        const expected = new Date(2020, 2, 1, 0, 0, 0, 0);
        
        const result: Date = Utility.addMonths(date, 2);

        expect(result).toStrictEqual(expected);
    });
    
    test('addMonthsByString', function () {
        const date = new Date("2020-01-01");
        
        const result: Date = Utility.addMonths(new Date(date), 2);
        
        expect(result).toStrictEqual(new Date("2020-03-01"));
    });
    
    test('getDaysInMonth', function () {
        const result: number = Utility.getDaysInMonth(new Date(2020, 1, 1));
        
        expect(result).toBe(29);
    });

    test('getUtcDateByDate', function () {
        const expected: Date = new Date(Date.UTC(2020, 0, 1));
        
        const result = Utility.asUtc(new Date(2020, 0, 1));

        expect(result).toStrictEqual(expected);
    });
    
    test('getUtcDateByString', function () {
        const expected = new Date("2020-01-01");
        
        const result = Utility.asUtc(new Date(2020, 0, 1));
        
        expect(result).toStrictEqual(expected);
    });
    
    test('getToday', function () {
        const expected: Date = new Date();
        expected.setHours(0, 0, 0, 0);
        
        const result = Utility.today();
        
        expect(result).toStrictEqual(expected);
    });
    
    test('getTomorrow', function () {
        const expected: Date = new Date().addDays(1);
        expected.setHours(0, 0, 0, 0);
        
        const result = Utility.tomorrow();
        
        expect(result).toStrictEqual(expected);
    });
});

describe('inInterval', function() {
    test('dateInputs', function () {
        const date: Date = new Date(2020, 5, 1);
        const fromDate: Date = new Date(2020, 0, 1);
        const toDate: Date = new Date();

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(true);
    });

    test('stringInputs', function () {
        const date: string = "2020-06-01";
        const fromDate: string = "2020-01-01";
        const toDate: string = "2020-12-01";

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(true);
    });

    test('dateAndStringInputs', function () {
        const date: Date = new Date(2020, 5, 1);
        const fromDate: string = "2020-01-01";
        const toDate: string = "2020-12-01";

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(true);
    });

    test('dateInputs-fromDateIsNull', function () {
        const date: Date = new Date(2020, 5, 1);
        const fromDate = null;
        const toDate: Date = new Date();

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(true);
    });

    test('stringInputs-fromDateIsNull', function () {
        const date: string = "2020-06-01";
        const fromDate = null;
        const toDate: string = "2020-12-01";

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(true);
    });

    test('dateInputs-fromDateIsUndefined', function () {
        const date: Date = new Date(2020, 5, 1);
        const fromDate = undefined;
        const toDate: Date = new Date();

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(true);
    });

    test('stringInputs-fromDateIsUndefined', function () {
        const date: string = "2020-06-01";
        const fromDate = undefined;
        const toDate: string = "2020-12-01";

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(true);
    });

    test('dateInputs-toDateIsNull', function () {
        const date: Date = new Date(2020, 5, 1);
        const fromDate: Date = new Date(2020, 0, 1);
        const toDate = null;

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(true);
    });

    test('stringInputs-toDateIsNull', function () {
        const date: string = "2020-06-01";
        const fromDate: string = "2020-06-01";
        const toDate = null;

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(true);
    });

    test('dateInputs-toDateIsUndefined', function () {
        const date: Date = new Date(2020, 5, 1);
        const fromDate: Date = new Date(2020, 0, 1);
        const toDate = undefined;

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(true);
    });

    test('stringInputs-toDateIsUndefined', function () {
        const date: string = "2020-06-01";
        const fromDate: string = "2020-06-01";
        const toDate = undefined;

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(true);
    });

    test('dateInputs-fromAndToDatesAreNull', function () {
        const date: Date = new Date("2020-06-01");
        const fromDate = null;
        const toDate = null;

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(true);
    });

    test('stringInputs-fromAndToDatesAreNull', function () {
        const date: string = "2020-06-01";
        const fromDate = null;
        const toDate = null;

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(true);
    });

    test('dateInputs-fromAndToDatesAreUndefined', function () {
        const date: Date = new Date("2020-06-01");
        const fromDate = undefined;
        const toDate = undefined;

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(true);
    });

    test('stringInputs-fromAndToDatesAreUndefined', function () {
        const date: string = "2020-06-01";
        const fromDate = undefined;
        const toDate = undefined;

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(true);
    });

    test('dateInputs-dateOutOfRange', function () {
        const date: Date = new Date(2019, 5, 1);
        const fromDate: Date = new Date(2020, 0, 1);
        const toDate: Date = new Date();

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(false);
    });

    test('stringInputs-dateOutOfRange', function () {
        const date: string = "2021-06-01";
        const fromDate: string = "2020-01-01";
        const toDate: string = "2020-12-01";

        const result = Utility.inInterval(date, fromDate, toDate);

        expect(result).toStrictEqual(false);
    });
});

describe('inFuture', function() {
    test('dateInput', function () {
        const dateInFuture: Date = Utility.addDays(new Date(), 1);

        const result = Utility.inFuture(dateInFuture);

        expect(result).toBe(true);
    });
    
    test('stringInput', function () {
        const dateInFuture: string = Utility.addDays(new Date(), 1).toString();

        const result = Utility.inFuture(dateInFuture);

        expect(result).toBe(true);
    });
    
    test('emptyStringInput', function () {
        const dateInFuture: string = "";

        const result = Utility.inFuture(dateInFuture);

        expect(result).toBe(false);
    });
    
    test('inputIsNull', function () {
        const dateInFuture = null;

        const result = Utility.inFuture(dateInFuture);

        expect(result).toBe(false);
    });
});

describe('inPast', function() {
    test('dateInput', function () {
        const dateInFuture: Date = Utility.addDays(new Date(), -1);

        const result = Utility.inPast(dateInFuture);

        expect(result).toBe(true);
    });

    test('stringInput', function () {
        const dateInFuture: string = Utility.addDays(new Date(), -1).toString();

        const result = Utility.inPast(dateInFuture);

        expect(result).toBe(true);
    });

    test('emptyStringInput', function () {
        const dateInFuture: string = "";

        const result = Utility.inPast(dateInFuture);

        expect(result).toBe(false);
    });

    test('inputIsNull', function () {
        const dateInFuture = null;

        const result = Utility.inPast(dateInFuture);

        expect(result).toBe(false);
    });
});