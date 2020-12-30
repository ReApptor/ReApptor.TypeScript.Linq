export default class ServerError {
    
    public requestId: string;
    
    public debugDetails?: string;

    constructor(requestId: string) {
        this.requestId = requestId;
    }
}