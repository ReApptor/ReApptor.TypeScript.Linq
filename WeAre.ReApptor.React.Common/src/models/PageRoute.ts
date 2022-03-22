import BasePageParameters from "./BasePageParameters";
import {ILocalizer, ServiceProvider, Utility} from "@weare/reapptor-toolkit";

export default class PageRoute {

    /**
     * Name of the route. Unlocalized.
     */
    public name: string;

    public index: number | null;

    /**
     * Id of the route.
     */
    public id: string | null;

    /**
     * Parameters of the route.
     */
    public parameters: BasePageParameters | null;

    public isPageRoute: true = true;

    constructor(name: string, index: number | null = null, id: string | null = null, parameters: BasePageParameters | null = null) {
        this.name = name;
        this.index = index;
        this.id = id;
        this.parameters = parameters;
        this.isPageRoute = true;
    }

    /**
     * Convert a {@link PageRoute} to a relative path.
     *
     * @param route Route to convert to a path.
     */
    public static toRelativePath(route: PageRoute): string {

        let path: string = "/";

        const localizer: ILocalizer | null = ServiceProvider.findLocalizer();

        const localizedRouteKey: string = `PageRoutes.${route.name}`;

        const pageName: string = (localizer?.contains(localizedRouteKey, localizer?.language))
            ? localizer.get(localizedRouteKey)
            : route.name;

        // "/pageName"
        path += pageName;

        // Id can only be set in non-root pages, as otherwise it would be considered as the page name.
        if (pageName && route.id) {

            // "/pageName/id"
            path += `/${route.id}`;
        }

        if (route.parameters) {

            let query: string = "";

            //Querystring.stringify had a problem with parameters object so had to do it this way
            for (const [key, value] of Object.entries(route.parameters)) {

                const improper: boolean = (!key)
                    || (typeof value === "function")
                    || (typeof value === "symbol");

                if (improper) {
                    continue;
                }

                if (query) {
                    query += "&";
                }

                const properValue: string = (typeof value === "object")
                    ? JSON.stringify(value)
                    : value;

                query += `${key}=${properValue}`
            }

            if (query) {

                // "/pageName{/id}?query=query&query=query"
                path += `?${query}`;
            }
        }

        return path;
    }
    
    public static normalize(route: PageRoute | null): void {
        if (!route) {
            return;
        } 
        
        //Ensure that the default values are null.
        
        if (!route.id) {
            route.id = null;
        }
        
        if (!route.parameters || route.parameters == {}){
            route.parameters = null;
        }
    }

    public static isEqual(x: PageRoute | null, y: PageRoute | null): boolean {

        if (x === y) {
            return true;
        }
        if ((x == null) && (y == null)) {
            return true;
        }
        if ((x == null) || (y == null)) {
            return false;
        }
        if (x.name !== y.name) {
            return false;
        }
        if (x.index !== y.index) {
            return false;
        }
        if (x.id !== y.id) {
            return false;
        }
        if ((x.parameters == null) && (y.parameters == null)) {
            return true;
        }

        if (Utility.getHashCode(x.parameters) != Utility.getHashCode(y.parameters)) {
            return false;
        }

        return true;
    }
}