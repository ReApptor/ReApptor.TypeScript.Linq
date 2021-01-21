import React, {ErrorInfo} from "react";
import {AthenaeumConstants, ServiceProvider} from "@weare/athenaeum-toolkit";
import PageCacheProvider from "./PageCacheProvider";
import PageRoute from "../models/PageRoute";
import {IBasePage, ILayoutPage} from "../base/BasePage";
import ApiProvider from "./ApiProvider";
import ServerError from "../models/ServerError";
import ApplicationContext from "../models/ApplicationContext";
import ch from "./ComponentHelper";
import IErrorPageParameters from "../models/IErrorPageParameters";
import BasePageDefinitions, {IPageDefinitions} from "./BasePageDefinitions";

export default class PageRouteProvider {
    
    private static _initialized: boolean = false;
    private static _lastMessageHashCode: number = 0;

    private static initialize(): void {
        if (!this._initialized) {
            this._initialized = true;
            window.addEventListener("popstate", (e) => this.onPopStateAsync(e));
        }
    }

    private static async onPopStateAsync(e: PopStateEvent): Promise<void> {
        const route: PageRoute = e.state || BasePageDefinitions.dummyRouteName;
        await this.invokeRedirectAsync(route, null, true);
    }

    private static async logoutAsync(layout: ILayoutPage): Promise<void> {
        await layout.postAsync("api/Application/Logout", null);
    }

    private static async onRedirectAsync(route: PageRoute): Promise<void> {
        try {
            route.parameters = null;
            await ApiProvider.postAsync("api/Application/OnRedirect", route);
        } catch (e) {
            //no additional action needed, not critical
        }
    }

    private static async onJsErrorAsync(serverError: ServerError): Promise<void> {
        try {
            await ApiProvider.postAsync("api/Application/OnJsError", serverError);
        } catch (e) {
            //no additional action needed, not critical
        }
    }
    
    private static async invokeRedirectAsync(route: PageRoute, id: string | null = null, innerRedirect: boolean, replace: boolean = false, stopPropagation: boolean = false): Promise<IBasePage | null> {
        
        this.initialize();

        const context: ApplicationContext = ch.getContext();
        const current: IBasePage | null = ch.findPage();
        
        if (id) {
            route = {...route};
            route.id = id;
        }

        const newPage: boolean = ((current == null) || (current.routeName !== route.name) || (!PageRoute.isEqual(context.currentPage, route)));
        
        if (newPage) {
            
            if (route.name === BasePageDefinitions.dummyRouteName) {
                return current;
            }

            const layout: ILayoutPage = ch.getLayout();

            if (route.name === BasePageDefinitions.logoutRouteName) {
                await this.logoutAsync(layout);
                return current;
            }
            
            if (current != null) {
                await current!.hideAlertAsync();
            }

            const page: IBasePage = await this.createPageAsync(route);

            context.currentPage = route;

            await layout.setPageAsync(page);
            
            // if (current != null) {
            //     await current!.hideAlertAsync();
            // }
            
            if (!innerRedirect) {
                if (replace) {
                    window.history.replaceState(route, route.name);
                } else {
                    window.history.pushState(route, route.name);
                }
            }

            document.title = page.getTitle();

            if (route.name !== BasePageDefinitions.errorRouteName) {
                // clear cache
                PageCacheProvider.clear();
                // do not await, just notification event
                // noinspection ES6MissingAwait
                this.onRedirectAsync(route);
            }

            if (stopPropagation)
                throw new Error(AthenaeumConstants.apiError);

            return page;
        }

        return current;
    }

    public static async redirectAsync(route: PageRoute, replace: boolean = false, stopPropagation: boolean = false): Promise<IBasePage | null> {
        return await this.invokeRedirectAsync(route, null, false, replace, stopPropagation);
    }

    public static async changeUrlWithoutReload(newPath?: string | null) : Promise<void> {
        if (newPath == null) {
            newPath = "/";
        }
        window.history.replaceState(null, "", newPath);
    }
    
    public static async offline(): Promise<void> {
        await PageRouteProvider.redirectAsync(BasePageDefinitions.offlineRoute, true);
    }
    
    public static async error(serverError: ServerError): Promise<void> {
        // redirect to error page
        const route = new PageRoute(BasePageDefinitions.errorRouteName);
        route.parameters = { error: serverError } as IErrorPageParameters;
        await PageRouteProvider.redirectAsync(route, true);
    }

    public static async exception(error: Error, reactInfo: ErrorInfo | null = null): Promise<boolean> {
        if (!ApiProvider.isApiError(error)) {
            
            const page: IBasePage | null = ch.findPage();
            const pageRouteName: string = ((page) && (page.routeName)) ? page.routeName : ``;
            const componentStack: string = (reactInfo != null) ? reactInfo!.componentStack : "";
            const messageHashCode: number = `${pageRouteName}:${componentStack}:${error.stack}:${error.message}`.getHashCode();
            const stackOverflow: boolean = (this._lastMessageHashCode == messageHashCode);
            
            if (stackOverflow) {
                return false;
            }

            this._lastMessageHashCode = messageHashCode;
            const pageName: string = (pageRouteName) ? ` on page "${pageRouteName}"` : ``;
            const serverError: ServerError = {
                requestId: "",
                debugDetails: `Unhandled JS exception occured${pageName}: "${error.message}"\n${error.stack}\n${componentStack}.`
            };
            // do not await, just notification event
            // noinspection ES6MissingAwait
            this.onJsErrorAsync(serverError);
            //redirect to error page
            await this.error(serverError);
            
        }
        return true;
    }

    public static back(): void {
        window.history.back();
    }

    public static forward(): void {
        window.history.forward();
    }

    public static async createPageAsync(route: PageRoute): Promise<IBasePage> {
        
        const pageDefinitions: IPageDefinitions = ServiceProvider.getRequiredService(nameof<IPageDefinitions>());

        return await pageDefinitions.createPageAsync(route);
    }

    public static render(page: IBasePage, ref: React.RefObject<IBasePage>): React.ReactElement {
        const pageDefinitions: IPageDefinitions = ServiceProvider.getRequiredService(nameof<IPageDefinitions>());

        return pageDefinitions.render(page, ref);
    }
}