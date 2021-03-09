import {ArrayExtensions, TypeConverter, Utility} from "..";

ArrayExtensions();

describe("TypeConverter.toTitle", function() {
    
    interface ITitleModel {
        label: string;
        description: string;
    }
    
    class MyTitle implements ITitleModel {
        label: string = "MyTitle.label";
        description: string = "MyTitle.description";
    }
    
    class MyEntity {
        value1: string = "value1"; 
        value2: string = "value2";
        public isMyEntity: true = true;
    }
    
    class TransformProvider {
        constructor() {
            TypeConverter.addObjectConverter(nameof<ITitleModel>(), item => this.toTitle(item));
        }
        
        public toTitle(item: any): ITitleModel {

            let label: string | null = null;
            let description: string | null = null;

            if (item != null) {
                
                if ((item instanceof MyEntity) || (item as MyEntity).isMyEntity === true) {
                    return {
                        label: (item as MyEntity).value1,
                        description: (item as MyEntity).value2,
                    };
                }
                
                
                label = Utility.findStringValueByAccessor(item, ["label", "name"]);
                description = Utility.findStringValueByAccessor(item, ["description", "text"]);
            }

            return {
                description: description || "",
                label: label || ""
            };
        }
        
    }
    
    test("MyTitle", function () {
        new TransformProvider();
        
        const item = new MyTitle();
        const title: ITitleModel | null = TypeConverter.convert(item, nameof<ITitleModel>());

        expect(title).not.toBeNull();
        expect(title!.label).toBe("MyTitle.label");
        expect(title!.description).toBe("MyTitle.description");
    });
    
    test("MyEntity", function () {
        new TransformProvider();
        
        const item = new MyEntity();
        const title: ITitleModel | null = TypeConverter.convert(item, nameof<ITitleModel>());

        expect(title).not.toBeNull();
        expect(title!.label).toBe("value1");
        expect(title!.description).toBe("value2");
    });
    
});