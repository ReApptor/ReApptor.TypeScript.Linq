import Warehouse from "./Warehouse";
import ConstructionSite from "./ConstructionSite";

export default class FavoriteItem {
    public favorite: boolean = false;

    public constructionSite: ConstructionSite | null = null;

    public warehouse: Warehouse | null = null;

    public isFavoriteItem: boolean = true;
}