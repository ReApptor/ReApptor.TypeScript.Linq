import {BasePageDefinitions, BasePageParameters, PageRoute} from "@weare/reapptor-react-common";
import {Dictionary} from "typescript-collections";
import Tests from "./Tests/Tests";
import AuthorizedTest from "./AuthorizedTest/AuthorizedTest";
import AnonymousTestWithParameters, {IAnonymousParameters} from "./AnonymousTestWithParameters/AnonymousTestWithParameters";
import AuthorizedTestWithParameters, {IAuthorizedParameters} from "./AuthorizedTestWithParameters/AuthorizedTestWithParameters";
import SystemTests from "./SystemTests/SystemTests";

export default class PageDefinitions extends BasePageDefinitions {

    protected async require(pageContainer: string, pageName: string): Promise<any> {
        return await require(`./${pageContainer}${pageName}/${pageName}`);
    }

    // eslint-disable-next-line
    constructor() {
        super();
    }

    public getRoutes(): Dictionary<string, PageRoute> {

        const pageRoutes: Dictionary<string, PageRoute> = new Dictionary<string, PageRoute>()

        pageRoutes.setValue("Tests", PageDefinitions.tests);
        pageRoutes.setValue("test2", PageDefinitions.anonymous);
        pageRoutes.setValue("autoritari", PageDefinitions.authorized);
        pageRoutes.setValue("paranon", PageDefinitions.anonymousWithParams());
        pageRoutes.setValue("aupair", PageDefinitions.authorizedWithParams());

        return pageRoutes;
    }

    public static readonly tests: PageRoute = new PageRoute(nameof(Tests));

    public static readonly authorized: PageRoute = new PageRoute(nameof(AuthorizedTest));

    public static readonly systemTests: PageRoute = new PageRoute(nameof(SystemTests));

    public static readonly anonymous: PageRoute = PageDefinitions.tests;

    public static anonymousWithParams(params?: IAnonymousParameters): PageRoute {
        return new PageRoute(nameof(AnonymousTestWithParameters), null, null, params);
    }

    public static authorizedWithParams(params?: IAuthorizedParameters): PageRoute {
        return new PageRoute(nameof(AuthorizedTestWithParameters), null, null, params);
    }
}

new PageDefinitions();