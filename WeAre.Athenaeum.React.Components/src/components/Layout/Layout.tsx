import React from "react";
import $ from "jquery";
import queryString, {ParsedQuery} from "query-string";
import {Utility, FileModel} from "@weare/athenaeum-toolkit";
import {ch, WebApplicationType, SwipeDirection, PageRouteProvider, IBasePage, ILayoutPage, ApplicationContext, IGlobalResize, IBaseAsyncComponentState, BaseAsyncComponent, IAsyncComponent} from "@weare/athenaeum-react-common";
import TopNav from "../TopNav/TopNav";
import Footer from "../Footer/Footer";
import Spinner from "../Spinner/Spinner";

import styles from "./Layout.module.scss";

interface ILayoutState extends IBaseAsyncComponentState<ApplicationContext> {
    page: IBasePage | null;
    isSpinning: boolean;
    error: boolean;
}

export default class Layout extends BaseAsyncComponent<{}, ILayoutState, ApplicationContext> implements ILayoutPage, IGlobalResize {

    state: ILayoutState = {
        isLoading: false,
        isSpinning: false,
        data: null,
        page: null,
        error: false
    };

    private readonly _pageRef: React.RefObject<IBasePage> = React.createRef();
    private readonly _downloadLink: React.RefObject<HTMLAnchorElement> = React.createRef();

    private _mobile: boolean = this.mobile;
    private _touch: React.Touch | null = null;
    private _startTouch: React.Touch | null = null;
    private _swiping: boolean = false;
    
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
            await this.postAsync("api/Application/TokenLogin", token);

            await PageRouteProvider.changeUrlWithoutReload();
        }
    }

    private isMobileApp(): boolean {
        const href: string = document.location.href.toLowerCase();
        return href.endsWith("/mobile") || href.endsWith("/mobile/");
    }

    private isPwaApp(): boolean {
        return (
            (window.matchMedia('(display-mode: standalone)').matches) ||
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

    protected getEndpoint(): string {
        const timezoneOffset: number = Utility.timezoneOffset;
        const applicationType: WebApplicationType = this.getApplicationType(); 
        return "api/Application/GetContext?timezoneOffset=" + timezoneOffset + "&applicationType=" + applicationType;
    }

    public isLayout(): boolean { return true; }

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
            await this.setState({ isSpinning: isSpinning });
        }
    }

    public isSpinning(): boolean {
        return this.state.isSpinning;
    }

    public async setPageAsync(page: IBasePage): Promise<void> {

        await this.setState({ page: page });
        
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
    
    public initializeTooltips(): void {
        const tooltip = $('[data-toggle="tooltip"]');

        if (tooltip.length > 0) {
            tooltip.tooltip({
                trigger: 'click',
                placement: 'top',
            });

            tooltip.on('show.bs.tooltip', () => {
                $('.tooltip').not(tooltip).remove();
            });
        }
    }

    public reinitializeTooltips(): void {
        $('[data-toggle="tooltip"]').tooltip('dispose');
        
        this.initializeTooltips();
    }
    
    private removeTooltip(): void {
        $('.tooltip').remove();
    }
    
    //Do not delete - needs for REACT error handling
    // noinspection JSUnusedGlobalSymbols
    public static getDerivedStateFromError(): any {
        return { error: true };
    }

    public async componentDidCatch(error: Error, errorInfo: React.ErrorInfo): Promise<void> {
        
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
            <div className={styles.layout}
                 onTouchStart={async (e: React.TouchEvent) => await this.onTouchStartHandlerAsync(e)}
                 onTouchEnd={async (e: React.TouchEvent) => await this.onTouchEndHandlerAsync(e)}
                 onTouchMove={async (e: React.TouchEvent) => await this.onTouchMoveHandlerAsync(e)}>
                
                {
                    (this.hasData) && <TopNav applicationName={this.applicationName} />
                }

                <main className={styles.main}>
                    {
                        ((!this.state.error) && (!this.isLoading) && (this.state.page != null)) && (PageRouteProvider.render(this.state.page, this._pageRef))
                    }
                </main>
    
                {
                    ((!this.state.error) && (!this.isLoading)) &&
                    (
                        <Footer version={ch.version} />
                    )
                }

                {
                    ((this.state.error) || (this.state.isSpinning)) && 
                    (
                        <Spinner global />
                    )
                }

                <a ref={this._downloadLink} style={{display: "none"}} />
                
            </div>
        );
    }
}