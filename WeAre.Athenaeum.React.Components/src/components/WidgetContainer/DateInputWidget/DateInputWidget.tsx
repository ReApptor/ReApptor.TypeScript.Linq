import React from "react";
import DatePicker from "react-datepicker";
import {Utility} from "@weare/athenaeum-toolkit";
import BaseExpandableWidget, { IBaseExpandableWidgetProps } from "../BaseExpandableWidget";

import "react-datepicker/dist/react-datepicker.css";
import "./DateInputWidget.scss";
import styles from "../WidgetContainer.module.scss";

interface IDatepickerWidgetProps extends IBaseExpandableWidgetProps {
    value?: Date;
    minDate?: Date;
    todayButton?: string;
    onChange?(date: Date): Promise<void>;
}

export default class DateInputWidget extends BaseExpandableWidget<IDatepickerWidgetProps> {
    private async handleChange(date: Date): Promise<void> {
        if(this.props.onChange) {
            await this.props.onChange(date);
        }
        
        await this.hideContentAsync();
    }
    
    protected async onClickAsync(e: React.MouseEvent): Promise<void> {
        const target: Element = e.target as Element;

        if(target.parentElement) {
            if(target.parentElement.className.startsWith("react-datepicker") ) {
                return;
            }
        }
        
        await super.toggleContentAsync();
    }

    public async initializeAsync(): Promise<void> {
        this.state.icon = { name: "far calendar-day" };
        await super.initializeAsync();
    }

    public async componentWillReceiveProps(nextProps: Readonly<IDatepickerWidgetProps>): Promise<void> {
        this.state.icon = { name: "far calendar-day" };
        await super.componentWillReceiveProps(nextProps);
    }

    protected renderExpanded(): React.ReactNode {
        return (
            <div className="dateInputContainer">
                <DatePicker
                        selected={this.props.value || new Date()}
                        minDate={this.props.minDate}
                        onChange={(date: Date) => this.handleChange(date)}
                        className="form-control"
                        calendarClassName="datepicker dateInputWidget"
                        inline
                        todayButton={this.props.todayButton}
                    />
            </div>
        )
    }

    protected renderContent(): React.ReactNode {
        return (
            <React.Fragment>
                {
                    (this.contentVisible)
                        ?
                        <div className={styles.expandableContent}>
                            {this.renderExpanded()}
                        </div>
                        : (this.props.value ? this.renderDate(this.props.value) : this.renderContent())
                }
            </React.Fragment>
        );
    }
    
    private renderDate(date: Date): React.ReactNode {
        return <span className={styles.date}>{Utility.toDateString(date)}</span>
    }
}