import React from "react";
import {BaseAsyncComponent, ch, IBaseAsyncComponentState, IBasePage, IGlobalClick, IManualProps, PageRoute, PageRouteProvider} from "@weare/athenaeum-react-common";
import Link from "../Link/Link";
import Hamburger from "./Hamburger/Hamburger";
import LanguageDropdown from "./LanguageDropdown/LanguageDropdown";
import TopNavLocalizer from "@/components/TopNav/TopNavLocalizer";

import logo from "./renta-logo.png"
import styles from "./TopNav.module.scss";

export interface IMenuItem {
    route: PageRoute;
    label: string;
}

export interface ITopNavProps {
    applicationName?: string;
    onLogoClick?(sender: TopNav): Promise<void>;
}

interface ITopNavState extends IBaseAsyncComponentState<IMenuItem[]> {
    isHamburgerOpen: boolean,
}

export default class TopNav extends BaseAsyncComponent<ITopNavProps, ITopNavState, IMenuItem[]> implements IGlobalClick {
    state: ITopNavState = {
        isHamburgerOpen: false,
        data: null,
        isLoading: false,
    };

    private async backAsync(): Promise<void> {
        await PageRouteProvider.back();
    }
    
    private async toggleHamburgerAsync(): Promise<void> {
        let isHamburgerOpen: boolean = !this.state.isHamburgerOpen;
        await this.setState({ isHamburgerOpen });
    }

    private async closeHamburgerAsync(): Promise<void> {
        await this.setState({ isHamburgerOpen: false });
    }

    public async onGlobalClick(e: React.SyntheticEvent): Promise<void> {
        let target = e.target as Node;
        let container = document.querySelector(`.${styles.right_hamburgerIcon}`);
        let outsideHamburgerIcon: boolean = ((container != null) && (!container.contains(target)));
        if (outsideHamburgerIcon) {
            await this.closeHamburgerAsync();
        }
    }

    public async onLogoClick(): Promise<void> {
        if (this.props.onLogoClick) {
            await this.props.onLogoClick(this);
        }
    }

    public async componentDidMount(): Promise<void> {
        TopNav.mountedInstance = this;
        await super.componentDidMount();
    }

    public async componentWillUnmount(): Promise<void> {
        TopNav.mountedInstance = null;
        await super.componentWillUnmount();
    }
    
    private async onLanguageChangeAsync(language: string): Promise<void> {
        await ch.setLanguageAsync(language);
    }

    protected getEndpoint(): string {
        return "api/Application/GetTopNavItems";
    }

    public get items(): IMenuItem[] {
        return this.state.data || [];
    }
    
    private get manual(): IManualProps {
        const page: IBasePage = ch.getPage();
        return page.getManualProps();
    }

    public render(): React.ReactNode {
        return (
            <nav className={styles.navigation}>
                <React.Fragment>
                    
                    <div className={styles.left}>
                        
                        <div className={styles.left_backIcon} onClick={async () => await this.backAsync()}>
                            <i className="fas fa-chevron-circle-left" />
                        </div>

                        <img src={logo} alt="renta" onClick={async () => await this.onLogoClick()} />
                        
                    </div>

                    <div className={styles.middle}>
                        {
                            this.items.map((item, index) => (<Link key={index} className={this.css(styles.middle_link)} route={item.route}>{TopNavLocalizer.get(item.label)}</Link>))
                        }
                    </div>

                    <div className={styles.right}>
                        
                        {
                            ((this.manual.manual) || (this.manual.onClick))  && 
                            (
                                <span>{this.manual.icon || "question-circle"}</span>
                                // <Icon name={this.manual.icon || "question-circle"} 
                                //       className={this.css(styles.right_infoIcon, this.desktop && styles.hover)} 
                                //       style={IconStyle.Regular} size={IconSize.X2}
                                //       toggleModal={!this.manual.onClick} dataTarget="page-help-info" onClick={this.manual.onClick}
                                // />
                            )
                        }
                        
                        {
                            (this.items.length > 0) &&
                            (
                                <div className={styles.right_hamburgerIcon} onClick={async () => await this.toggleHamburgerAsync()}>
                                    <i className="fas fa-2x fa-bars" />
                                </div>
                            )
                        }
                        
                        <LanguageDropdown languages={TopNavLocalizer.supportedLanguages} currentLanguage={TopNavLocalizer.language} changeLanguageCallback={async (language) => await this.onLanguageChangeAsync(language)} />
                    
                    </div>

                    <Hamburger menuItems={this.items} open={this.state.isHamburgerOpen} />
                    
                </React.Fragment>
            </nav>
        );
    }

    public static mountedInstance: TopNav | null = null;
}