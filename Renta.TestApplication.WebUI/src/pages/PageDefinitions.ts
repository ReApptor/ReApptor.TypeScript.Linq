import {BasePageDefinitions, PageRoute} from "@weare/athenaeum-react-common";
import {IBasePage} from "@weare/athenaeum-react-common/lib/types/src/base/BasePage";

export default class PageDefinitions extends BasePageDefinitions {

    protected async require(pageContainer: string, pageName: string): Promise<any> {
        return await require(`./${pageContainer}${pageName}/${pageName}`);
    }

    constructor() {
        super();
    }

    public static readonly testsRouteName: string = "Tests";

    public static readonly testsRoute: PageRoute = new PageRoute(PageDefinitions.testsRouteName);
}

new PageDefinitions();