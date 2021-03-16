import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import Icon from "../../Icon/Icon";
import {ITabHeader, TabModel} from "../TabModel";

import styles from "../TabContainer.module.scss";
import TabContainerLocalizer from "@weare/athenaeum-react-components/components/TabContainer/TabContainerLocalizer";

interface ITabHeaderProps {
    model: TabModel;
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
    
    public render(): React.ReactNode {
        
        const model: TabModel = this.model;
        model.headerInstance = this;

        const closedStyle: string = (model.closed) && (styles.closed) || "";
        const activeStyle: string = (model.active) && ("active") || "";
        const activeCustomStyle: string = (model.active) && (model.activeClassName) || "";
        const iconStyle: string = (!!model.title) && (styles.hasText) || "";
        
        return (
            <li className={this.css("nav-item", styles.tab, closedStyle, model.className, activeCustomStyle)} title={TabContainerLocalizer.get(model.tooltip)}>

                <a className={this.css("nav-link", activeStyle)} onClick={async () => await this.onClickAsync()}>
                    
                    {
                        (model.icon) &&
                        (
                            <Icon className={this.css(styles.icon, iconStyle)} {...model.icon} />
                        )
                    }

                    {TabContainerLocalizer.get(model.title)}

                    {
                        (model.onClose) &&
                        (
                            <Icon className={styles.close} name="fa fa-times" onClick={async ()=> await this.onCloseAsync()} />
                        )
                    }

                </a>

            </li>
        );
    }
}
