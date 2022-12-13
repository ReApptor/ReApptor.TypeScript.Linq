
describe("system", function() {

    interface MyInterface {
    }

    test("nameof", function () {
        const name: string = nameof<MyInterface>();
        expect(name).toBe("MyInterface");
    });

});
