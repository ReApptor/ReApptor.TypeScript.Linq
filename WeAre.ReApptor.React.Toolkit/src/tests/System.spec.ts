
describe("system", function() {

    interface MyInterface {
    }

    class MyClass {
    }

    test("nameof.interface", function () {
        const name: string = nameof<MyInterface>();
        expect(name).toBe("MyInterface");
    });

    test("nameof.class", function () {
        const name: string = nameof(MyClass);
        expect(name).toBe("MyClass");
    });

});
