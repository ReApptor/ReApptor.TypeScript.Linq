import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {ITab, ITabContainer, ITabContainerDefinition, TabContainerModel, TabModel, TabTransformer} from "./TabModel";
import TabHeader from "./TabHeader/TabHeader";

import "./BootstrapOverride.scss";
import styles from "./TabContainer.module.scss";

interface ITabContainerProps extends ITabContainerDefinition {
}

interface ITabContainerState {
    generation: number;
}

export default class TabContainer extends BaseComponent<ITabContainerProps, ITabContainerState> implements ITabContainer {

    state: ITabContainerState = {
        generation: 0
    };
    
    private _model: TabContainerModel | null = null;

    private getTabs(): ITab[] {
        return this
            .childComponents
            .filter(item => ((item as any).isTab))
            .map(item => item as ITab);
    }
    
    private async forcedReRenderAsync(): Promise<void> {
        await this.setState({ generation: this.state.generation + 1 });
    }
    
    private initialized(): boolean {
        let initialized: boolean = false;
        if (this._model != null) {
            const modelTabIds: string[] = this._model.getTabIds();
            if (modelTabIds.length == this.children.length) {
                const tabIds: string[] = this.getTabs().map(tab => tab.id);
                initialized = (tabIds.length === modelTabIds.length) && (tabIds.every((id, index) => (id === modelTabIds[index])));
            }
        }
        return initialized;
    }

    public async componentDidMount(): Promise<void> {
        if (!this.initialized()) {
            await this.forcedReRenderAsync();
            
            if (this.model.onSelect) {
                const activeTab: TabModel | null = this.model.getActiveTab();
                if (activeTab) {
                    await this.model.onSelect(activeTab);
                }
            }
        }
    }

    public get model(): TabContainerModel {
        const model: TabContainerModel = this._model || (this._model = TabTransformer.toTabContainer(this.props, this.id));
        if (!this.initialized()) {
            const activeIndex: number = model.activeIndex;
            const tabs: ITab[] = this.getTabs();
            model.tabs = [];
            tabs.forEach((tab, index) => {
                tab.initialize(model, index);
                const tabModel: TabModel = tab.model;
                model.tabs.push(tabModel);
            });
            model.activateDefault(activeIndex);
        }
        return model;
    }

    render(): React.ReactNode {

        const model: TabContainerModel = this.model;
        model.instance = this;
        
        return (
            <div id={this.id} className={this.css(styles.tabContainer, "tabContainer", this.props.className)}>
                
                {/* Nav tabs */}
                <div className={this.css(styles.navigationContainer)}>

                    {/*<Icon name="fa fa-chevron-left" className={this.css(styles.navigationIcon, styles.left)} onClick={async () => await this.scrollLeftAsync()} />*/}

                    <div className={styles.scrollableContainer}>
                        <ul className={this.css("nav nav-tabs", styles.navTabs)}>
                            {
                                model.tabs.map((tab: TabModel) =>
                                    (
                                        <TabHeader id={"tab_" + tab.id} model={tab} key={"tab_header_" + tab.id} />
                                    )
                                )
                            }
                        </ul>
                    </div>

                    {/*<Icon name="fa fa-chevron-right" className={this.css(styles.navigationIcon, styles.right)} onClick={async () => await this.scrollRightAsync()} />*/}

                </div>

                {/* Tab content */}
                <div className="tab-content">
                    
                    {this.children}            
                    
                </div>
                
            </div>
        );
    }
}