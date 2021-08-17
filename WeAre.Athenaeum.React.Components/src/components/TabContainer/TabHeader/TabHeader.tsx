import React from "react";
import {BaseComponent, IBaseClassNames} from "@weare/athenaeum-react-common";
import Icon from "../../Icon/Icon";
import {ITabHeader, TabModel} from "../TabModel";

import styles from "../TabContainer.module.scss";
import TabContainerLocalizer from "../TabContainerLocalizer";

export interface ITabHeaderClassNames extends IBaseClassNames {
    readonly headerTab?: string;
    readonly headerLink?: string;
    readonly headerIcon?: string;
    readonly headerClose?: string;
}


interface ITabHeaderProps {
    model: TabModel;
    id: string;
    classNames?: ITabHeaderClassNames
}

interface ITabHeaderState {
}

export default class TabHeader extends BaseComponent<ITabHeaderProps, ITabHeaderState> implements ITabHeader {
    
    state: ITabHeaderState = {
    };
    
    private async onClickAsync(): Promise<void> {
        await this.model.container.activateTabAsync(this.model);
    }

    private async onCloseAsync(): Promise<void> {
        await this.model.container.closeTabAsync(this.model);
    }

    public get model(): TabModel {
        return this.props.model;
    }

    private get classNames(): ITabHeaderClassNames {
        const classNamesCopy: ITabHeaderClassNames = {...this.props.classNames} ?? {};

        Object.keys(styles).forEach((key: string) => !classNamesCopy[key] ? classNamesCopy[key] = styles[key] : classNamesCopy[key]);

        return classNamesCopy;
    }

    public render(): React.ReactNode {
        
        const model: TabModel = this.model;
        model.headerInstance = this;

        const closedStyle: string = (model.closed) && (styles.closed) || "";
        const activeStyle: string = (model.active) && ("active") || "";
        const activeCustomStyle: string = (model.active) && (model.activeClassName) || "";
        const iconStyle: string = (!!model.title) && (styles.hasText) || "";
        
        return (
            <li id={this.props.id} className={this.css("nav-item", styles.tab, closedStyle, model.className, activeCustomStyle, this.classNames.headerTab)} title={TabContainerLocalizer.get(model.tooltip)}>

                <a className={this.css("nav-link", activeStyle, this.classNames.headerLink)} onClick={async () => await this.onClickAsync()}>
                    
                    {
                        (model.icon) &&
                        (
                            <Icon className={this.css(styles.icon, iconStyle, this.classNames.headerIcon)} {...model.icon} />
                        )
                    }

                    {TabContainerLocalizer.get(model.title)}

                    {
                        (model.onClose) &&
                        (
                            <Icon className={this.css(styles.close, this.classNames.headerClose)} name="fa fa-times" onClick={async ()=> await this.onCloseAsync()} />
                        )
                    }

                </a>

            </li>
        );
    }
}
