import React from "react";
import NavigationWidget from "../NavigationWidget/NavigationWidget";
import { IIconProps } from "../Icon/Icon";
import BaseWidgetContainer, { IBaseWidgetContainerProps } from "../WidgetContainer/BaseWidgetContainer";
import StepsWidget, { IWizardSteps } from "../StepsWidget/StepsWidget";
import { IWizardPage } from "@/helpers/WizardPage";

export interface IWizardContainerProps extends IBaseWidgetContainerProps {
    id?: string;
    canPrev?: boolean;
    prevIcon?: IIconProps;
    prevLabel?: string;
    prevDescription?: string;
    canNext?: boolean;
    nextIcon?: IIconProps;
    nextLabel?: string;
    nextDescription?: string;
    responsive?: boolean;
    steps?: IWizardSteps;
    navigationClassName?: string;
}

export default class WizardContainer extends BaseWidgetContainer<IWizardContainerProps> {

    private async prevAsync(): Promise<void> {
        const page: IWizardPage = this.getPage();
        await page.prevAsync();
    }

    private async nextAsync(): Promise<void> {
        const page: IWizardPage = this.getPage();
        await page.nextAsync();
    }

    public get responsive(): boolean {
        return (this.props.responsive == true);
    }

    public getPage(): IWizardPage {
        return super.getPage() as IWizardPage;
    }

    protected renderContent(): React.ReactNode {
        return (
            <React.Fragment>

                { (this.props.steps && this.props.steps.steps.length > 1) && <StepsWidget steps={this.props.steps.steps} /> }

                { this.widgets }

                {
                    (this.responsive || this.desktop) &&
                    (
                        <NavigationWidget responsive={this.responsive}
                                          className={this.props.navigationClassName}
                                          canPrev={this.props.canPrev}
                                          prevIcon={this.props.prevIcon}
                                          prevLabel={this.props.prevLabel}
                                          prevDescription={this.props.prevDescription}
                                          can={this.props.canNext}
                                          icon={this.props.nextIcon}
                                          label={this.props.nextLabel}
                                          description={this.props.nextDescription}
                                          onPrevClick={async () => await this.prevAsync()} onClick={async () => await this.nextAsync()}
                        />
                    )
                }
                
            </React.Fragment>
        );
    }
};
