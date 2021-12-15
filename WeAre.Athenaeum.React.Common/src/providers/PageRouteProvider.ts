import React, {ErrorInfo} from "react";
import {AthenaeumConstants, ILocalizer, ServiceProvider} from "@weare/athenaeum-toolkit";
import PageCacheProvider from "./PageCacheProvider";
import PageRoute from "../models/PageRoute";
import {IBasePage, ILayoutPage} from "../base/BasePage";
import ApiProvider from "./ApiProvider";
import ServerError from "../models/ServerError";
import ApplicationContext from "../models/ApplicationContext";
import ch from "./ComponentHelper";
import IErrorPageParameters from "../models/IErrorPageParameters";
import BasePageDefinitions, {IPageDefinitions} from "./BasePageDefinitions";
import AlertModel from "../models/AlertModel";
import {Dictionary} from "typescript-collections";

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
        await layout.postAsync("/api/Application/Logout", null);
    }

    private static async onRedirectAsync(route: PageRoute): Promise<void> {
        try {
            if (!this.sendParametersOnRedirect && !ch.getLayout().useRouting) {
                route.parameters = null;
            }
            await ApiProvider.postAsync("/api/Application/OnRedirect", route);
        } catch (e) {
            //no additional action needed, not critical
        }
    }

    private static async onJsErrorAsync(serverError: ServerError): Promise<void> {
        try {
            await ApiProvider.postAsync("/api/Application/OnJsError", serverError);
        } catch (e) {
            //no additional action needed, not critical
        }
    }

    private static async invokeRedirectAsync(route: PageRoute, id: string | null = null, innerRedirect: boolean, replace: boolean = false, stopPropagation: boolean = false): Promise<IBasePage | null> {

        this.initialize();

        const context: ApplicationContext = ch.getContext();
        const current: IBasePage | null = ch.findPage();
        const layout: ILayoutPage = ch.getLayout();

        if (id) {
            route = {...route};
            route.id = id;
        }

        const newPage: boolean = ((current == null) || (current.routeName !== route.name) || (!PageRoute.isEqual(context.currentPage, route)));

        if (newPage || layout.useRouting) {

            if (route.name === BasePageDefinitions.dummyRouteName) {
                return current;
            }



            if (route.name === BasePageDefinitions.logoutRouteName) {
                await this.logoutAsync(layout);
                return current;
            }

            let newAlert: AlertModel | null = null;

            if (current != null) {

                const currentAlert: AlertModel | null = current.alert;

                const canRedirect: boolean = await current.beforeRedirectAsync(route, innerRedirect);

                if (!canRedirect) {
                    const currentRoute: PageRoute = current.route;

                    window.history.pushState(currentRoute, currentRoute.name);

                    await current.reRenderAsync();

                    return current;
                }

                // New alert was triggered in method "beforeRedirectAsync";
                if (!AlertModel.isEqual(currentAlert, current.alert)) {
                    newAlert = current.alert;
                }

                // Hide current alert
                await current.hideAlertAsync();
            }

            const page: IBasePage = await this.createPageAsync(route);

            context.currentPage = route;

            await layout.setPageAsync(page);

            // Show new alert
            if (newAlert != null) {
                await page.alertAsync(newAlert);
            }

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

            if (stopPropagation) {
                this.stopPropagation();
            }

            return page;
        }

        return current;
    }

    public static async redirectAsync(route: PageRoute, replace: boolean = false, stopPropagation: boolean = false): Promise<IBasePage | null> {
        return await this.invokeRedirectAsync(route, null, false, replace, stopPropagation);
    }

    public static async createPageAsync(route: PageRoute): Promise<IBasePage> {

        const pageDefinitions: IPageDefinitions = ServiceProvider.getRequiredService(nameof<IPageDefinitions>());

        return await pageDefinitions.createPageAsync(route);
    }

    public static async changeUrlWithoutReload(newPath?: string | null): Promise<void> {
        if (newPath == null) {
            newPath = "/";
        }
        window.history.replaceState(null, "", newPath);
    }

    /**
     * Replace current {@link window.URL} with a localized path, id and parameters from the given {@link PageRoute} without reloading the page.
     * Also replaces the current {@link window.history} entry with the new route.
     * If reloading of the page is wanted, use {@link redirectAsync} instead.
     *
     * @param pageRoute {@link PageRoute} from which to get route name, id and parameters.
     */
    public static async changeUrlWithRouteWithoutReloadAsync(pageRoute: PageRoute): Promise<void> {

        const localizer: ILocalizer | null = ServiceProvider.findLocalizer();

        let routeName: string = pageRoute.name;

        const localizedRouteKey: string = `PageRoutes.${routeName}`;

        if (localizer?.contains(localizedRouteKey, localizer?.language)) {
            routeName = localizer.get(localizedRouteKey);
        }

        if (!routeName) {
            routeName = "/";
        }
        else {

            if (!routeName.startsWith("/")) {
                routeName = `/${routeName}`;
            }

            // Id can only be set in non-root pages
            if (pageRoute.id) {
                routeName += `/${pageRoute.id}`;
            }
        }

        if (pageRoute.parameters) {

            let query: string = "";

            //Querystring.stringify had a problem with parameters object so had to do it this way
            for (const [key, value] of Object.entries(pageRoute.parameters)) {

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
                routeName += `?${query}`;
            }
        }

        //Hack. Without this invokeRedirectAsync will replaceState before this function and it will mess up history
        //Feel free to make better solution for this :)
        await new Promise(callback => setTimeout(callback, 2));

        //For equality comparison.
        let browserState = window.history.state as PageRoute;
        
        //Strict comparison in PageRoute.isEqual so need to be null, not undefined
        if (!browserState.id) {
            browserState.id = null;
        }
        
        //Somewhere along the way null parameters converts to {} (why???) which is truthy
        //so let's make it null instead
        if (browserState.parameters == {}){
            browserState.parameters = null;
        }
        
        //Let's replace the state only if the current state is not the same as the current pageRoute
        if (!PageRoute.isEqual(browserState, pageRoute as PageRoute)){
            window.history.replaceState(pageRoute, "", routeName);
        }
    }

    public static stopPropagation(): void {
        throw new Error(AthenaeumConstants.apiError);
    }

    public static async offline(): Promise<void> {
        await PageRouteProvider.redirectAsync(BasePageDefinitions.offlineRoute, true);
    }

    public static async error(serverError: ServerError): Promise<void> {
        // redirect to error page
        const route = new PageRoute(BasePageDefinitions.errorRouteName);
        route.parameters = {error: serverError} as IErrorPageParameters;
        await PageRouteProvider.redirectAsync(route, true);
    }

    public static async exception(error: Error, reactInfo: ErrorInfo | null = null): Promise<boolean> {

        if ((error) && (!ApiProvider.isApiError(error))) {

            const page: IBasePage | null = ch.findPage();
            const pageRouteName: string = ((page) && (page.routeName)) ? page.routeName : ``;
            const componentStack: string = (reactInfo != null) ? reactInfo!.componentStack : "";
            const messageHashCode: number = `${pageRouteName}:${componentStack}:${error.stack}:${error.message}`.getHashCode();
            const stackOverflow: boolean = (this._lastMessageHashCode == messageHashCode);

            if (stackOverflow) {
                console.warn(error);
                return false;
            }

            this._lastMessageHashCode = messageHashCode;
            const pageName: string = (pageRouteName) ? ` on page "${pageRouteName}"` : ``;
            const url: string = window.location.href;
            const serverError: ServerError = {
                requestId: "",
                debugDetails: `Unhandled JS exception occured${pageName} ("${url}"): "${error.message}"\n${error.stack}\n${componentStack}.`
            };
            // do not await, just notification event
            // noinspection ES6MissingAwait
            this.onJsErrorAsync(serverError);
            //redirect to error page
            await this.error(serverError);

        }

        return true;
    }

    /**
     * Get a {@link PageRoute} registered with the given URL, or null if not found.
     * If the URL contains two parts and no {@link PageRoute} is found with the full path, assigns the last part as an Id.
     *
     * @param path URL to resolve to a {@link PageRoute}.
     */
    public static resolveRoute(path: string): PageRoute | null {

        const pageDefinitions: IPageDefinitions | null = ServiceProvider.getService(nameof<IPageDefinitions>());

        const routes: Dictionary<string, PageRoute> | undefined = pageDefinitions?.getRoutes?.();

        if (!routes) {
            return null;
        }

        const parts: string[] = path
            .split("/")
            .filter(route => route !== '');

        const pageName: string = parts[0];

        const secondUrlPart: string | undefined = parts[1];

        const longRoute: string | null = (secondUrlPart)
            ? `${pageName}/${secondUrlPart}`
            : null;

        // Second URL part is not an Id.
        if (longRoute) {

            const longRouteKeys: string[] = [
                longRoute,
                longRoute.toUpperCase(),
                longRoute.toLowerCase()
            ];

            for (let i = 0; i < longRouteKeys.length; i++) {
                const longRouteKey: string = longRouteKeys[i];

                if (routes.containsKey(longRouteKey)) {
                    return routes.getValue(longRouteKey)!;
                }
            }
        }

        const pageNameKeys: string[] = [
            pageName,
            pageName.toUpperCase(),
            pageName.toLowerCase()
        ];

        // Second URL part is an Id.
        for (let i = 0; i < pageNameKeys.length; i++) {
            const pageNameKey: string = pageNameKeys[i];

            if (routes.containsKey(pageNameKey)) {
                const pageRoute: PageRoute = routes.getValue(pageNameKey)!;

                pageRoute.id = secondUrlPart;

                return pageRoute;
            }
        }

        return null;
    }

    public static back(): void {
        window.history.back();
    }

    public static forward(): void {
        window.history.forward();
    }

    public static push(route: PageRoute, title: string | null = null): void {
        if (title) {
            document.title = title;
        }
        window.history.pushState(route, title || route.name);
    }

    public static render(page: IBasePage, ref: React.RefObject<IBasePage>): React.ReactElement {
        const pageDefinitions: IPageDefinitions = ServiceProvider.getRequiredService(nameof<IPageDefinitions>());

        return pageDefinitions.render(page, ref);
    }

    /**
     * Should {@link PageRoute.parameters} be sent to API on {@link redirectAsync}.
     * Has no effect if {@link ILayoutPage.useRouting} is true, in which case the parameters are always sent.
     *
     * @default false
     */
    public static sendParametersOnRedirect: boolean = false;
}