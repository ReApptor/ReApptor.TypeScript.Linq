import {BasePageDefinitions, PageRoute} from "@weare/athenaeum-react-common";

export default class PageDefinitions extends BasePageDefinitions {

    protected async require(pageContainer: string, pageName: string): Promise<any> {
        //pageName += "Page";
        return await require(`../pages/${pageContainer}${pageName}/${pageName}`);
    }

    constructor() {
        super();
    }

    public static readonly testsRouteName: string = "Tests";

    public static readonly testsRoute: PageRoute = new PageRoute(PageDefinitions.testsRouteName);
}

new PageDefinitions();