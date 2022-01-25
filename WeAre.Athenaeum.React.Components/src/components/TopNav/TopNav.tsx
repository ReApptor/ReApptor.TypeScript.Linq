import React from "react";
import {BaseAsyncComponent, ch, IBaseAsyncComponentState, IBasePage, IGlobalClick, IManualProps, PageRoute, PageRouteProvider} from "@weare/athenaeum-react-common";
import Link from "../Link/Link";
import Hamburger from "./Hamburger/Hamburger";
import LanguageDropdown from "./LanguageDropdown/LanguageDropdown";
import Icon, {IconSize, IconStyle} from "../Icon/Icon";
import Search from "./Search/Search";
import {ILanguage} from "@weare/athenaeum-toolkit";
import TopNavLocalizer from "./TopNavLocalizer";

import styles from "./TopNav.module.scss";

export interface IMenuItem {
    route: PageRoute;
    label: string;
}

export interface IShoppingCart {
    route: PageRoute;
    className?: string;
    productsCount: number;
}

export interface ITopNavProps {
    className?: string;
    languageClassName?: string;
    logo?: any;
    logoText?: string;
    applicationName?: string;
    searchPlaceHolder?: () => string;
    languages?: () => ILanguage[];
    
    onShoppingCartClick?(sender: TopNav): Promise<void>;
    onSearchClick?(searchTerm: string): Promise<void>;
    fetchShoppingCart?(sender: TopNav): Promise<IShoppingCart>;
    fetchItems?(sender: TopNav): Promise<IMenuItem[]>;
    onLogoClick?(sender: TopNav): Promise<void>;
}

interface ITopNavState extends IBaseAsyncComponentState<IMenuItem[]> {
    isHamburgerOpen: boolean;
    shoppingCart: IShoppingCart | null;
}

export default class TopNav extends BaseAsyncComponent<ITopNavProps, ITopNavState, IMenuItem[]> implements IGlobalClick {
    state: ITopNavState = {
        isHamburgerOpen: false,
        data: null,
        isLoading: false,
        shoppingCart: null
    };

    private async backAsync(): Promise<void> {
        PageRouteProvider.back();
    }

    private async onShoppingCartClickAsync(): Promise<void> {
        if (this.props.onShoppingCartClick) {
            await this.props.onShoppingCartClick(this);
        }
    }

    private async toggleHamburgerAsync(): Promise<void> {
        const isHamburgerOpen: boolean = !this.state.isHamburgerOpen;
        await this.setState({isHamburgerOpen});
    }

    private async closeHamburgerAsync(): Promise<void> {
        await this.setState({isHamburgerOpen: false});
    }

    public async onGlobalClick(e: React.SyntheticEvent): Promise<void> {
        const target = e.target as Node;
        const container = document.querySelector(`.${styles.right_hamburgerIcon}`);
        const outsideHamburgerIcon: boolean = ((container != null) && (!container.contains(target)));
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

    protected async fetchDataAsync(): Promise<IMenuItem[]> {
        if (this.props.fetchShoppingCart) {
            const shoppingCart: IShoppingCart = await this.props.fetchShoppingCart(this);
            await this.setState({shoppingCart})
        }
        if (this.props.fetchItems) {
            return await this.props.fetchItems(this);
        }

        return super.fetchDataAsync();
    }

    private get searchPlaceHolder(): string {
        if (this.props.searchPlaceHolder) {
            return this.props.searchPlaceHolder();
        }
        
        return "";
    }

    private get languages(): ILanguage[] {
        if (this.props.languages) {
            return this.props.languages();
        }

        return TopNavLocalizer.supportedLanguages;
    }

    protected getEndpoint(): string {
        return "/api/Application/GetTopNavItems";
    }

    public get items(): IMenuItem[] {
        return this.state.data || [];
    }

    public get shoppingCart(): IShoppingCart | null {
        return this.state.shoppingCart;
    }

    private get manual(): IManualProps {
        const page: IBasePage | null = ch.findPage();
        return (page)
            ? page.getManualProps()
            : {};
    }

    public render(): React.ReactNode {
        return (
            <nav className={this.css(styles.navigation, this.props.className)}>
                <React.Fragment>

                    <div className={styles.left}>

                        <div className={styles.left_backIcon} onClick={async () => await this.backAsync()}>
                            <i className="fas fa-chevron-circle-left"/>
                        </div>

                        {
                            (this.props.logo) && (
                                <img src={this.props.logo}
                                     alt={this.props.logoText || "renta"}
                                     onClick={async () => await this.onLogoClick()
                                     }/>
                            )
                        }

                    </div>

                    <div className={styles.middle}>
                        {
                            this.items.map((item, index) => (<Link key={index} className={this.css(styles.middle_link)} route={item.route}>{TopNavLocalizer.get(item.label)}</Link>))
                        }
                    </div>

                    <div className={styles.right}>

                        {
                            ((this.manual.manual) || (this.manual.onClick)) &&
                            (
                                <Icon name={this.manual.icon || "question-circle"}
                                      className={this.css(styles.right_infoIcon, this.desktop && styles.hover)}
                                      style={IconStyle.Regular} size={IconSize.X2}
                                      toggleModal={!this.manual.onClick} dataTarget="page-help-info" onClick={this.manual.onClick}
                                />
                            )
                        }

                        {
                            (this.shoppingCart) && (
                                <>
                                    <Icon name={"shopping-cart"}
                                          size={IconSize.X2}
                                          className={this.props.className ?? styles.right_shoppingCart}
                                          onClick={async () => await this.onShoppingCartClickAsync()}
                                    />
                                    {
                                        this.shoppingCart.productsCount > 0 && (
                                            <span className={styles.right_shoppingCartCount}>{this.shoppingCart.productsCount}</span>
                                        )
                                    }
                                </>
                            )
                        }
                        {
                            (this.props.onSearchClick) && (
                                <Search
                                    searchPlaceHolder={this.searchPlaceHolder}
                                    onSearch={searchTerm => this.props.onSearchClick!(searchTerm)}
                                />
                            )

                        }

                        {
                            (this.items.length > 0) && (
                                <div className={styles.right_hamburgerIcon}
                                     onClick={async () => await this.toggleHamburgerAsync()}>
                                    <i className="fas fa-2x fa-bars"/>
                                </div>
                            )
                        }


                        <LanguageDropdown className={this.props.languageClassName}
                                          languages={this.languages}
                                          currentLanguage={TopNavLocalizer.language}
                                          changeLanguageCallback={async (language) => await this.onLanguageChangeAsync(language)}
                        />

                    </div>

                    <Hamburger menuItems={this.items} open={this.state.isHamburgerOpen}/>

                </React.Fragment>
            </nav>
        );
    }

    public static mountedInstance: TopNav | null = null;
}