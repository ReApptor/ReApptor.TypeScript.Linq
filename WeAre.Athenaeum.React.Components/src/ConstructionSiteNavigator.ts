import {ch, IBasePage, PageRoute} from "@weare/athenaeum-react-common";
import ConstructionSitesFilters from "@/models/server/ConstructionSitesFilters";
import ConstructionSite from "@/models/server/ConstructionSite";
import PageDefinitions from "@/providers/PageDefinitions";

export default class ConstructionSiteNavigator {
    
    private static _initialized: boolean = false;
    private static _filters: ConstructionSitesFilters | null = null;
    
    private static initialize(): void {
        if (!this._initialized) {
            this._initialized = true;
            
            const json: string | null = window.localStorage.getItem(this.key);
            this._filters = (json) ? JSON.parse(json) : null;
        }
    }

    private static get key(): string {
        return `$RentaPro20.${ch.getSessionId()}.constructionSiteNavigator`;
    }

    public static managementRoute(constructionSite: ConstructionSite | string): PageRoute {
        const constructionSiteId: string = (typeof constructionSite === "string")
            ? constructionSite
            : constructionSite.id;

        if (this.filters != null) {
            const page: IBasePage = ch.getPage();

            const keepFilters: boolean = (page.routeName === PageDefinitions.constructionSitesRouteName) || (page.routeName === PageDefinitions.constructionSiteManagementRouteName);

            if (!keepFilters) {
                this.clearFilters();
            }
        }

        return new PageRoute(PageDefinitions.constructionSiteManagementRouteName, null, constructionSiteId);
    }

    public static clearFilters(): void {
        this.filters = null;
    }
    
    public static get filters(): ConstructionSitesFilters | null {
        this.initialize();
        return this._filters;
    }
    
    public static set filters(value: ConstructionSitesFilters | null) {
        this._filters = value;
        this.index = 0;
        this.totalItemCount = 0;
        const json: string = (value) ? JSON.stringify(value) : "";
        window.localStorage.setItem(this.key, json);
    }
    
    public static get hasFilters(): boolean {
        return (this._filters != null);
    }

    public static index: number = 0;
    
    public static totalItemCount: number = 0;
}