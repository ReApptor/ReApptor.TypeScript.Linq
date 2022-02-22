import React from "react";
import queryString, {ParsedQuery} from "query-string";
import {FileModel, ILanguage, ServiceProvider, Utility} from "@weare/reapptor-toolkit";
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
} from "@weare/reapptor-react-common";
import TopNav, {IMenuItem, IShoppingCart, ITopNavProfile} from "../TopNav/TopNav";
import Footer, {IFooterLink} from "../Footer/Footer";
import Spinner from "../Spinner/Spinner";
import CookieConsent, {ICookieConsentProps} from "../CookieConsent/CookieConsent";
import LeftNav, {ILeftNavProps} from "../LeftNav/LeftNav";

import styles from "./Layout.module.scss";

export interface ILayoutProps {

    /**
     * Added to the {@link Layout}'s root elements className.
     */
    className?: string | (() => string | null | undefined);

    topNavClassName?: string | (() => string | null | undefined);
    topNavLogo?: any;
    topNavLogoText?: string;
    noTopNav?: boolean;

    /**
     * Passed to the {@link Footer} of the {@link Layout}.
     * Has no effect if {@link noFooter} is true.
     *
     * @see IFooterProps.name
     */
    footerName?: string;

    /**
     * Passed to the {@link Footer} of the {@link Layout}.
     * Has no effect if {@link noFooter} is true.
     *
     * @see IFooterProps.logo
     */
    footerLogo?: any;

    /**
     * Passed to the {@link Footer} of the {@link Layout}.
     * Has no effect if {@link noFooter} is true.
     *
     * @see IFooterProps.links
     */
    footerLinks?: () => IFooterLink[];

    /**
     * If true, {@link Footer} is not displayed.
     */
    noFooter?: boolean;

    /**
     * Should routing functionalities be enabled application-wide.
     *
     * @default false
     */
    useRouting?: boolean;

    /**
     * A function which returns {@link ICookieConsentProps}.
     * If this is defined a {@link CookieConsent} will be rendered in the {@link Layout} with the {@link ICookieConsentProps} returned by the function passed to it.
     */
    cookieConsent?: () => ICookieConsentProps;

    searchPlaceHolder?: () => string;

    languages?: () => ILanguage[];

    profile?: ITopNavProfile | (() => ITopNavProfile | null) | null;

    leftNav?: ILeftNavProps | (() => ILeftNavProps | null) | null;

    fetchContext?(sender: IBaseComponent, timezoneOffset: number, applicationType: WebApplicationType): Promise<ApplicationContext>;

    tokenLogin?(sender: IBaseComponent, token: string): Promise<void>;

    fetchTopNavItems?(sender: IBaseComponent): Promise<IMenuItem[]>;

    fetchTopNavItems?(sender: IBaseComponent): Promise<IMenuItem[]>;

    onLogoClick?(sender: IBaseComponent): Promise<void>;

    onShoppingCartClick?(sender: TopNav): Promise<void>;

    onSearchClick?(searchTerm: string): Promise<void>;

    fetchShoppingCartAsync?(sender: TopNav): Promise<IShoppingCart>;
}

interface ILayoutState extends IBaseAsyncComponentState<ApplicationContext> {
    page: IBasePage | null;
    isSpinning: boolean;
    error: boolean;
}

/**
 * A base layout containing an {@link IBasePage}.
 */
export default class Layout extends BaseAsyncComponent<ILayoutProps, ILayoutState, ApplicationContext> implements ILayoutPage, IGlobalResize {

    state: ILayoutState = {
        isLoading: false,
        isSpinning: false,
        data: null,
        page: null,
        error: false,
    };

    private readonly _pageRef: React.RefObject<IBasePage> = React.createRef();
    private readonly _topNavRef: React.RefObject<TopNav> = React.createRef();
    private readonly _leftNavRef: React.RefObject<LeftNav> = React.createRef();
    private readonly _downloadLink: React.RefObject<HTMLAnchorElement> = React.createRef();

    private _mobile: boolean = this.mobile;
    private _touch: React.Touch | null = null;
    private _startTouch: React.Touch | null = null;
    private _swiping: boolean = false;
    private _alert: AlertModel | null = null;
    private _leftNav: ILeftNavProps | null = null;

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

    private async onTopNavFetchItemsAsync(): Promise<void> {
        await this.reloadLeftNavAsync();
    }

