import {ProductUnit} from "../Enums";
import Category from "./Category";
import {INumberFormat, NumberUtility} from "@weare/athenaeum-toolkit";
import {TFormat} from "@weare/athenaeum-toolkit/lib/types/src/providers/BaseTransformProvider";

export default class Product {
    public id: string = "";

    public name: string = "";

    public icon: string = "";
    
    public unit: ProductUnit = ProductUnit.Piece;
    
    public price: number = 0;

    public customUnit: string | null = null;
    
    public category: Category | null = null;
    
    public categoryId: string | null = null;
    
    public favorite: boolean | null = null;

    public isProduct: boolean = true;

    public static getStep(product: Product | null): number {
        return (product)
            ? (product.unit === (ProductUnit.Meter || ProductUnit.Kilometer || ProductUnit.Meter2 || ProductUnit.Liter))
                ? 0.1
                : 1
            : 0.01;
    }

    public static getFormat(product: Product | null): TFormat {
        const step: number = Product.getStep(product);
        const numberFormat: INumberFormat = NumberUtility.resolveFormat(step, null);
        return numberFormat.format;
    }
}