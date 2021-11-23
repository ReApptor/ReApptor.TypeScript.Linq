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
        super();
    }

    public getRoutes(): Dictionary<string, PageRoute> {
        let pageRoutes: Dictionary<string, PageRoute> = new Dictionary<string, PageRoute>()
        pageRoutes.setValue("test2", PageDefinitions.testsRoute2)

        return pageRoutes;
    }

    public static readonly testsRoute2: PageRoute = new PageRoute(nameof(Tests2));

    public static readonly testsRoute: PageRoute = new PageRoute(nameof(Tests));

}

new PageDefinitions();