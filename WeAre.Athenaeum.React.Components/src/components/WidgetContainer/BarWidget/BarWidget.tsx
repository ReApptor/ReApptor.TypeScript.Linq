import React from "react";
import BaseWidget, { IBaseWidgetProps, IBaseWidgetState } from "../BaseWidget";
import Spinner from "../../Spinner/Spinner";
import AverageModuleRentCostPerSquare from "@/models/server/AverageModuleRentCostPerSquare";
import {Utility} from "@weare/athenaeum-toolkit";
import Localizer from "../../../localization/Localizer";

import styles from "../WidgetContainer.module.scss";

export interface IBarWidgetData {
    sets: number[][] | number[];
    labels: string[];
    averageRentCost: AverageModuleRentCostPerSquare;
}

export default class BarWidget extends BaseWidget<IBaseWidgetProps, IBarWidgetData> {
    
    private renderBars(data: IBarWidgetData): React.ReactNode {
        const set = data.sets as number[];
        
        const currentMonth: number = Utility.today().getMonth();
        let monthIndex: number = currentMonth + 1;

        return set.map((point: number, i: number) => {
            monthIndex = monthIndex > 11 ? 0 : monthIndex;

            const max: number = Utility.max(set);
            const k: number = (max > 0) ? 100.0/max : 1.0;

            const value: number = Math.trunc(k * point);
            const title: string = "{0:C}€".format(point);

            const element: React.ReactNode =
                (
                    <div key={i} className={styles.sets}>
                        <div className={this.css(styles.setsContainer, (i == 0) && styles.borderLeft)}>
                            <span key={i} style={{height: `${value}%`}} title={title} className={styles[`color${1}`]} />
                        </div>

                        <span key={i} title={Utility.getMonth(monthIndex)}>{Utility.getShortMonth(monthIndex)}</span>
                    </div>
                );

            monthIndex++;

            return element;
        });
    }

    private renderLabels(data: IBarWidgetData): React.ReactNode {
        return data.labels.map((label: string, index: number) => (
            <span key={index}>{Localizer.get(label)}</span>
        ));
    }
    
    private renderAverageRentCost(averageRentCost: AverageModuleRentCostPerSquare): React.ReactNode {
        const { perimeterFrameCost, moduleCost, weatherShelterCost } = averageRentCost;
        
        return (
            <React.Fragment>

                <div className="d-flex justify-content-between">
                    <span>{Localizer.widgetBudgetDataPerimeterFrameLabel}</span>
                    <span>{"{0:C} €/m²".format(perimeterFrameCost)}</span>
                </div>

                <div className="d-flex justify-content-between">
                    <span>{Localizer.widgetBudgetDataModuleLabel}</span>
                    <span>{"{0:C} €/m²".format(moduleCost)}</span>
                </div>

                <div className="d-flex justify-content-between">
                    <span>{Localizer.widgetBudgetDataWeatherShelterLabel}</span>
                    <span>{"{0:C} €/m²".format(weatherShelterCost)}</span>
                </div>

            </React.Fragment>
        )
    }

    protected async processDataAsync(state: IBaseWidgetState<IBarWidgetData>, data: IBarWidgetData | null): Promise<void> {
    }

    render(): React.ReactNode {
        return (
            <div className={this.css(styles.widget, styles.bar, this.props.className, (this.props.wide ? "col-md-12" : "col-md-6"))} onClick={async () => super.toggleMinimized()}>
                <a href="javascript:void(0)" title={this.toSingleLine(this.props.description || this.props.label)}>
                    <div className={this.css(styles.barContainer, this.minimized && styles.hideLabels)}>
                        {
                            (!this.isSpinning()) &&
                            (
                                <React.Fragment>
                                    {this.renderBars(this.state.data as IBarWidgetData)}
                                    <div className={styles.labels}>
                                        <div className={styles.averageRent}>
                                            {this.renderAverageRentCost((this.state.data as IBarWidgetData).averageRentCost)}
                                        </div>
                                        
                                        <div className={styles.labelsContainer}>
                                            {this.renderLabels(this.state.data as IBarWidgetData)}
                                        </div>
                                    </div>
                                </React.Fragment>
                            )
                        }
                    </div>
                </a>
                {
                    (this.isSpinning()) && <Spinner noShading />
                }
            </div>
        );
    }
};