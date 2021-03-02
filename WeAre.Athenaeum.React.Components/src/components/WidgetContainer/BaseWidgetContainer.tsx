import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseAsyncComponent, ch, IBaseAsyncComponentState, IBaseComponent} from "@weare/athenaeum-react-common";
import {Dictionary} from "typescript-collections";
import IBaseWidget from "./BaseWidget";

import styles from "./WidgetContainer.module.scss";
import DropdownWidget from "@/components/DropdownWidget/DropdownWidget";

export interface IWidgetContainer extends IBaseComponent {
    readonly controller: string | null;
}

export interface IBaseWidgetContainerProps {
    className?: string;
    controller?: string;
    async?: boolean;
    noToggle?: boolean;
}

export interface IBaseWidgetContainerState extends IBaseAsyncComponentState<string[]> {
}

export default abstract class BaseWidgetContainer<TProps extends IBaseWidgetContainerProps = {}> extends BaseAsyncComponent<TProps, IBaseWidgetContainerState, string[]> implements IWidgetContainer {

    state: IBaseWidgetContainerState = {
        data: null,
        isLoading: false
    };

    private readonly _widgetToggleStates: Dictionary<string, boolean> = new Dictionary<string, boolean>();
    private _pageId: string | null = null;

    private async onDropdownWidgetToggleHandlerAsync(sender: DropdownWidget<any>, expanded: boolean): Promise<void> {
        const toggle: boolean = (expanded);
        const restore: boolean = (!toggle);
        if (toggle) {
            this._widgetToggleStates.clear();
        }
        
        if (this.mobile) {
            const widgets: IBaseWidget[] = this
                .childComponents
                .filter(component => (component !== sender) && ((component as any).isWidget))
                .map(component => (component as IBaseWidget));

            await Utility.forEachAsync(widgets, async (widget: IBaseWidget) => {
                const widgetId: string = widget.id;
                if (toggle) {
                    const maximized: boolean = (!widget.minimized);
                    this._widgetToggleStates.setValue(widgetId, maximized);
                    await widget.minimizeAsync();
                } else {
                    const maximized: boolean | null = this._widgetToggleStates.getValue(widgetId) || null;
                    if (maximized) {
                        await widget.maximizeAsync();
                    }
                }
            });
        }
    }

    protected extendChildProps(element: React.ReactElement): any | null {
        if ((!this.noToggle) && (element.props.onToggle == null)) {
            return {
                onToggle: async (sender: DropdownWidget<any>, expanded: boolean) => (sender.siblingsAutoToggle) && (await this.onDropdownWidgetToggleHandlerAsync(sender, expanded))
            }
        }
        return null;
    }

    private get widgetIds(): string[] | null {
        return this.state.data;
    }

    protected get widgets(): React.ReactElement[] {

        let widgets: React.ReactElement[] = this.children;

        if (this.isAsync()) {
            widgets = widgets.filter(item => 
                (!item.props.id) ||
                (item.props.id.startsWith("_")) ||
                ((this.widgetIds != null) && (this.widgetIds!.includes(item.props.id))));
        }

        return widgets;
    }
    
    public get noToggle(): boolean {
        return this.props.noToggle === true;
    }
    
    public get controller(): string | null {
        return this.props.controller as string | null;
    }

    public async initializeAsync(): Promise<void> {
        BaseWidgetContainer.mountedInstance = this;
        await super.initializeAsync();
    }

    public async componentWillUnmount(): Promise<void> {
        await super.componentWillUnmount();
        if (BaseWidgetContainer.mountedInstance === this) {
            BaseWidgetContainer.mountedInstance = null;
        }
    }

    public async componentWillReceiveProps(nextProps: TProps): Promise<void> {
        //update props
        (this as any).props = nextProps;
        //check page state
        let pageId: string | null = ch.findPageId();
        let reload: boolean = (this._pageId !== pageId);
        this._pageId = pageId;
        //reload data async if needed
        await this.invokeReloadDataAsync(reload);
        //call base class
        await super.componentWillReceiveProps(nextProps);
    }

    protected getEndpoint(): string {
        return `api/${this.props.controller}/getWidgets`;
    }
    
    public isAsync(): boolean {
        return (!!this.props.controller) && (this.props.async === true);
    }

    protected renderContent(): React.ReactNode {
        return (
            <React.Fragment>
                {this.widgets}
            </React.Fragment>
        );
    }

    render(): React.ReactNode {

        return (
            <div id={this.id} className={this.css(this.props.className, styles.widgetContainer)}>
                { this.renderContent() }
            </div>
        );
    }

    public static mountedInstance: IWidgetContainer | null = null;
};
