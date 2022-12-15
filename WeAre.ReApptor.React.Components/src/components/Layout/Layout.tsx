import React from "react";
import queryString, {ParsedQuery} from "query-string";
import {FileModel, ILanguage, Utility, ServiceProvider} from "@weare/reapptor-toolkit";
import {
    AlertModel,
    ApplicationContext,
    BaseAsyncComponent, BasePageDefinitions, CameraType,
    ch,
    IAsyncComponent,
    IBaseAsyncComponentState,
    IBaseComponent,
    IBasePage,
    IGlobalResize,
    ILayoutPage,
    IPageContainer, JQueryNode,
    PageRoute,
    PageRouteProvider,
    SwipeDirection,
    WebApplicationType
} from "@weare/reapptor-react-common";
import TopNav, {IMenuItem, IShoppingCart, ITopNavNotifications, ITopNavProfile} from "../TopNav/TopNav";
import Footer, {IFooterLink} from "../Footer/Footer";
import Spinner from "../Spinner/Spinner";
import CookieConsent, {ICookieConsentProps} from "../CookieConsent/CookieConsent";
import LeftNav, {ILeftNavProps} from "../LeftNav/LeftNav";
import TakePicture from "./TakePicture/TakePicture";

import styles from "./Layout.module.scss";
import {FileInput} from "../../index";

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
     * If true, {@link LanguageDropdown} is not displayed.
     */
    noLanguageSelector?: boolean;

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

    languages?: (() => ILanguage[] | boolean) | boolean;

    profile?: ITopNavProfile | (() => ITopNavProfile | null) | null;

    notifications?: ITopNavNotifications | (() => ITopNavNotifications | null) | number | (() => number | null) | null;

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
    private readonly _takePictureRef: React.RefObject<TakePicture> = React.createRef();
    private readonly _callToAnchorRef: React.RefObject<HTMLAnchorElement> = React.createRef();
    private readonly _emailToAnchorRef: React.RefObject<HTMLAnchorElement> = React.createRef();

    private _mobile: boolean = this.mobile;
    private _tokenProcessing: boolean = false;
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

    private async onTopNavFetchItemsAsync(): Promise<void> {
        await this.reloadLeftNavAsync();
    }

    private static async processUrlRouteAsync(): Promise<void> {

        const pathname: string = window.location.pathname;

        if ((!!pathname) && (pathname !== "/")) {

            const pageRoute: PageRoute | null = await PageRouteProvider.resolveRoute(pathname);

            if (pageRoute) {
                await PageRouteProvider.redirectAsync(pageRoute)
            }
        }
    }

    private static async processContactUrlAsync(): Promise<void> {

        let hash: string = window.location.hash;

        if (hash) {
            hash = hash.toLowerCase();

            const contactSupport: boolean = ((hash == "#contact") || (hash == "#support"));
            if (contactSupport) {
                await PageRouteProvider.changeUrlWithoutReload();
                
                await PageRouteProvider.redirectAsync(BasePageDefinitions.contactSupportRoute, true, true);
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
            try {
                this._tokenProcessing = true;
                
                if (this.props.tokenLogin) {
                    await this.props.tokenLogin(this, token);
                } else {
                    await this.postAsync("/api/Application/TokenLogin", token);
                }

                await PageRouteProvider.changeUrlWithoutReload();
                
            } finally {
                if (this._tokenProcessing) {
                    this._tokenProcessing = false;
                    await this.reRenderAsync();
                }
            }
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
        // TODO:
        // "device-detector-js" can be used to analyze UserAgent to define device type properly!
        // https://www.npmjs.com/package/device-detector-js
        // For example:
        // const deviceDetector = new DeviceDetector();
        // const device: DeviceDetectorResult = deviceDetector.parse(window.navigator.userAgent);
        // const deviceType: DeviceType = device.device?.type ?? "";
        // const isMobileApp: boolean = (deviceType === "smartphone") || (deviceType === "tablet");
        
        return (
            // 1) Main check: is device is in standalone mode ("display": "standalone" in manifest.json);
            (window.matchMedia("(display-mode: standalone)").matches) ||
            ((window.navigator as any).standalone) ||
            // 2) Android app with PWA application can fill referrer
            (document.referrer.includes("android-app://")) ||
            // 3) Exception: samsung devices (some tablets don't process "(display-mode: standalone)" right):
            (!!navigator.userAgent.match(/SAMSUNG|Samsung|SGH-[I|N|T]|GT-[I|N]|SM-[A|N|P|T|Z]|SHV-E|SCH-[I|J|R|S]|SPH-L/i))
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
            await this.setState({isSpinning});
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
        
        await Layout.processContactUrlAsync();

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

        this._tokenProcessing = false;
        
        await this.setState({page: page});

        if (this.mobile) {
            this.removeTooltip();
            this.initializeTooltips();
        }
    }

    public async reloadTopNavAsync(): Promise<void> {
        const topNav: IAsyncComponent | null = TopNav.mountedInstance;
        if (topNav != null) {
            await topNav.reloadAsync();
            await this.reRenderLeftNavAsync();
        }
    }

    public async reRenderTopNavAsync(): Promise<void> {
        const topNav: IAsyncComponent | null = TopNav.mountedInstance;
        if (topNav != null) {
            await topNav.reRenderAsync();
        }
    }

    public async reloadLeftNavAsync(): Promise<void> {
        if (this.hasLeftNav) {
            if (this._leftNavRef.current != null) {
                await this._leftNavRef.current.reloadAsync();
            }
            await this.reRenderAsync();
            await this.reRenderTopNavAsync();
        }
    }

    public async reRenderLeftNavAsync(): Promise<void> {
        if (this._leftNavRef.current != null) {
            await this._leftNavRef.current.reRenderAsync();
        }
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
    
    private get tooltips(): JQueryNode | any {
        return this.JQuery('[data-toggle="tooltip"]');
    }

    /**
     * @inheritDoc
     *
     * NOTE: handles only Bootstrap tooltips.
     */
    public initializeTooltips(): void {
        const tooltip: JQueryNode | any = this.tooltips;

        if ((tooltip.length > 0) && (typeof tooltip.tooltip === "function")) {
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
        const tooltip: JQueryNode | any = this.tooltips;

        if ((tooltip.length > 0) && (typeof tooltip.tooltip === "function")) {
            tooltip.tooltip("dispose");
        }

        this.initializeTooltips();
    }

    public async takePictureAsync(camera: boolean | CameraType = true): Promise<FileModel | null> {
        return (this._takePictureRef.current)
            ? this._takePictureRef.current.takePictureAsync(camera)
            : null;
    }

    public download(file: FileModel): void {
        const link: HTMLAnchorElement | null = this._downloadLink.current;
        if (link) {
            link.href = (Utility.isBase64(file.src))
                ? Utility.toObjectUrl(file)
                : file.src;
            link.download = file.name;
            link.target = "_self";
            link.type = file.type;
        }
    }
    
    public callTo(phone: string): void {
        const anchor: HTMLAnchorElement | null = this._callToAnchorRef.current;
        
        if (anchor) {
            anchor.href = `tel:${phone}`;
            anchor.text = phone;
            anchor.click();
        }
    }
    
    public mailTo(email: string): void {
        const anchor: HTMLAnchorElement | null = this._callToAnchorRef.current;
        
        if (anchor) {
            anchor.href = `mailto:${email}`;
            anchor.text = email;
            anchor.click();
        }
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
        }

        return leftNav;
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

    public get hasLanguageSelector(): boolean {
        return ((this.props.noLanguageSelector !== true) && (this.hasData) && (this.state.page != null) && (this.state.page.hasLanguageSelector));
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

        const contextVisible: boolean = (!this._tokenProcessing);
        const hasTopNav: boolean = (contextVisible) && (this.hasTopNav);
        const hasLeftNav: boolean = (contextVisible) && (this.hasLeftNav);
        const leftNav: ILeftNavProps | null = (hasLeftNav) ? this.leftNav : null;
        
        return (
            <div className={this.css(styles.layout, this.props.className)}
                 onTouchStart={(e: React.TouchEvent) => this.onTouchStartHandlerAsync(e)}
                 onTouchEnd={(e: React.TouchEvent) => this.onTouchEndHandlerAsync(e)}
                 onTouchMove={(e: React.TouchEvent) => this.onTouchMoveHandlerAsync(e)}>

                {
                    (hasTopNav) &&
                    (
                        <TopNav ref={this._topNavRef}
                                className={this.props.topNavClassName}
                                applicationName={this.applicationName}
                                leftNavRef={hasLeftNav ? this._leftNavRef : undefined}
                                fetchItems={this.props.fetchTopNavItems}
                                languages={this.hasLanguageSelector ? this.props.languages : false}
                                logo={this.props.topNavLogo}
                                notifications={this.props.notifications}
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

                {
                    (contextVisible) &&
                    (
                        <main className={this.css(styles.main, hasLeftNav && styles.leftNav)}>

                            {
                                (leftNav) &&
                                (
                                    <LeftNav ref={this._leftNavRef} {...leftNav}
                                             className={this.css(styles.leftNav, leftNav.className)}
                                             onToggle={() => this.reRenderTopNavAsync()}
                                    />
                                )
                            }

                            {
                                ((!this.state.error) && (!this.isLoading) && (this.state.page != null)) && (PageRouteProvider.render(this.state.page, this._pageRef))
                            }

                        </main>
                    )
                }

                {
                    ((contextVisible) && (this.hasFooter) && (!this.state.error) && (!this.isLoading)) &&
                    (
                        <Footer version={ch.version}
                                links={this.props.footerLinks}
                                logo={this.props.footerLogo}
                                name={this.props.footerName}
                        />
                    )
                }

                {
                    ((this.state.error) || (this.state.isSpinning) || (this._tokenProcessing)) &&
                    (
                        <Spinner global />
                    )
                }

                {
                    ((contextVisible) && (!this.isLoading) && (this.props.cookieConsent)) &&
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

                {
                    (contextVisible) &&
                    (
                        <>
                            
                            <TakePicture ref={this._takePictureRef} />
                            
                            <a ref={this._downloadLink}
                               id={`${this.id}_downloadAnchor`}
                               style={{display: "none"}}
                            />
                            
                            <a ref={this._callToAnchorRef}
                               id={`${this.id}_callToAnchor`}
                               style={{display: "none"}}
                               href={""}
                            />

                            <a ref={this._emailToAnchorRef}
                               id={`${this.id}_emailToAnchor`}
                               style={{display: "none"}}
                               href={""}
                            />
                            
                        </>
                    )
                }

            </div>
        );
    }
}