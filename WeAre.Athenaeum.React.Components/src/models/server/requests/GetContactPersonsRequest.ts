
export default class GetContactPersonsRequest {
    public constructionSiteId: string = "";
    
    constructor(constructionSiteId: string) {
        this.constructionSiteId = constructionSiteId;
    }
}