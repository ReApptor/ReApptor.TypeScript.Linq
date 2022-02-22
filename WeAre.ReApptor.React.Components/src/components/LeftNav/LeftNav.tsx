import React from "react";
import {BaseAsyncComponent, IBaseAsyncComponentState, IGlobalClick, IGlobalKeydown} from "@weare/reapptor-react-common";
import {IMenuItem, IUserProfile} from "@weare/reapptor-react-components";
import {Utility} from "@weare/reapptor-toolkit";
import {MenuItem} from "../TopNav/MenuItem/MenuItem";
import {UserProfile} from "../TopNav/Profile/UserProfile/UserProfile";
import Profile from "../TopNav/Profile/Profile";
import Comparator from "../../helpers/Comparator";

import styles from "./LeftNav.module.scss";

export interface ILeftNavProps {
    id?: string;
    className?: string;
    autoCollapse?: boolean;
    fixed?: boolean;
    expandable?: boolean;
    height?: number | string;
    minHeight?: number | string;
    width?: number | string;
    minWidth?: number | string;
    toggleButtonId?: string;
    items?: IMenuItem[] | ((sender: LeftNav) => Promise<IMenuItem[]>);
    userProfile?: boolean | IUserProfile | ((sender: LeftNav) => IUserProfile) | null;
    onToggle?: (sender: LeftNav, expanded: boolean) => Promise<void>;
}

interface ILeftNavState extends IBaseAsyncComponentState<IMenuItem[]> {
    expanded: boolean,
    maxWidth: number | null;
    toggling: boolean;
}

export default class LeftNav extends BaseAsyncComponent<ILeftNavProps, ILeftNavState, IMenuItem[]> implements IGlobalClick, IGlobalKeydown {
    
    state: ILeftNavState = {
        data: null,
        isLoading: false,
        expanded: this.fixed,
        maxWidth: null,
        toggling: false
    };

    private getUserProfile(): IUserProfile | null {
        return (this.props.userProfile != null)
            ? (typeof this.props.userProfile === "function")
                ? this.props.userProfile(this)
                : (typeof this.props.userProfile === "boolean")
                    ? this.props.userProfile
                        ? Profile.findUserProfile()
                        : null
                    : this.props.userProfile
            : null;
    }

    private async onItemClickAsync(): Promise<void> {
        if ((this.autoCollapse) && (this.expandable)) {
            await this.collapseAsync(false);
        }
    }

    protected getEndpoint(): string {
        return "";
    }

    protected async fetchDataAsync(): Promise<IMenuItem[]> {
        return (this.props.items != null)
            ? (typeof this.props.items === "function")
                ? await this.props.items(this)
                : this.props.items
            : [];
    }
    
    public async onGlobalClick(e: React.SyntheticEvent): Promise<void> {
        if ((this.expanded) && (this.expandable) && (this.autoCollapse)) {
            const target = e.target as Node;

            const outside: boolean = Utility.clickedOutside(target, this.id, this.toggleButtonId);

            if (outside) {
                await this.collapseAsync();
            }
        }
    }

    public async onGlobalKeydown(e: React.KeyboardEvent): Promise<void> {
        if ((this.expanded) && (this.expandable) && (this.autoCollapse) && (e.keyCode == 27)) {
            await this.collapseAsync();
        }
    }

    public isAsync(): boolean {
        return (this.props.items != null) && (typeof this.props.items === "function");
    }

    public get expandable(): boolean {
        return (this.props.expandable !== false);
    }

    public get fixed(): boolean {
        return (this.props.fixed === true);
    }

    public get absolute(): boolean {
        return (!this.fixed);
    }

    public get autoCollapse(): boolean {
        return (
            (this.props.autoCollapse === true) ||
            ((this.props.autoCollapse !== false) && (this.absolute))
        )
    }

    public get expanded(): boolean {
        return this.state.expanded;
    }

    public get toggleButtonId(): string {
        return this.props.toggleButtonId ?? `${this.id}_toggleButton`;
    }

    public get toggling(): boolean {
        return this.state.toggling;
    }

    public get collapsed(): boolean {
        return !this.expanded;
    }

    public get items(): IMenuItem[] {
        return this.state.data || [];
    }

    public get topItems(): IMenuItem[] {
        return this.items.where(item => !item.bottom);
    }

    public get bottomItems(): IMenuItem[] {
        return this.items.where(item => !!item.bottom);
    }
    
