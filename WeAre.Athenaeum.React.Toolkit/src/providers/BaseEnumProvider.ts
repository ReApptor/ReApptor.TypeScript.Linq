import {ServiceProvider, IService, ServiceType, ILocalizer, ISelectListItem } from "..";

export interface IEnumProvider {
    isEnum(typeName: string): boolean;
    getEnumName(enumName: string, value: any): string;
    getEnumText(enumName: string, value: any): string;
    getEnumItem(enumName: string, value: any): ISelectListItem;
    getEnumItems(enumName: string, selectedValues: number[] | null, reverse: boolean): ISelectListItem[];
}

export default abstract class BaseEnumProvider<TSelectListItem extends ISelectListItem> implements IEnumProvider, IService {
    
    // #region Private/Protected

    private _localizer: ILocalizer | null = null;

    protected constructor() {
        ServiceProvider.addSingleton(this);
    }
    
    protected abstract get types(): readonly string[];
    
    protected abstract createSelectListItem(value: string, text: string, subtext: string): TSelectListItem;

    protected getEnumLocalizedName(enumType: string, enumName: string): string {
        return `Enum.${enumType}.${enumName}`;
    }

    protected getEnumLocalizedDescription(enumType: string, enumName: string): string {
        const itemName: string = `Enum.${enumType}.${enumName}.Description`;
        return (this.localizer.contains(itemName)) ? itemName : "";
    }

    protected transform(enumSymbol: any, enumType: string, enumValue: any): TSelectListItem {
        const value: number = enumValue as number;
        const enumName: string = enumSymbol[value];
        const text: string = this.getEnumLocalizedName(enumType, enumName);
        const subtext: string = this.getEnumLocalizedDescription(enumType, enumName);
        return this.createSelectListItem(value.toString(), text, subtext);
    }

    protected getItems(enumSymbol: any, enumType: string, reverse: boolean = false): TSelectListItem[] {
        const items: number[] = this.getValues(enumSymbol, reverse);
        return items.map(value => this.transform(enumSymbol, enumType, value));
    }

    protected get localizer(): ILocalizer {
        if (this._localizer == null) {
            this._localizer = ServiceProvider.findLocalizer();
            if (this._localizer == null)
                throw new Error("EnumHelper. Localizer is not registered.");
        }
        return this._localizer!;
    }
    
    // #endregion

    public getType(): ServiceType {
        return nameof<IEnumProvider>();
    }

    public getEnumItems(enumName: string, selectedValues: number[] | null = null, reverse: boolean = false): TSelectListItem[] {
        
        const functionName: string = `get${enumName}Items`;
        const getter: ((reverse: boolean) => (TSelectListItem[])) | null | undefined = (this as any)[functionName] as ((reverse: boolean) => TSelectListItem[]) | null | undefined;
        
        const items: TSelectListItem[] = (getter)
            ? getter.call(this, reverse)
            : [];

        if ((selectedValues != null) && (selectedValues.length > 0) && (items.length > 0)) {
            selectedValues.forEach((value) => {
                const selectedItem: TSelectListItem | undefined = items.find(item => item.value == value.toString());
                if (selectedItem) {
                    selectedItem.selected = true;
                }
            });
        }

        return items;
    }

    public getEnumItem(enumName: string, value: any): TSelectListItem {
        const values: TSelectListItem[] = this.getEnumItems(enumName);
        const enumValue: string = (value as number).toString();
        const item: TSelectListItem | null = values.find(item => item.value == enumValue) || null;

        if (item == null)
            throw Error(`EnumHelper. Localization item for enum "${enumName}" cannot be found.`);

        return item;
    }

    public getEnumText(enumName: string, value: any): string {
        const item: TSelectListItem = this.getEnumItem(enumName, value);
        return this.localizer.get(item.text);
    }

    public getEnumName(enumName: string, value: any): string {
        return this.getEnumItem(enumName, value).text;
    }

    public isEnum(typeName: string) {
        return this.types.includes(typeName);
    }

    public getValues(enumSymbol: any, reverse: boolean = false): number[] {
        let items: any[] = Object.values(enumSymbol);
        if (reverse) {
            items = items.reverse();
        }
        return items
            .filter(value => !isNaN(value))
            .map(value => value as number);
    }
}