import React from "react";
import queryString, {ParsedQuery} from "query-string";
import {FileModel, ILocalizer, ServiceProvider, Utility} from "@weare/athenaeum-toolkit";
import {
    AlertModel,
    ApplicationContext,
    BaseAsyncComponent,
    ch,
    IAsyncComponent,
    IBaseAsyncComponentState,
    IBaseComponent,
    IBasePage,
    IGlobalResize,
    ILayoutPage,
    IPageContainer,
    PageRoute,
    PageRouteProvider,
    SwipeDirection,
    WebApplicationType
} from "@weare/athenaeum-react-common";
import TopNav, {IMenuItem, IShoppingCart} from "../TopNav/TopNav";
import Footer, {IFooterLink} from "../Footer/Footer";
import Spinner from "../Spinner/Spinner";

import styles from "./Layout.module.scss";

export interface ILayoutProps {
    className?: string;
    topNavLogo?: any;
    topNavLogoText?: string;
    footerName?: string;
    footerLogo?: any;
    footerLinks?: () => IFooterLink[];
    noTopNav?: boolean;
    noFooter?: boolean;
    changeUrl?: boolean;

    fetchContext?(sender: IBaseComponent, timezoneOffset: number, applicationType: WebApplicationType): Promise<ApplicationContext>;

    tokenLogin?(sender: IBaseComponent, token: string): Promise<void>;

    fetchTopNavItems?(sender: IBaseComponent): Promise<IMenuItem[]>;

    fetchTopNavItems?(sender: IBaseComponent): Promise<IMenuItem[]>;

    onLogoClick?(sender: IBaseComponent): Promise<void>;

    onShoppingCartClickAsync?(sender: TopNav): Promise<void>;

    fetchShoppingCartAsync?(sender: TopNav): Promise<IShoppingCart>;
}

interface ILayoutState extends IBaseAsyncComponentState<ApplicationContext> {
    page: IBasePage | null;
    isSpinning: boolean;
    error: boolean;
}

export default class Layout extends BaseAsyncComponent<ILayoutProps, ILayoutState, ApplicationContext> implements ILayoutPage, IGlobalResize {

    state: ILayoutState = {
        isLoading: false,
        isSpinning: false,
        data: null,
        page: null,
        error: false,
    };

    private readonly _pageRef: React.RefObject<IBasePage> = React.createRef();
    private readonly _downloadLink: React.RefObject<HTMLAnchorElement> = React.createRef();

    private _mobile: boolean = this.mobile;
    private _touch: React.Touch | null = null;
    private _startTouch: React.Touch | null = null;
    private _swiping: boolean = false;
    private _alert: AlertModel | null = null;

    private async onTouchStartHandlerAsync(e: React.TouchEvent): Promise<void> {
        this._touch = e.touches[0];
        this._startTouch = e.touches[0];
    }

