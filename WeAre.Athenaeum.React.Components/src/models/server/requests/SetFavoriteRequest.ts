export default class SetFavoriteRequest {
    public id: string = "";
    
    public favorite: boolean = false;
    
    constructor(id: string = "", favorite: boolean = false) {
        this.id = id;
        this.favorite = favorite;
    }
}