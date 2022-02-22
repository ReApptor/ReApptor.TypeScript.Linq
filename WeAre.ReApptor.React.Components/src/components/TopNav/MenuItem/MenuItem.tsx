import React from "react";
import {BaseComponent, PageRouteProvider} from "@weare/reapptor-react-common";
import {IconSize, IIconProps, IMenuItem, TMenuItemRoute} from "@weare/reapptor-react-components";
import Icon from "../../Icon/Icon";
import TopNavLocalizer from "../TopNavLocalizer";

import styles from "./MenuItem.module.scss";

interface IMenuItemProps extends IMenuItem {
    id?: string;
    onClick?: (sender: MenuItem) => Promise<void>;
}

interface IMenuItemState {
}

export class MenuItem extends BaseComponent<IMenuItemProps, IMenuItemState> {

    state: IMenuItemState = {
    };

    private async onClickAsync(e: React.MouseEvent<HTMLDivElement>): Promise<boolean> {
        e.preventDefault();

        if (this.route) {
            if (typeof this.route === "function") {
                await this.route(this.props);
            } else {
                await PageRouteProvider.redirectAsync(this.route);
            }
        }

        if (this.props.onClick) {
            await this.props.onClick(this);
        }

        return false;
    }
    
    private getCount(): number | null {
        return (this.props.count != null)
            ? (typeof this.props.count === "function")
                ? this.props.count()
                : this.props.count
            : null;
    }

    public get route(): TMenuItemRoute | null {
        return this.props.route ?? null;
    }

    public get isSeparator(): boolean {
        return (this.label === "-");
    }

    public get label(): string {
        return this.props.label;
    }

    public get icon(): IIconProps | string | null {
        return this.props.icon ?? null;
    }

    public get count(): number | null {
        return this.getCount();
    }

    public render(): React.ReactNode {
        
        const count: number | null = this.getCount();
        
        const separatorStyle: any = (this.isSeparator) && styles.separator;
        
        return (
            <div id={this.id} className={this.css(styles.menuItem, this.props.className, separatorStyle)}>

                {
                    (this.isSeparator)
                        ?
                        (
                            <hr className={this.css(styles.content, separatorStyle)}/>
                        )
                        :
                        (
                            <div className={this.css(styles.content)} onClick={(e: React.MouseEvent<HTMLDivElement>) => this.onClickAsync(e)}>

                                {
                                    (this.icon) &&
                                    (
                                        Icon.renderIcon(this.icon, this.css(styles.element, styles.icon), IconSize.X2)
                                    )
                                }

                                {
                                    (this.label) &&
                                    (
                                        <span className={this.css(styles.element, styles.label)}>{TopNavLocalizer.get(this.label)}</span>
                                    )
                                }

                                {
                                    (count != null) &&
                                    (
                                        <div className={this.css(styles.element, styles.count, styles.inline, this.props.countClassName)}>
                                            <span>{count}</span>
                                        </div>
                                    )
                                }

                            </div>
                        )
                }

            </div>
        );
    }
}