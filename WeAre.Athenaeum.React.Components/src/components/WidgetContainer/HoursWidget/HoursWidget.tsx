import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {IBaseWidgetProps} from "@/components/WidgetContainer/BaseWidget";
import BaseExpandableWidget from "@/components/WidgetContainer/BaseExpandableWidget";
import NumberWidget from "@/components/WidgetContainer/NumberWidget/NumberWidget";

import styles from "./HoursWidget.module.scss";
import WidgetContainerLocalizer from "@/components/WidgetContainer/WidgetContainerLocalizer";
import GeneralLocalizer from "@/components/General/GeneralLocalizer";

interface IHoursWidgetProps extends IBaseWidgetProps {
    normalHours: number;
    overtime50Hours: number;
    overtime100Hours: number;
    readonly?: boolean;
    onChange?(sender: HoursWidget, normalHours: number, overtime50Hours: number, overtime100Hours: number): Promise<void>;
}

export default class HoursWidget extends BaseExpandableWidget<IHoursWidgetProps> {

    private async invokeOnChange(normal: number, overtime50: number, overtime100: number): Promise<void> {
        if (this.props.onChange) {
            await this.props.onChange(this, normal, overtime50, overtime100);
        }
        await this.reRenderAsync();
    }

    protected async onClickAsync(e: React.MouseEvent): Promise<void> {
        const target = e.target as Node;
        const outsideContent: boolean = Utility.clickedOutside(target, `${this.id}_content`);
        if (outsideContent) {
            await super.onClickAsync(e);
        }
    }

    public get normalHours(): number {
        return this.props.normalHours;
    }

    public get overtime50Hours(): number {
        return this.props.overtime50Hours;
    }

    public get overtime100Hours(): number {
        return this.props.overtime100Hours;
    }

    public get totalHours(): number {
        return this.props.overtime100Hours;
    }

    public get readonly(): boolean {
        return (this.props.readonly === true);
    }

    public formatWorkingHours(normalHours: number): string {
        const totalHours: number = normalHours + this.overtime50Hours + this.overtime100Hours;

        return (!this.contentVisible) && (this.overtime50Hours > 0 || this.overtime100Hours > 0)
            ? "{0:0.0}<small>/{1:0.0}</small>".format(normalHours, totalHours)
            : "{0:0.0}".format(normalHours);
    }

    protected getInnerClassName(): string {
        return styles.hours;
    }

    protected renderLabel(): React.ReactElement {
        const total: number = this.normalHours + this.overtime50Hours + this.overtime100Hours;
        return (
            <div className={styles.header}>
                <span>{this.label}</span>
                <br/>
                {
                    (this.contentVisible) &&
                    (
                        <span className={styles.total}>{total.format("0.0")}</span>
                    )
                }
            </div>
        )
    }

    protected renderExpanded(): React.ReactNode {
        return (<React.Fragment/>);
    }

    protected renderContent(): React.ReactNode {
        const totalWidgetStyle = (this.contentVisible) && [styles.total, styles.inner];

        return (
            <div id={`${this.id}_content`}>

                {
                    (this.minimized)
                        ?
                        (
                            <span className={styles.compact}>{this.normalHours.format("0.0")}</span>
                        )
                        :
                        (
                            <React.Fragment>
                                <NumberWidget className={this.css(styles.embeddedWidget, totalWidgetStyle, (this.desktop) && styles.alignNumbers)}
                                              label={(this.contentVisible) ? GeneralLocalizer.get("componentHoursWidgetNormalHours") : ""}
                                              reverse={true}
                                              wide
                                              min={0}
                                              max={8}
                                              step={0.5}
                                              readonly={this.readonly}
                                              value={this.normalHours}
                                              format={value => this.formatWorkingHours(value)}
                                              onChange={async (sender, value) => await this.invokeOnChange(value, this.overtime50Hours, this.overtime100Hours)}
                                />

                                {
                                    (this.contentVisible) &&
                                    (
                                        <React.Fragment>

                                            <NumberWidget className={this.css(styles.embeddedWidget, styles.inner)}
                                                          label={"50%"}
                                                          reverse={true}
                                                          wide
                                                          min={0}
                                                          max={24}
                                                          step={0.5}
                                                          readonly={this.readonly}
                                                          value={this.overtime50Hours}
                                                          onChange={async (sender, value) => await this.invokeOnChange(this.normalHours, value, this.overtime100Hours)}
                                            />

                                            <NumberWidget className={this.css(styles.embeddedWidget, styles.inner)}
                                                          label={"100%"}
                                                          reverse={true}
                                                          wide
                                                          min={0}
                                                          max={24}
                                                          step={0.5}
                                                          readonly={this.readonly}
                                                          value={this.overtime100Hours}
                                                          onChange={async (sender, value) => await this.invokeOnChange(this.normalHours, this.overtime50Hours, value)}
                                            />

                                        </React.Fragment>
                                    )
                                }

                            </React.Fragment>
                        )
                }

            </div>
        )
    }
}