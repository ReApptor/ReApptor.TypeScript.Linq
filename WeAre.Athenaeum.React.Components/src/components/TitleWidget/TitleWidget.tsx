import React from "react";
import {TypeConverter} from "@weare/athenaeum-toolkit";
import BaseWidget, { IBaseWidgetProps, IBaseWidgetState } from "../WidgetContainer/BaseWidget";
import { IconSize, IIconProps } from "../Icon/Icon";
import TitleWidgetLocalizer from "./TitleWidgetLocalizer";

import widgetStyles from "../WidgetContainer/WidgetContainer.module.scss";
import styles from "./TitleWidget.module.scss";

export interface ITitleModel {
    label: string;
    description: string;
    icon: IIconProps | null;
}

export interface ITitleWidgetProps extends IBaseWidgetProps {
    model?: ITitleModel;
}

export default class TitleWidget extends BaseWidget<ITitleWidgetProps> {
    private _containerRef: React.RefObject<HTMLDivElement> = React.createRef();

    protected get icon(): IIconProps | null {
        const icon: IIconProps | null = this.state.icon as IIconProps | null;
        if (icon != null) {
            icon.size = (this.expanded) ? IconSize.X3 : IconSize.X2;
        }
        return icon;
    }
    
    private getLabelWidthStyle(): React.CSSProperties {
        const container: HTMLDivElement | null = this._containerRef.current;
        if (container && !this.expanded) {
            return {
                maxWidth: container.offsetWidth - 80
            };
        }
        
        return {};
    }
    
    protected async windowResizeHandlerAsync(): Promise<void> {
        if (this.mobile) {
            await this.reRenderAsync();
        }
    }

    protected async onClickAsync(e: React.MouseEvent): Promise<void> {
        if (this.minimized) {
            await this.maximizeAsync();
        } else {
            await this.minimizeAsync();
        }
    }

    protected async processDataAsync(state: IBaseWidgetState<any>, data: any | null): Promise<void> {
        if (data != null) {
            const title: ITitleModel | null = TypeConverter.convert(data, nameof<ITitleModel>());
            if (title != null) {
                state.description = title.description;
                state.label = title.label;
                state.icon = title.icon || state.icon;
            }
        }
    }

    public async initializeAsync(): Promise<void> {
        this.state.minimized = true;
        if (this.props.model != null) {
            this.state.label = this.props.model.label;
            this.state.description = this.props.model.description;
            this.state.icon = this.props.model.icon || this.props.icon as IIconProps | null;
        }
    }

    public get expanded(): boolean {
        return (!!this.description) && (this.desktop || !this.minimized);
    }

    render(): React.ReactNode {
        return (
            <div id={this.id} 
                 ref={this._containerRef}
                 className={this.css(styles.title, widgetStyles.widget, this.props.className, this.getInnerClassName(), (this.props.wide ? "col-md-12" : "col-md-6"))}
            >
                
                <div className={this.css(widgetStyles.compact, this.transparent && widgetStyles.transparent, widgetStyles.content)}
                     title={this.toSingleLine(TitleWidgetLocalizer.get(this.description || this.label))}
                     onClick={async (e: React.MouseEvent) => await this.onClickAsync(e)}
                >

                    <div className={widgetStyles.compactContainer}>
                        {
                            this.renderContent()
                        }
                        <div className={widgetStyles.labelAndDescription}>
                            {this.label && <div><span className={this.css(!this.expanded && styles.shrink)} style={this.getLabelWidthStyle()}>{this.label}</span></div>}
                            {this.expanded && <div className={widgetStyles.description}><span>{this.toMultiLines(this.description)}</span></div>}
                        </div>
                    </div>
                    
                </div>     
                
            </div>
        );
    }
}
