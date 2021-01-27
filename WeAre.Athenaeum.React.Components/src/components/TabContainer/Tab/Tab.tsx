import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {ITab, ITabDefinition, TabContainerModel, TabModel, TabTransformer} from "../TabModel";

import styles from "../TabContainer.module.scss";

export interface ITabProps extends ITabDefinition {
    id: string;
}

interface ITabState {
}

export default class Tab extends BaseComponent<ITabProps, ITabState> implements ITab {
    
    state: ITabState = {
    };

    private _model: TabModel | null = null;

    public get model(): TabModel {
        return this._model || (this._model = TabTransformer.toTab(this.props, this.id));
    }
    
    public async componentWillReceiveProps(nextProps: ITabProps): Promise<void> {
        await super.componentWillReceiveProps(nextProps);

        const newClose: boolean = (nextProps.onClose !== this.model.onClose);
        const newIcon: boolean = (nextProps.icon !== this.model.icon);
        const newClassName: boolean = (nextProps.className !== this.model.className);
        const newTitle: boolean = (nextProps.title !== this.model.title);
        const newTooltip: boolean = (nextProps.tooltip !== this.model.tooltip);
        
        if (newClose || newIcon || newClassName || newTitle || newTooltip) {
            this.model.onClose = nextProps.onClose;
            this.model.icon = nextProps.icon || null;
            this.model.className = nextProps.className || null;
            this.model.title = nextProps.title || "";
            this.model.tooltip = nextProps.tooltip || "";
            
            await this.model.reRenderAsync();
        }
    }

    public initialize(container: TabContainerModel, index: number): void {
        this._model = null;
        this.model.container = container;
        this.model.index = index;
    }

    public readonly isTab: boolean = true;

    public render(): React.ReactNode {

        const model: TabModel = this.model;
        model.instance = this;
        
        const activeStyle: any = (model.active) && ("active");
        const scaleStyle: any = (model.container.scale) && "h-100";
        
        return (
            <div id={this.id} className={this.css("tab-pane", styles.tab, activeStyle, scaleStyle)}>
                
                {this.children}
                
            </div>
        );
    }
}