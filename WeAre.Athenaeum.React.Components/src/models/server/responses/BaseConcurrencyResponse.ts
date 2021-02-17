import User from "@/models/server/User";

export default class BaseConcurrencyResponse {

    public concurrency: boolean = false;
    
    public concurrencyBy: User | null = null;
    
    public concurrencyAt: Date | null = null;
}