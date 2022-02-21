import React from "react";
import {BaseComponent, ch, PageRoute, PageRouteProvider} from "@weare/reapptor-react-common";
import {IBaseWidget, IBaseWidgetProps} from "../WidgetContainer/BaseWidget";
import Icon, {IconSize, IconStyle, IIconProps} from "../Icon/Icon";

import widgetStyles from "../WidgetContainer/WidgetContainer.module.scss";
import styles from "./NavigationWidget.module.scss";
import NavigationWidgetLocalizer from "./NavigationWidgetLocalizer";

export interface INavigationWidgetProps extends IBaseWidgetProps {
    className?: string;
    transparent?: boolean;
    responsive?: boolean;
    //PREV:
    canPrev?: boolean;
    prevLabel?: string;
    prevDescription?: string;
    prevRoute?: PageRoute;
    onPrevClick?(): Promise<void>;
    prevIcon?: IIconProps;
    //NEXT (default):
    can?: boolean;
    route?: PageRoute;
    onClick?(): Promise<void>;
    icon?: IIconProps,
}

interface INavigationWidgetState {
    transparent: boolean,
}

export default class NavigationWidget extends BaseComponent<INavigationWidgetProps, INavigationWidgetState> implements IBaseWidget {

    state: INavigationWidgetState = {
        transparent: (this.props.transparent || false)
    };

    protected async onPrevClickAsync(e: React.MouseEvent): Promise<void> {
        if ((this.isMounted) && (this.canPrev)) {
            e.stopPropagation();

            if (this.props.onPrevClick) {
                await this.props.onPrevClick();
            } else if (this.props.prevRoute) {
                await ch.swipeRightAsync();
                await PageRouteProvider.redirectAsync(this.props.prevRoute);
            } else {
                await ch.swipeRightAsync();
                await PageRouteProvider.back();
            }
        }
    }

    protected async onClickAsync(e: React.MouseEvent): Promise<void> {
        if ((this.isMounted) && (this.canNext)) {
            e.stopPropagation();

            if (this.props.onClick) {
                await this.props.onClick();
            } else if (this.props.route) {
                await ch.swipeLeftAsync();
                await PageRouteProvider.redirectAsync(this.props.route);
            }
        }
    }
    
    protected get canPrev(): boolean {
        return (this.props.canPrev !== false);
    }
    
    protected get canNext(): boolean {
        return (this.props.can !== false);
    }

    protected get prevIcon(): IIconProps {
        return (this.mobileStyle)
            ? this.props.prevIcon || { name: "chevron-circle-left", style: IconStyle.Solid, size: IconSize.X3 }
            : this.props.prevIcon || { name: "arrow-alt-circle-left", style: IconStyle.Regular, size: IconSize.X2 }
    }

    protected get nextIcon(): IIconProps {
        return (this.mobileStyle)
            ? this.props.prevIcon || { name: "chevron-circle-right", style: IconStyle.Solid, size: IconSize.X3 }
            : this.props.prevIcon || { name: "arrow-alt-circle-right", style: IconStyle.Regular, size: IconSize.X2 };
    }

    protected get prevLabel(): string {
        return this.props.prevLabel || NavigationWidgetLocalizer.previous;
    }

    protected get prevDescription(): string {
        return this.props.prevDescription || NavigationWidgetLocalizer.returnToPrevious;
    }

    protected get label(): string {
        return this.props.label || NavigationWidgetLocalizer.next;
    }

    protected get description(): string {
        return this.props.description || NavigationWidgetLocalizer.goToNext;
    }

    protected get wide(): boolean {
        return true;
    }
    
    protected get mobileStyle(): boolean {
        return this.responsive && this.mobile;
    }
    
    protected get desktopStyle(): boolean {
        return !this.mobileStyle;
    }

    public async minimizeAsync(): Promise<void> {
    }

    public async maximizeAsync(): Promise<void> {
    }
    
    public get minimized(): boolean {
        return false;
    }
    
    public get responsive(): boolean {
        return (this.props.responsive == true);
    }

    public isWidget(): boolean { return true; }

    public get transparent(): boolean {
        return (this.state.transparent);
    }

    render(): React.ReactNode {
        
        const mobileStyle = (this.mobileStyle) && styles.mobileStyle;
        const disabledPrevStyle = (!this.canPrev) && styles.disabled;
        const disabledNextStyle = (!this.canNext) && styles.disabled;
        
        return (
            <div className={this.css(this.props.className, styles.navigation, mobileStyle, "col-md-12")}>
                <div className="row">
                    
                    <div id={this.id} className={this.css(styles.widget, widgetStyles.widget, this.props.className, "col-6")}>
                        <div title={this.toSingleLine(this.prevDescription || this.props.label)}
                             className={this.css(styles.content, widgetStyles.compact, this.transparent && widgetStyles.transparent, widgetStyles.content, disabledPrevStyle)}
                             onClick={async (e: React.MouseEvent) => await this.onPrevClickAsync(e)}>
        
                            <div className={this.css(widgetStyles.compactContainer, styles.compactContainer, styles.left)}>
                                
                                <Icon {...this.prevIcon} />
    
                                {
                                    (this.desktopStyle) &&
                                    (
                                        <div className={widgetStyles.labelAndDescription}>
                                            <div><span>{this.prevLabel}</span></div>
                                            <div className={widgetStyles.description}>
                                                <span>{this.toSingleLine(this.prevDescription)}</span>
                                            </div>
                                        </div>
                                    )
                                }
                                
                            </div>
                        </div>
                    </div>
                
                    <div id={this.id} className={this.css(styles.widget, widgetStyles.widget, this.props.className, "col-6")}>
                        <div title={this.toSingleLine(this.description || this.props.label)}
                             className={this.css(styles.content, widgetStyles.compact, this.transparent && widgetStyles.transparent, widgetStyles.content, disabledNextStyle)}
                             onClick={async (e: React.MouseEvent) => await this.onClickAsync(e)}>
    
                            <div className={this.css(widgetStyles.compactContainer, styles.compactContainer, styles.right)}>
                                
                                {
                                    (this.desktopStyle) &&
                                    (
                                        <div className={widgetStyles.labelAndDescription}>
                                            <div><span>{this.label}</span></div>
                                            <div className={widgetStyles.description}>
                                                <span>{this.toSingleLine(this.description)}</span>
                                            </div>
                                        </div>
                                    )
                                }
                                
                                <Icon {...this.nextIcon} />
                                
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}
