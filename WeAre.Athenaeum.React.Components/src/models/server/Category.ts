import {IBreadCrumbItem} from "@/pages/RentaTasks/AddEquipment/BreadCrumb/BreadCrumb";

export default class Category implements IBreadCrumbItem {
    public id: string = "";

    public name: string = "";

    public icon: string = "";
    
    public parent: Category | null = null;
    
    public parentId: string | null = null;

    public isCategory: boolean = true;
    
    constructor(id: string = "", name: string = "", icon: string = "", parent: Category | null = null) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.parent = parent;
    }
}