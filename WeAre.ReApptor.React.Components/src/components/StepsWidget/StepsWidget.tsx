import React from "react";
import {ch, IBasePage, PageRoute} from "@weare/athenaeum-react-common";
import BaseWidget, { IBaseWidgetProps } from "../WidgetContainer/BaseWidget";
import Comparator from "../../helpers/Comparator";
import {IIconProps} from "../Icon/Icon";
import Step from "./Step/Step";

import widgetStyles from "../WidgetContainer/WidgetContainer.module.scss";
import styles from "./StepsWidget.module.scss";

export interface IWizardStep {
    route: PageRoute;
    title: string | null;
    icon?: IIconProps;
    hidden?: boolean;
}

export interface IWizardSteps {
    steps: IWizardStep[];
}

export interface IStepsWidgetProps extends IBaseWidgetProps, IWizardSteps {
}

export default class StepsWidget extends BaseWidget<IStepsWidgetProps> {
    
    private getCurrentIndex(): number {
        const page: IBasePage = this.getPage();
        const route: PageRoute = page.route;
        return this.props.steps.findIndex(step => Comparator.isEqual(step.route, route));
    }
    
    private get steps(): IWizardStep[] {
        return this.props.steps.filter(step => !step.hidden);
    }

    public componentDidUpdate(): void {
        ch.getLayout().reinitializeTooltips();
    }

    render(): React.ReactNode {
        const currentIndex: number = this.getCurrentIndex();
        
        return (
            <div id={this.id} className={this.css(widgetStyles.widget, this.props.className, "col-md-12", styles.steps)}>
                <div
                    title={this.toSingleLine(this.description || this.props.label)}
                    className={this.css(widgetStyles.compact, this.transparent && widgetStyles.transparent, widgetStyles.content, styles.content)}>

                    <div className={this.css(widgetStyles.compactContainer, styles.container)}>
                        {
                            this.steps.map((step, stepIndex) => (
                                <React.Fragment key={stepIndex}>
                                    
                                    {stepIndex > 0 && <div className={this.css(styles.separator, ((stepIndex <= currentIndex) && (styles.completed)))} />}
                                    
                                    <Step index={stepIndex + 1}
                                          title={step.title} completed={(stepIndex <= currentIndex)}
                                          first={stepIndex === 0}
                                          last={stepIndex === this.steps.length - 1}
                                    />
                                    
                                </React.Fragment>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}
