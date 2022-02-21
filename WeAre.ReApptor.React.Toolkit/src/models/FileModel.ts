export default class FileModel {

    constructor(src: string | null = null) {
        this.src = src || "";
    }

    public id: string = "";

    public name: string = "";

    public size: number = 0;

    public type: string = "";
    
    public src: string = "";

    public description: string  | null = null;
    
    public lastModified: Date = new Date();
    
    public readonly isFileModel: boolean = true;
}