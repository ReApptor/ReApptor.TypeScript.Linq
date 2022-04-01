import React from "react";
import {IIconProps} from "../Icon/Icon";
import {DataStorageType, IBaseComponent, UserInteractionDataStorage} from "@weare/reapptor-react-common";
import ConfirmationDialog, {ConfirmationDialogTitleCallback, IConfirmation} from "../ConfirmationDialog/ConfirmationDialog";

export enum TabRenderType {
    /**
     * Tab content will be always rendered
     */
    Always,

    /**
     * Only active tab content will be rendered
     */
    ActiveOnly,

    /**
     * Tab content will be rendered once during tab activation
     */
    Once
}

export interface ITabContainerDefinition {
    id?: string;
    className?: string;
    scale?: boolean;
    dataStorageType?: DataStorageType;
    renderType?: TabRenderType;
    onClose?(tab: TabModel): Promise<void>;
    onSelect?(tab: TabModel): Promise<void>;
}

export interface ITabDefinition {
    id?: string;
    className?: string;
    activeClassName?: string;
    title?: string;
    tooltip?: string;
    icon?: IIconProps;
    ignorable?: boolean;
    active?: boolean;
    closeConfirm?: string | boolean | IConfirmation | ConfirmationDialogTitleCallback | null;
    /**
     * The number is displayed in the upper right corner.
     */
    count?: number | (() => number | null);
    /**
     * Custom styles (class name) for the "count" property.
     */
    countClassName?: string;
    onClose?(tab: TabModel): Promise<void>;
    onSelect?(tab: TabModel): Promise<void>;
}

export interface ITab extends IBaseComponent {
    readonly model: TabModel;
    
    readonly isTab: boolean;
    
    initialize(container: TabContainerModel, index: number): void;
}

export interface ITabContainer extends IBaseComponent {
}

export interface ITabHeader extends  IBaseComponent {
    readonly model: TabModel;
}

export class TabContainerModel {
    
    private restoreActiveTabIndex(): number {
        const lastActiveIndex: number = UserInteractionDataStorage.get(this.id, -1, this.dataStorageType);
        if ((lastActiveIndex >= 0) && (lastActiveIndex < this.tabs.length)) {
            const tab: TabModel = this.tabs[lastActiveIndex];
            if ((!tab.closed) && (!tab.ignorable)) {
                return lastActiveIndex;
            }
        }
        return this.tabs.findIndex(tab => !tab.closed && !tab.ignorable);
    }
    
    private saveActiveTabIndex(): void {
        UserInteractionDataStorage.set(this.id, this.activeIndex, this.dataStorageType);
    }
    
    public id: string = "";
    
    public className: string | null = null;

    public scale: boolean = false;

    public dataStorageType: DataStorageType = DataStorageType.Page;
    
    public renderType: TabRenderType = TabRenderType.Always;
    
    public tabs: TabModel[] = [];
    
    public instance: ITabContainer = {} as ITabContainer;
    
    public get activeIndex(): number {
        return this.tabs.findIndex(item => item.active && !item.closed);
    }

    public onSelect?(tab: TabModel): Promise<void>;

    public onClose?(tab: TabModel): Promise<void>;
    
    public getActiveTab(): TabModel | null {
        return this.tabs.find(tab => tab.active) || null;
    }
    
    public getTabIds(): string[] {
        return this.tabs.map(tab => tab.id);
    }
    
    public activateDefault(prevActiveIndex: number | null = null): void {
        if (this.tabs.length > 0) {
            let newActiveIndex = this.tabs.findIndex(tab => !tab.closed && !tab.ignorable && tab.active);
            
            if (newActiveIndex === -1) {
                if ((prevActiveIndex != null) &&
                    (prevActiveIndex >= 0) && (prevActiveIndex < this.tabs.length) &&
                    (!this.tabs[prevActiveIndex].closed) && (!this.tabs[prevActiveIndex].ignorable)) {
                    newActiveIndex = prevActiveIndex;
                } else {
                    newActiveIndex = this.restoreActiveTabIndex();
                }
            }
            
            this.tabs.forEach(tab => tab.active = (tab.index === newActiveIndex));
            
            this.saveActiveTabIndex();
        }
    }
    
