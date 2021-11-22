import {BasePageDefinitions, PageRoute} from "@weare/athenaeum-react-common";
import {Dictionary} from "typescript-collections";
import Tests from "./Tests/Tests";
import Tests2 from "./Tests2/Tests2";

export default class PageDefinitions extends BasePageDefinitions {

    
    protected async require(pageContainer: string, pageName: string): Promise<any> {
        return await require(`./${pageContainer}${pageName}/${pageName}`);
    }

    // eslint-disable-next-line
    constructor() {
        let pageRoutes: Map<string, PageRoute> = new Map<string, PageRoute>()
        pageRoutes.set("test2", PageDefinitions.testsRoute2)

        super(pageRoutes);
    }

    public static readonly testsRoute2: PageRoute = new PageRoute(nameof(Tests2));

    public static readonly testsRoute: PageRoute = new PageRoute(nameof(Tests));
    
    
    // public static override getRoutes(): Map<string, PageRoute> | null | any {
    //     let routes: Map<string, PageRoute> = new Map<string, PageRoute>()
    //     routes.set("jep", PageDefinitions.testsRoute)
    //
    //     return routes;
    // }

}

new PageDefinitions();