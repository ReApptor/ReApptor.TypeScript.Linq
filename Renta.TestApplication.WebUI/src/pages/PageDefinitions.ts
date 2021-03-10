import {BasePageDefinitions, PageRoute} from "@weare/athenaeum-react-common";
import {IBasePage} from "@weare/athenaeum-react-common/lib/types/src/base/BasePage";

export default class PageDefinitions extends BasePageDefinitions {

    public createPageAsync(route: PageRoute): Promise<IBasePage> {
        console.log("PageDefinitions.createPageAsync: route=", route);
        return super.createPageAsync(route);
    }

    protected async require(pageContainer: string, pageName: string): Promise<any> {
        console.log("PageDefinitions.require: pageContainer=", pageContainer, "pageName=", pageName);
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