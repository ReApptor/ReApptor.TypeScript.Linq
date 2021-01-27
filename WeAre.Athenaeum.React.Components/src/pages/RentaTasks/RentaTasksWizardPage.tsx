import React from "react";
import {AlertModel, ApiProvider, PageRoute, PageRouteProvider} from "@weare/athenaeum-react-common";
import WizardPage from "../../models/base/WizardPage";
import PageContainer from "../../components/PageContainer/PageContainer";
import WizardContainer from "../../components/WizardContainer/WizardContainer";
import {IIconProps} from "@/components/Icon/Icon";
import WizardContext from "@/pages/RentaTasks/Models/WizardContext";
import {ITitleModel} from "@/components/WizardContainer/TitleWidget/TitleWidget";
import PageDefinitions from "@/providers/PageDefinitions";
import RentaTasksController, {IWizardNextStep, RentaTasksAction} from "./RentaTasksController";

import rentaTaskStyles from "../RentaTask.module.scss";

export default abstract class RentaTasksWizardPage<TProps = {}, TState = {}> extends WizardPage<TProps, TState> {
    
    private readonly WizardContainerRef: React.RefObject<WizardContainer> = React.createRef();
    private _canNext: boolean | null = null;

    protected findWidget<TWidget>(id: string): TWidget | null {
        return (this.wizardContainer != null)
            ? this.wizardContainer!.findComponent(id) as TWidget | null
            : null;
    }

    protected getNoToggle(): boolean {
        return false;
    }

    protected get workOrderRequired(): boolean {
        return true;
    }
    
    protected saveContext(): void {
        RentaTasksController.saveContext();
    }

    protected async validateAsync(): Promise<boolean> {
        const canNext: boolean = this.canNext;
        if (canNext !== this._canNext) {
            this._canNext = canNext;
            await this.reRenderAsync();
        }
        return canNext;
    }
    
    private get wizardContainer(): WizardContainer | null {
        return this.WizardContainerRef.current;
    }

    protected get controller(): string | null {
        return ((this.wizardContainer != null) != null) ? this.wizardContainer!.controller : null;
    }
    
    protected get wizard(): WizardContext {
        return RentaTasksController.wizard;
    }
    
    protected get action(): RentaTasksAction {
        return this.wizard.action;
    }

    protected get title(): ITitleModel | undefined {
        return RentaTasksController.wizardTitle;
    }

    protected get canPrev(): boolean {
        return true;
    }
    
    protected get canNext(): boolean {
        return true;
    }
    
    public async prevAsync(): Promise<void> {
        if (this.canPrev) {
            const expired: boolean = await RentaTasksController.checkExpirationAsync();

            if (!expired) {

                const prevRoute: PageRoute = await RentaTasksController.getPrevStepAsync(this.route);

                await this.redirectPrevAsync(prevRoute);
            }
        }
    }
    
    private async invokeRedirectAsync(nextRoute: PageRoute): Promise<void> {
        const alert: AlertModel | null = this.alert;

        await this.redirectNextAsync(nextRoute);

        if (alert != null) {
            await this.alertAsync(alert);
        }
    }
    
    private async completeAsync(nextRoute: PageRoute): Promise<void> {
        await RentaTasksController.completeActionAsync();

        await this.invokeRedirectAsync(nextRoute);
    }

    public async nextAsync(): Promise<void> {

        const canNext: boolean = await this.validateAsync();

        if (canNext) {
            const expired: boolean = await RentaTasksController.checkExpirationAsync();

            if (!expired) {

                const nextStep: IWizardNextStep = await RentaTasksController.getNextStepAsync(this.route);

                const nextRoute: PageRoute = nextStep.nextRoute;

                if (nextStep.lastStep) {
                    await ApiProvider.invokeWithForcedSpinnerAsync(() => this.completeAsync(nextRoute));
                } else {
                    await this.invokeRedirectAsync(nextRoute);
                }
            }
        }
    }
    
    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();

        const expired: boolean = await RentaTasksController.checkExpirationAsync();

        const redirect: boolean = (expired) || ((this.workOrderRequired) && (this.wizard.workOrder == null));

        if (redirect) {
            const route: PageRoute = this.wizard.actionInitialPageRoute || PageDefinitions.rentaTasksRoute;

            await PageRouteProvider.redirectAsync(route, true, true);
        }
    }

    public abstract getManual(): string;

    public nextIcon(): IIconProps | null {
        return null;
    }

    public nextDescription(): string | null{
        return null;
    }
    
    public get noToggle(): boolean {
        return this.getNoToggle();
    }

    public abstract renderContent(): React.ReactNode;

    public render(): React.ReactNode {
        return (
            <PageContainer fullHeight className={rentaTaskStyles.pageContainer} alertClassName={rentaTaskStyles.alert}>
                
                <WizardContainer responsive
                                 ref={this.WizardContainerRef}
                                 navigationClassName={rentaTaskStyles.navigation}
                                 controller="RentaTasks"
                                 canNext={this.canNext}
                                 nextIcon={this.nextIcon() || undefined}
                                 nextDescription={this.nextDescription() || undefined}
                                 canPrev={this.canPrev}
                                 steps={RentaTasksController.getSteps() || undefined}
                                 noToggle={this.noToggle}>
                    
                    { this.renderContent() }
                    
                </WizardContainer>
                
            </PageContainer>
        );
    }
}