import React from "react";
import {Dictionary} from "typescript-collections";
import {IService, ServiceProvider, ServiceType} from "@weare/athenaeum-toolkit";
import PageRoute from "../models/PageRoute";
import {IBasePage, IBasePageConstructor} from "../base/BasePage";

export interface IPageDefinitions {
    createPageAsync(route: PageRoute): Promise<IBasePage>;
    render(page: IBasePage, ref: React.RefObject<IBasePage>): React.ReactElement;
}

export default abstract class BasePageDefinitions implements IPageDefinitions, IService {

    private static readonly _pages: Dictionary<string, IBasePageConstructor> = new Dictionary<string, IBasePageConstructor>();
    private static readonly _modules: Dictionary<string, any> = new Dictionary<string, any>();
    
    private async register(pageName: string): Promise<IBasePageConstructor> {

        const fullPageName: string = pageName;

        if (BasePageDefinitions._pages.containsKey(fullPageName)) {
            return BasePageDefinitions._pages.getValue(fullPageName) as IBasePageConstructor;
        }

        const pageNameItems: string[] = pageName.split("/");
        let pageContainer = "";
        if (pageNameItems.length > 1) {
            pageContainer = pageNameItems.slice(0, pageNameItems.length - 1).join("/") + "/";
            pageName = pageNameItems[pageNameItems.length - 1];
        }

        //const module: any = await require(`../pages/${pageContainer}${pageName}/${pageName}`);
        const module: any = await this.require(pageContainer, pageName);

        const constructor: IBasePageConstructor = module.default as IBasePageConstructor;

        BasePageDefinitions._pages.setValue(fullPageName, constructor);

        BasePageDefinitions._modules.setValue(fullPageName, module);

        return constructor;
    }

    protected constructor() {
        ServiceProvider.addSingleton(this);
    }

    public getType(): ServiceType {
        return "IPageDefinitions";
    }
    
    protected abstract async require(pageContainer: string, pageName: string): Promise<any>;

    public static readonly logoutRouteName: string = "Logout";

    public static readonly logoutRoute: PageRoute = new PageRoute(BasePageDefinitions.logoutRouteName);

    public static readonly dummyRouteName: string = "Dummy";

    public static readonly dummyRoute: PageRoute = new PageRoute(BasePageDefinitions.dummyRouteName);
    
    public static readonly offlineRouteName: string = "Offline";

    public static readonly offlineRoute: PageRoute = new PageRoute(BasePageDefinitions.offlineRouteName);
    
    public static readonly errorRouteName: string = "Error";

    public static readonly errorRoute: PageRoute = new PageRoute(BasePageDefinitions.errorRouteName);

    public async createPageAsync(route: PageRoute): Promise<IBasePage> {

        console.log("BasePageDefinitions.createPageAsync: route=", route);
        
        const pageName: string = route.name;

        try {
            const pageConstructor: IBasePageConstructor = await this.register(pageName);

            const props: any = {
                parameters: route.parameters,
                routeIndex: route.index,
                routeId: route.id,
                routeName: pageName
            };

            return new pageConstructor(props);
        } catch (e) {
            throw Error(`Unknown route "${pageName}", module or page component cannot be found. ${e}`);
        }
    }

    public render(page: IBasePage, ref: React.RefObject<IBasePage>): React.ReactElement {

        const pageName: string = page.routeName;
        const routeIndex: number | null = page.routeIndex;
        const routeId: string | null = page.routeId;
        const key: string = `${pageName}:${page.routeIndex}:${page.routeId}`;

        const props: any = {
            ref: ref,
            key: key,
            parameters: page.parameters,
            routeIndex: routeIndex,
            routeId: routeId,
            routeName: pageName
        };

        const module: any = BasePageDefinitions._modules.getValue(pageName);

        const element: React.ReactElement = React.createElement(module.default, props);

        return element;
    }
}