    private static async processUrlRouteAsync(): Promise<void> {

        const pathname: string = window.location.pathname;

        if (!!pathname && pathname !== "/") {

            const pageRoute: PageRoute | null = await PageRouteProvider.resolveRoute(pathname);

            if (pageRoute) {
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

    private removeTooltip(): void {
        this.JQuery('.tooltip').remove();
    }

    /**
     * Do not delete - needed for REACT error handling
     * @return \{error: true}
     */
    // noinspection JSUnusedGlobalSymbols
    public static getDerivedStateFromError(): any {
        return {error: true};
    }

    /**
     * @return {@link ApplicationContext.applicationName}
     */
    public get applicationName(): string {
        return (this.state.data != null) ? this.state.data.applicationName : "";
    }


    // React.Component

    public async componentDidCatch(error: Error, errorInfo: React.ErrorInfo): Promise<void> {
        // noinspection JSVoidFunctionReturnValueUsed,TypeScriptValidateJSTypes
        const processed: boolean = await PageRouteProvider.exception(error, errorInfo);

        if ((processed) && (this.state.error)) {
            await this.setState({error: false});
        }
    }

    public async componentDidUpdate(): Promise<void> {
        if (this._alert) {
            await this.alertAsync(this._alert);
        }
    }

    // ISpinner

    /**
     * @inheritDoc
     *
     * NOTE: only works if the {@link Layout} is mounted.
     */
    public async setSpinnerAsync(isSpinning: boolean): Promise<void> {
        if ((this.state.isSpinning !== isSpinning) && (this.isMounted)) {
            await this.setState({isSpinning: isSpinning});
        }
    }

    public isSpinning(): boolean {
        return this.state.isSpinning;
    }


    // BaseAsyncComponent


    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();

        if (this.mobile) {
            this.initializeTooltips();
        }

        await this.processTokenAsync();

        if (this.useRouting) {
            await Layout.processUrlRouteAsync();
        }
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

    // IGlobalResize

    public async onGlobalResize(e: React.SyntheticEvent): Promise<void> {
        if (this.mobile !== this._mobile) {
            this._mobile = this.mobile;
            await this.reRenderAsync();
        }
    }

    // ILayoutPage

    public async setPageAsync(page: IBasePage): Promise<void> {

        await this.setState({page: page});

        if (this.mobile) {
            this.removeTooltip();
            this.initializeTooltips();
        }
    }

    public async reRenderTopNavAsync(): Promise<void> {
        const topNav: IAsyncComponent | null = TopNav.mountedInstance;
        if (topNav != null) {
            await topNav.reRenderAsync();
        }
    }

    public async reloadTopNavAsync(): Promise<void> {
        this._leftNav = null;
        const topNav: IAsyncComponent | null = TopNav.mountedInstance;
        if (topNav != null) {
            await topNav.reloadAsync();
            await this.reRenderLeftNavAsync();
        }
    }

    public async reRenderLeftNavAsync(): Promise<void> {
        if (this._leftNavRef.current != null) {
            await this._leftNavRef.current.reRenderAsync();
        }
    }

    public async reloadLeftNavAsync(): Promise<void> {
        this._leftNav = null;
        if (this._leftNavRef.current != null) {
            await this._leftNavRef.current.reloadAsync();
        }
        await this.reRenderAsync();
        await this.reRenderTopNavAsync();
    }

    /**
     * @inheritDoc
     *
     * Only works if {@link mobile} is true.
     */
    public async swipeLeftAsync(): Promise<void> {
        if (this.mobile) {
            this.removeTooltip();
            await this.swipe(styles.swipeLeft);
        }
    }

    /**
     * @inheritDoc
     *
     * Only works if {@link mobile} is true.
     */
    public async swipeRightAsync(): Promise<void> {
        if (this.mobile) {
            this.removeTooltip();
            await this.swipe(styles.swipeRight);
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

    /**
     * @inheritDoc
     * @return true
     */
    public isLayout(): boolean {
        return true;
    }

    /**
     * @inheritDoc
     *
     * NOTE: handles only Bootstrap tooltips.
     */
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

    /**
     * @inheritDoc
     *
     * NOTE: handles only Bootstrap tooltips.
     */
    public reinitializeTooltips(): void {
        this.JQuery('[data-toggle="tooltip"]').tooltip("dispose");

        this.initializeTooltips();
    }

    public download(file: FileModel): void {
        const link: HTMLAnchorElement = this._downloadLink.current!;
        link.href = file.src;
        link.download = file.name;
        link.target = "_self";
        link.click();
    }

    public get leftNav(): ILeftNavProps | null {

        const leftNav: ILeftNavProps | null = (this.props.leftNav)
            ? (typeof this.props.leftNav === "function")
                ? this.props.leftNav()
                : this.props.leftNav
            : null;

        if (leftNav != null) {
            // initialize items:
            if (leftNav.items == null) {
                const fetchTopNavItems = this.props.fetchTopNavItems;
                if (fetchTopNavItems != null) {
                    leftNav.items = () => fetchTopNavItems(this);
                } else {
                    leftNav.items = async () => this._topNavRef.current?.items || [];
                }
            }

            // initialize userProfile
            if (leftNav.userProfile == null) {
                //return Profile.resolveUserProfile(this, this.props.userProfile);
                const profile: ITopNavProfile | null = TopNav.resolveProfile(this.props.profile);
                leftNav.userProfile = profile?.userProfile;
            }

            this._leftNav = leftNav;
        }

        return this._leftNav;
    }

    public get hasTopNav(): boolean {
        return ((this.props.noTopNav !== true) && (this.hasData) && (this.state.page != null) && (this.state.page.hasTopNav));
    }

    public get hasLeftNav(): boolean {
        return ((this.leftNav !== null) && (this.hasData) && (this.state.page != null) && (this.state.page.hasLeftNav));
    }

    public get hasFooter(): boolean {
        return ((this.props.noFooter !== true) && (this.hasData) && (this.state.page != null) && (this.state.page.hasFooter));
    }

    /**
     * @inheritDoc
     * @see IPageContainer.alert
     */
    public get alert(): AlertModel | null {
        const pageContainer: IPageContainer | null = ServiceProvider.getService(nameof<IPageContainer>());
        return pageContainer?.alert ?? this._alert;
    }

    public get useRouting(): boolean {
        return this.props.useRouting === true;
    }


    // IReactComponent


    public render(): React.ReactNode {
        return (
            <div className={this.css(styles.layout, this.props.className)}
                 onTouchStart={async (e: React.TouchEvent) => await this.onTouchStartHandlerAsync(e)}
                 onTouchEnd={async (e: React.TouchEvent) => await this.onTouchEndHandlerAsync(e)}
                 onTouchMove={async (e: React.TouchEvent) => await this.onTouchMoveHandlerAsync(e)}>

                {
                    (this.hasTopNav) &&
                    (
                        <TopNav ref={this._topNavRef}
                                className={this.props.topNavClassName}
                                applicationName={this.applicationName}
                                leftNavRef={this._leftNavRef}
                                fetchItems={this.props.fetchTopNavItems}
                                languages={this.props.languages}
                                logo={this.props.topNavLogo}
                                fetchShoppingCart={this.props.fetchShoppingCartAsync}
                                onShoppingCartClick={this.props.onShoppingCartClick}
                                onSearchClick={this.props.onSearchClick}
                                searchPlaceHolder={this.props.searchPlaceHolder}
                                logoText={this.props.topNavLogoText}
                                profile={this.props.profile}
                                onLogoClick={this.props.onLogoClick}
                                onFetchItems={() => this.onTopNavFetchItemsAsync()}
                        />
                    )
                }


                <main className={this.css(styles.main, this.hasLeftNav && styles.leftNav)}>

                    {
                        (this.hasLeftNav) &&
                        (
                            <LeftNav ref={this._leftNavRef} {...this.leftNav}
                                     className={this.css(styles.leftNav, this.leftNav?.className)}
                                     onToggle={() => this.reRenderTopNavAsync()}
                            />
                        )
                    }

                    {
                        ((!this.state.error) && (!this.isLoading) && (this.state.page != null)) && (PageRouteProvider.render(this.state.page, this._pageRef))
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
                        <Spinner global />
                    )
                }

                {
                    ((!this.isLoading) && (this.props.cookieConsent)) &&
                    (
                        <CookieConsent description={this.props.cookieConsent().description}
                                       title={this.props.cookieConsent().title}
                                       acceptButtonText={this.props.cookieConsent().acceptButtonText}
                                       cookieName={this.props.cookieConsent().cookieName}
                                       position={this.props.cookieConsent().position}
                                       cookieExpirationInDays={this.props.cookieConsent().cookieExpirationInDays}
                        />
                    )
                }

                <a ref={this._downloadLink}
                   style={{display: "none"}}
                />

            </div>
        );
    }
}