    private async onTouchEndHandlerAsync(e: React.TouchEvent): Promise<void> {
        if ((this._startTouch != null) && (this._touch)) {

            const x: number = this._startTouch.clientX;
            const y: number = this._startTouch.clientY;

            const xDiff: number = this._touch.clientX - x;
            const yDiff: number = this._touch.clientY - y;

            const minSwipe: number = window.innerWidth / 3.0;

            if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
                if (xDiff > minSwipe) {
                    // right swipe
                    await this.onSwipeHandlerAsync(SwipeDirection.Right);
                } else if (xDiff < -minSwipe) {
                    // left swipe
                    await this.onSwipeHandlerAsync(SwipeDirection.Left);
                }
            } else {
                if (yDiff > minSwipe) {
                    //down swipe
                    await this.onSwipeHandlerAsync(SwipeDirection.Down);
                } else if (yDiff < -minSwipe) {
                    //up swipe
                    await this.onSwipeHandlerAsync(SwipeDirection.Up);
                }
            }

            this._startTouch = null;
            this._touch = null;
        }
    }

    private async onTouchMoveHandlerAsync(e: React.TouchEvent): Promise<void> {
        this._touch = e.touches[0];
    }

    private async onSwipeHandlerAsync(direction: SwipeDirection): Promise<void> {
        if ((!this.state.isSpinning) && (!this.state.isLoading)) {
            const page: IBasePage | null = this._pageRef.current || this.state.page;
            let defaultHandling: boolean = true;
            if (page) {
                defaultHandling = await page.onSwipeHandlerAsync(direction);
            }

            if (defaultHandling) {
                if (direction === SwipeDirection.Right) {
                    await this.swipeRightAsync();
                    await PageRouteProvider.back();
                }
            }
        }
    }

    private async swipe(styleName: string): Promise<void> {
        if (!this._swiping) {
            try {
                this._swiping = true;

                let main: any = document.querySelector(`.${styles.main}`);
                main.classList.add(styleName);

                await Utility.wait(500);

                main.classList.remove(styleName);

            } finally {
                this._swiping = false;
            }
        }
    }

    private async setPageUrlAsync(): Promise<void> {
        let routeName: string | null = this.getPage()?.routeName;

        if (routeName === null) {
            return;
        }

        const localizer: ILocalizer | null = ServiceProvider.findLocalizer();

        let localizedRouteName: string | null = ((localizer != null) && (localizer.contains(`PageRoutes.${routeName}`)))
            ? localizer.get(`PageRoutes.${routeName}`)
            : (this.props.changeUrl)
                ? routeName
                : null;


        if (localizedRouteName) {
            await PageRouteProvider.changeUrlWithoutReload(localizedRouteName!);
        }
    }

    private async processUrlRouteAsync(): Promise<void> {
        const route: string = window.location.pathname;
        console.log("processUrlRouteAsync, read url")

        if (route !== null && route !== "/" && route !== "") {

            let pageRoute: PageRoute | null = await PageRouteProvider.resolveRoute(route);

            if (pageRoute) {
                pageRoute.parameters = queryString.parse(window.location.search);
                console.log("processUrlRouteAsync, redirect")

                await PageRouteProvider.redirectAsync(pageRoute)
            }
        }

    }

    private async processTokenAsync(): Promise<void> {

        const parsed: ParsedQuery = queryString.parse(window.location.search);

        let token = parsed.token as string;
        if (!token) {
            const pathname: string = window.location.pathname.substr(1);
            if ((pathname) && (pathname.length == 32) && (/^[0-9a-fA-F]+$/.test(pathname))) {
                token = pathname;
            }
        }

        if (token) {
            if (this.props.tokenLogin) {
                await this.props.tokenLogin(this, token);
            } else {
                await this.postAsync("/api/Application/TokenLogin", token);
            }

            await PageRouteProvider.changeUrlWithoutReload();
        }
    }

    private isMobileApp(): boolean {
        const href: string = document.location.href.toLowerCase();
        return (
            (href.endsWith("/mobile") || href.endsWith("/mobile/")) ||
            (href.endsWith("/mobilehome") || href.endsWith("/mobilehome/"))
        );
    }

    private isPwaApp(): boolean {
        return (
            (window.matchMedia("(display-mode: standalone)").matches) ||
            //(window.matchMedia('(display-mode: fullscreen)').matches) ||
            //(window.matchMedia('(display-mode: minimal-ui)').matches) ||
            ((window.navigator as any).standalone) ||
            (document.referrer.includes("android-app://"))
        );
    }

    private getApplicationType(): WebApplicationType {
        return (this.isMobileApp())
            ? WebApplicationType.MobileApp
            : (this.isPwaApp())
                ? WebApplicationType.PwaApp
                : (this.mobile)
                    ? WebApplicationType.MobileBrowser
                    : WebApplicationType.DesktopBrowser;
    }

    protected async fetchDataAsync(): Promise<ApplicationContext> {

        if (this.props.fetchContext) {
            const timezoneOffset: number = Utility.timezoneOffset;
            const applicationType: WebApplicationType = this.getApplicationType();
            const context: ApplicationContext = await this.props.fetchContext(this, timezoneOffset, applicationType);

            await ch.setContextAsync(context);

            if (context.currentPage) {
                await PageRouteProvider.redirectAsync(context.currentPage, true);
            }

            return context;
        }

        return super.fetchDataAsync();
    }

    protected getEndpoint(): string {
        const timezoneOffset: number = Utility.timezoneOffset;
        const applicationType: WebApplicationType = this.getApplicationType();
        return "/api/Application/GetContext?timezoneOffset=" + timezoneOffset + "&applicationType=" + applicationType;
    }

    public isLayout(): boolean {
        return true;
    }

    public get hasTopNav(): boolean {
        return ((this.props.noTopNav !== true) && (this.hasData) && (this.state.page != null) && (this.state.page.hasTopNav));
    }

    public get hasFooter(): boolean {
        return ((this.props.noFooter !== true) && (this.hasData) && (this.state.page != null) && (this.state.page.hasFooter));
    }

    public async onGlobalResize(e: React.SyntheticEvent): Promise<void> {
        if (this.mobile !== this._mobile) {
            this._mobile = this.mobile;
            await this.reRenderAsync();
        }
    }

    public async swipeLeftAsync(): Promise<void> {
        if (this.mobile) {
            this.removeTooltip();
            await this.swipe(styles.swipeLeft);
        }
    }

    public async swipeRightAsync(): Promise<void> {
        if (this.mobile) {
            this.removeTooltip();
            await this.swipe(styles.swipeRight);
        }
    }

    public async setSpinnerAsync(isSpinning: boolean): Promise<void> {
        if ((this.state.isSpinning !== isSpinning) && (this.isMounted)) {
            await this.setState({isSpinning: isSpinning});
        }
    }

    public isSpinning(): boolean {
        return this.state.isSpinning;
    }

    public async setPageAsync(page: IBasePage): Promise<void> {

        await this.setState({page: page});

        if (this.mobile) {
            this.removeTooltip();
            this.initializeTooltips();
        }
    }

    public async reloadTopNavAsync(): Promise<void> {
        if (!this.isLoading) {
            const topNav: IAsyncComponent | null = TopNav.mountedInstance;
            if (topNav != null) {
                await topNav.reloadAsync();
            }
        }
    }

    public async alertAsync(alert: AlertModel): Promise<void> {
        const pageContainer: IPageContainer | null = ServiceProvider.getService(nameof<IPageContainer>());
        if (pageContainer != null) {
            this._alert = null;
            await pageContainer.alertAsync(alert);
        } else {
            this._alert = alert;
        }
    }

    public async hideAlertAsync(): Promise<void> {
        this._alert = null;
        const pageContainer: IPageContainer | null = ServiceProvider.getService(nameof<IPageContainer>());
        if (pageContainer != null) {
            await pageContainer.hideAlertAsync();
        }
    }

    public get alert(): AlertModel | null {
        const pageContainer: IPageContainer | null = ServiceProvider.getService(nameof<IPageContainer>());
        return pageContainer?.alert ?? this._alert;
    }

    public initializeTooltips(): void {
        const tooltip = this.JQuery('[data-toggle="tooltip"]');

        if (tooltip.length > 0) {
            tooltip.tooltip({
                trigger: "click",
                placement: "top",
            });

            tooltip.on("show.bs.tooltip", () => {
                this.JQuery(".tooltip").not(tooltip).remove();
            });
        }
    }

    public reinitializeTooltips(): void {
        this.JQuery('[data-toggle="tooltip"]').tooltip("dispose");

        this.initializeTooltips();
    }

    private removeTooltip(): void {
        this.JQuery('.tooltip').remove();
    }

    //Do not delete - needs for REACT error handling
    // noinspection JSUnusedGlobalSymbols
    public static getDerivedStateFromError(): any {
        return {error: true};
    }

    public async componentDidCatch(error: Error, errorInfo: React.ErrorInfo): Promise<void> {

        // noinspection JSVoidFunctionReturnValueUsed,TypeScriptValidateJSTypes
        const processed: boolean = await PageRouteProvider.exception(error, errorInfo);

        if ((processed) && (this.state.error)) {
            await this.setState({error: false});
        }
    }

    public async componentDidMount(): Promise<void> {

        await super.componentDidMount();

        if (this.mobile) {
            this.initializeTooltips();
        }

        await this.processTokenAsync();

        await this.processUrlRouteAsync();

        await this.setPageUrlAsync();
    }

    public async componentDidUpdate(): Promise<void> {
        if (this._alert) {
            await this.alertAsync(this._alert);
        }
    }

    public get applicationName(): string {
        return (this.state.data != null) ? this.state.data.applicationName : "";
    }

    public download(file: FileModel): void {
        const link: HTMLAnchorElement = this._downloadLink.current!;
        link.href = file.src;
        link.download = file.name;
        link.target = "_self";
        link.click();
    }

    public render(): React.ReactNode {
        return (
            <div className={this.css(styles.layout, this.props.className)}
                 onTouchStart={async (e: React.TouchEvent) => await this.onTouchStartHandlerAsync(e)}
                 onTouchEnd={async (e: React.TouchEvent) => await this.onTouchEndHandlerAsync(e)}
                 onTouchMove={async (e: React.TouchEvent) => await this.onTouchMoveHandlerAsync(e)}>

                {
                    (this.hasTopNav) &&
                    (
                        <TopNav applicationName={this.applicationName}
                                fetchItems={this.props.fetchTopNavItems}
                                logo={this.props.topNavLogo}
                                fetchShoppingCart={this.props.fetchShoppingCartAsync}
                                onShoppingCartClickAsync={this.props.onShoppingCartClickAsync}
                                logoText={this.props.topNavLogoText}
                                onLogoClick={this.props.onLogoClick}
                        />
                    )
                }

                <main className={styles.main}>
                    {
                        ((!this.state.error) && (!this.isLoading) && (this.state.page != null)) && PageRouteProvider.render(this.state.page, this._pageRef)
                    }
                </main>

                {
                    ((this.hasFooter) && (!this.state.error) && (!this.isLoading)) &&
                    (
                        <Footer version={ch.version}
                                links={this.props.footerLinks}
                                logo={this.props.footerLogo}
                                name={this.props.footerName}
                        />
                    )
                }

                {
                    ((this.state.error) || (this.state.isSpinning)) &&
                    (
                        <Spinner global/>
                    )
                }

                <a ref={this._downloadLink} style={{display: "none"}}/>

            </div>
        );
    }
}