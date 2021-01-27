
export default class CreateModuleRentRequest {
    public agreementModuleId: string = "";

    public from: Date = new Date();

    public to: Date = new Date();

    public price: number = 0;

    public extra: boolean = false;

    public parentModuleRentId: string | null = null;
}