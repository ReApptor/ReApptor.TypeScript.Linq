import {BoolUtility, ISelectListItem, NumberUtility, StringUtility} from "@weare/athenaeum-toolkit";

/**
 /* Represents the optgroup HTML element and its attributes.
 /* In a select list, multiple groups with the same name are supported.
 /* They are compared with reference equality.
 */
export class SelectListGroup {
    private __lowerName: string | null = null;

    /**
     * Gets or sets a value that indicates whether this is disabled.
     */
    public disabled: boolean = false;

    /**
     /* Represents the value of the optgroup's label.
     */
    public name: string = "";
    
    public order: number = 0;

    public get isSelectListGroup(): boolean { return true; }

    public get lowerName(): string {
        if (this.__lowerName == null) {
            return (this.__lowerName = (this.name || "").toLowerCase());
        }
        return this.__lowerName;
    }

    public static compare(x: SelectListGroup | null, y: SelectListGroup | null): number {
        if (x === y) {
            return 0;
        }
        if ((x == null) && (y == null)) {
            return 0;
        }
        if (y == null) {
            return 1;
        }
        if (x == null) {
            return -1;
        }
        return (StringUtility.compare(x.lowerName, y.lowerName));
    }

    public static isEqual(x: SelectListGroup | null, y: SelectListGroup | null) {
        return (this.compare(x, y) === 0);
    }

    public static create(name: string, disabled: boolean = false): SelectListGroup {
        const item = new SelectListGroup();
        item.name = name || "";
        item.disabled = disabled;
        return item;
    }
}

/**
 * Represent an item in a <see cref="T:Microsoft.AspNetCore.Mvc.Rendering.SelectList" /> or <see cref="T:Microsoft.AspNetCore.Mvc.Rendering.MultiSelectList" />.
 * This class is typically rendered as an HTML <code>&lt;option&gt;</code> element with the specified
 * attribute values.
 */
export class SelectListItem implements ISelectListItem {
    private __lowerText: string | null = null;
    private __lowerSubtext: string | null = null;
    
    constructor(value: string | null = null, text: string | null = null, subtext: string | null = null, ref: any = null) {
        this.value = value || "";
        this.text = text || "";
        this.subtext = subtext || "";
        this.ref = (ref != null) ? ref : this;
    }

    /**
     * Gets or sets a value that indicates whether this SelectListItem is disabled.
     * This property is typically rendered as a <code>disabled="disabled"</code> attribute in the HTML
     */
    public disabled: boolean = false;

    /**
     * Gets or sets a value that indicates whether this SelectListItem is selected.
     * This property is typically rendered as a <code>disabled="disabled"</code> attribute in the HTML
     */
    public selected: boolean = false;

    /**
     * Gets or sets a value that indicates the display text of this <see cref="T:Microsoft.AspNetCore.Mvc.Rendering.SelectListItem" />.
     * This property is typically rendered as the inner HTML in the HTML <code>&lt;option&gt;</code> element.
     */
    public text: string = "";

    public subtext: string = "";

    /**
     * Gets or sets a value that indicates the value of this <see cref="T:Microsoft.AspNetCore.Mvc.Rendering.SelectListItem" />.
     * This property is typically rendered as a <code>value="..."</code> attribute in the HTML
     */
    public value: string = "";

    public favorite: boolean = false;

    /**
     * Represents the optgroup HTML element this item is wrapped into.
     * In a select list, multiple groups with the same name are supported.
     * They are compared with reference equality.
     */
    public group: SelectListGroup | null = null;

    public ref: any = this;

    public isSelectListItem: boolean = true;

    public get lowerText(): string {
        if (this.__lowerText == null) {
            return (this.__lowerText = (this.text || "").toLowerCase());
        }
        return this.__lowerText!;
    }

    public get lowerSubtext(): string {
        if (this.__lowerSubtext == null) {
            return (this.__lowerSubtext = (this.subtext || "").toLowerCase());
        }
        return this.__lowerSubtext!;
    }

    private static readonly Group = (x: SelectListItem, y: SelectListItem, groupSelected: boolean = false): number => {
        let result: number = 0;
        if (groupSelected) {
            const xSelected: boolean = x.selected;
            const ySelected: boolean = y.selected;
            result = BoolUtility.compare(xSelected, ySelected, true);
        }
        if (result === 0) {
            const xFavorite: boolean = x.favorite;
            const yFavorite: boolean = y.favorite;
            result = BoolUtility.compare(xFavorite, yFavorite, true);
            if (result === 0) {
                const xGroupOrder = (x.group != null) ? x.group.order : -1;
                const yGroupOrder = (y.group != null) ? y.group.order : -1;
                result = NumberUtility.compare(xGroupOrder, yGroupOrder);
                if (result === 0) {
                    const xGroupName = (x.group != null) ? x.group.lowerName : "";
                    const yGroupName = (y.group != null) ? y.group.lowerName : "";
                    result = StringUtility.compare(xGroupName, yGroupName);
                }
            }
        }
        return result;
    };

    public static readonly CompareByName = (x: SelectListItem, y: SelectListItem, groupSelected: boolean = false): number => {
        let result: number = SelectListItem.Group(x, y, groupSelected);
        if (result === 0) {
            result = StringUtility.compare(x.lowerText, y.lowerText);
        }
        return result;
    };

    public static readonly CompareByValue = (x: SelectListItem, y: SelectListItem, groupSelected: boolean = false): number => {
        let result: number = SelectListItem.Group(x, y, groupSelected);
        if (result === 0) {
            result = StringUtility.compare(x.value, y.value);
        }
        return result;
    };

    public static readonly CompareByGroup = (x: SelectListItem, y: SelectListItem, groupSelected: boolean = false): number => {
        return SelectListItem.Group(x, y, groupSelected);
    };

    public static isEqual(x: SelectListItem | null, y: SelectListItem | null): boolean {

        if (x === y) {
            return true;
        }
        if ((x == null) && (y == null)) {
            return true;
        }
        if ((x == null) || (y == null)) {
            return false;
        }

        return (this.CompareByValue(x, y) === 0);
    }

    public static is(item: any | any[]): boolean {
        return (item != null)
            ? (Array.isArray(item))
                ? (item.length > 0) && (item[0] != null) && (SelectListItem.is(item[0]))
                : ((item instanceof SelectListItem) || ((item as any).isSelectListItem === true))
            : false;
    }
}

export class StatusListItem extends SelectListItem {

    constructor(lineThrough: boolean = false, completed: boolean = false, value: string | null = null, text: string | null = null, subtext: string | null = null, ref: any = null) {
        super(value, text, subtext, ref);
        
        this.lineThrough = lineThrough;
        this.completed = completed;
    }

    public completed: boolean = false;

    public lineThrough: boolean = false;

    public isStatusListItem: boolean = true;
}

export class SelectListSeparator extends SelectListItem {
    SelectListSeparator() {
        this.value = "";
        this.selected = true;
    }
    
    public isSelectListSeparator: boolean = true;
}