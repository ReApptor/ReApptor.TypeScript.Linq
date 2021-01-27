
export default class Category {
    public id: string = "";

    public name: string = "";

    public icon: string = "";
    
    public parent: Category | null = null;

    public isCategory: boolean = true;
}