    public async activateTabAsync(tabOrIndexOrId: TabModel | number | string): Promise<void> {

        const tab: TabModel | null = (typeof tabOrIndexOrId == "number")
            ? ((tabOrIndexOrId >= 0) && (tabOrIndexOrId < this.tabs.length))
                ? this.tabs[tabOrIndexOrId]
                : null
            : (typeof tabOrIndexOrId == "string")
                ? this.tabs.find(tab => tab.id == tabOrIndexOrId) || null
                : tabOrIndexOrId;
        
        if ((tab) && (!tab.active) && (!tab.closed)) {
            
            if (!tab.ignorable) {
                const activeTab: TabModel | null = this.getActiveTab();
                
                if (activeTab) {
                    activeTab.active = false;
                    await activeTab.reRenderAsync();
                }
                
                tab.active = true;

                this.saveActiveTabIndex();

                await tab.reRenderAsync();
            }

            if (tab.onSelect) {
                await tab.onSelect(tab);
            }
            
            if (this.onSelect) {
                await this.onSelect(tab);
            }
        }
    }
    
    public async closeTabAsync(tab: TabModel, confirmed: boolean, data: string): Promise<void> {
        if (!tab.closed) {

            const confirmNeeded: boolean = (!!tab.closeConfirm) && (!confirmed);

            if ((confirmNeeded) && (tab.closeConfirmDialogRef.current)) {
                await tab.closeConfirmDialogRef.current.openAsync();
                return;
            }
            
            // Close the tab:

            tab.closed = true;
            
            if (tab.active) {
                tab.active = false;

                if (tab.index > 0) {
                    const prevTab: TabModel = this.tabs[tab.index - 1];
                    prevTab.active = true;
                    await prevTab.reRenderAsync();
                }
            }

            this.saveActiveTabIndex();
            
            await tab.reRenderAsync();
            
            if (tab.onClose) {
                await tab.onClose(tab, data);
            }
            
            if (this.onClose) {
                await this.onClose(tab);
            }
        }
    }
}

export class TabModel {
    public id: string = "";

    public title: string = "";
    
    public tooltip: string = "";

    public className: string | null = null;

    public activeClassName: string | null = null;

    public icon: IIconProps | null = null;
    
    public ignorable: boolean = false;

    public active: boolean = false;
    
    public closed: boolean = false;
    
    public index: number = 0;

    public container: TabContainerModel = new TabContainerModel();

    public instance: ITab = {} as ITab;
    
    public headerInstance: ITabHeader = {} as ITabHeader;

    public closeConfirm: string | boolean | IConfirmation | ConfirmationDialogTitleCallback | null = null;

    public count: number | (() => number | null) | null = null;

    public countClassName: string | null = null;

    public readonly closeConfirmDialogRef: React.RefObject<ConfirmationDialog> = React.createRef();
    
    public onClose?(tab: TabModel, data: string): Promise<void>;

    public onSelect?(tab: TabModel): Promise<void>;

    public getCount(): number | null {
        const count: number | (() => number | null) | null = this.count;
        return (count != null)
            ? (typeof count === "function")
                ? count()
                : count
            : null;
    }
    
    public async reRenderAsync(): Promise<void> {
        if (this.headerInstance.reRenderAsync) {
            await this.headerInstance.reRenderAsync();
        }
        if (this.instance.reRenderAsync) {
            await this.instance.reRenderAsync();
        }
    }
}

export class TabTransformer {

    public static toTab(from: ITabDefinition, id: string): TabModel {
        const to = new TabModel();
        to.id = id;
        to.active = from.active ?? false;
        to.className = from.className ?? null;
        to.activeClassName = from.activeClassName ?? null;
        to.icon = from.icon ?? null;
        to.ignorable = from.ignorable ?? false;
        to.title = from.title || "";
        to.tooltip = from.tooltip || "";
        to.closeConfirm = from.closeConfirm ?? null;
        to.count = from.count ?? null;
        to.countClassName = from.countClassName ?? null;
        to.onSelect = from.onSelect;
        to.onClose = from.onClose;
        return to;
    }

    public static toTabContainer(from: ITabContainerDefinition, id: string): TabContainerModel {
        const to = new TabContainerModel();
        to.id = id;
        to.className = from.className || null;
        to.scale = from.scale || false;
        to.dataStorageType = from.dataStorageType || DataStorageType.Page;
        to.renderType = from.renderType || TabRenderType.Always;
        to.tabs = [];
        to.onSelect = from.onSelect;
        to.onClose = from.onClose;
        return to;
    }
}