    public async initializeAsync(): Promise<void> {
        if ((this.props.items != null) && (typeof this.props.items !== "function")) {
            this.state.data = this.props.items;
        }

        await super.initializeAsync();
    }

    public async collapseAsync(animation: boolean = true): Promise<void> {
        if ((this.expandable) && (this.expanded)) {
            await this.toggleAsync(animation);
        }
    }

    public async expandAsync(animation: boolean = true): Promise<void> {
        if ((this.expandable) && (this.collapsed)) {
            await this.toggleAsync(animation);
        }
    }
    
    public async toggleAsync(animation: boolean = true): Promise<void> {
        if ((this.expandable) && (!this.toggling)) {

            if (animation) {
                const expanding: boolean = !this.expanded;
                const collapsing: boolean = !expanding;

                const node: JQuery = this.getNode();

                // check current state
                const originalMaxWidth: string = node.css("max-width");
                const originalWhiteSpace: string = node.css("white-space");

                let maxWidth: number = 0;
                if (collapsing) {
                    maxWidth = node.width()!;
                }

                // override state
                node.css("max-width", maxWidth);
                node.css("white-space", "nowrap");

                this.state.toggling = true;

                if (expanding) {
                    await this.setState({expanded: true});
                }

                const step: number = 15;
                const delay: number = 5;

                while (true) {

                    if (expanding) {

                        maxWidth += step;

                        node.css("max-width", maxWidth);

                        const newWidth: number = node.width()!;

                        if (newWidth < maxWidth) {
                            break;
                        }
                    } else {
                        maxWidth -= step;

                        if (maxWidth <= 0) {
                            break;
                        }

                        node.css("max-width", maxWidth);
                    }

                    await Utility.wait(delay);
                }

                // restore state
                node.css("max-width", originalMaxWidth);
                node.css("white-space", originalWhiteSpace);

                this.state.toggling = false;

                if (collapsing) {
                    await this.setState({expanded: false});
                }
            } else {
                await this.setState({expanded: !this.expanded});
            }

            if (this.props.onToggle) {
                await this.props.onToggle(this, this.expanded);
            }
        }
    }
    
    public renderItems(): React.ReactNode {
        return (
            <>
                {
                    this.topItems.map((item: IMenuItem, index: number) =>
                        (
                            <MenuItem key={index} {...item} onClick={() => this.onItemClickAsync()}/>
                        )
                    )
                }

                <div className={styles.expander}/>

                {
                    this.bottomItems.map((item: IMenuItem, index: number) =>
                        (
                            <MenuItem key={index} {...item} onClick={() => this.onItemClickAsync()}/>
                        )
                    )
                }
            </>
        );
    }
    
    public async componentWillReceiveProps(nextProps: ILeftNavProps): Promise<void> {
        
        const newItems: boolean = (!Comparator.isEqual(this.props.items, nextProps.items));

        await super.componentWillReceiveProps(nextProps);

        if (newItems) {
            await this.reloadAsync();
        } else {
            await this.reRenderAsync();
        }
    }

    public render(): React.ReactNode {

        const userProfile: IUserProfile | null = this.getUserProfile();
        
        const inlineStyles: React.CSSProperties = {
            height: this.props.height || undefined,
            minHeight: this.props.minHeight || undefined,
            width: this.props.width || undefined,
            minWidth: this.props.minWidth || undefined
        };
        
        const expandedStyle: any = (this.expanded) && (styles.expanded);
        const collapsedStyle: any = (this.collapsed) && (styles.collapsed);
        const fixedStyle: any = (this.fixed) && (styles.fixed);
        const absoluteStyle: any = (this.absolute) && (styles.absolute);
        
        return (
            <nav id={this.id} className={this.css(styles.leftNav, this.props.className, expandedStyle, collapsedStyle, fixedStyle, absoluteStyle)} style={inlineStyles}>

                {
                    (this.expanded) &&
                    (
                        <div className={this.css(styles.container, expandedStyle, collapsedStyle)}>
                            
                            <div className={styles.userProfileContainer}>
                                
                                { (userProfile) && (<UserProfile {...userProfile}/>) }
                                
                            </div>

                            <div className={styles.itemsContainer}>

                                {
                                    (this.items) && (this.renderItems())
                                }
                                
                            </div>

                        </div>
                    )
                }
                
            </nav>
        );
    }
}