import {BasePageDefinitions, PageRoute} from "@weare/athenaeum-react-common";

export default class PageDefinitions extends BasePageDefinitions {

    protected async require(pageContainer: string, pageName: string): Promise<any> {
        return await require(`./${pageContainer}${pageName}/${pageName}`);
    }

    // eslint-disable-next-line
    constructor() {
        super();
    }

    public static readonly testsRouteName: string = "Tests";

    public static readonly testsRoute: PageRoute = new PageRoute(PageDefinitions.testsRouteName);
}

new PageDefinitions();