import React from "react";
import AuthorizedPage from "../../../models/base/AuthorizedPage";
import PageContainer from "../../../components/PageContainer/PageContainer";
import RouteWidget from "../../../components/WidgetContainer/Link/RouteWidget/RouteWidget";
import {ITitleModel} from "@/components/WizardContainer/TitleWidget/TitleWidget";
import MounterContext from "../Models/MounterContext";
import WidgetContainer from "../../../components/WidgetContainer/WidgetContainer";
import PageDefinitions from "../../../providers/PageDefinitions";
import WorkOrderModel from "@/models/server/WorkOrderModel";
import RentaTasksController, {RentaTasksAction} from "../RentaTasksController";
import Localizer from "../../../localization/Localizer";

import rentaTaskStyles from "../../RentaTask.module.scss";

interface IDashboardProps  {
}

interface IDashboardState {
}

export default class Dashboard extends AuthorizedPage<IDashboardProps, IDashboardState> {

    private async newWorkOrderAsync(): Promise<void> {
        await RentaTasksController.actionAsync(RentaTasksAction.NewWorkOrder);
    }
    
    private get mounterContext(): MounterContext {
        return RentaTasksController.context;
    }
    
    private get myWorkOrder(): WorkOrderModel | null {
        return ((this.mounterContext.isSignedIn) && (this.mounterContext.workOrder))
            ? this.mounterContext.workOrder
            : null;
    }

    private get isSignedIn(): boolean {
        return (this.myWorkOrder != null);
    }

    private get addTaskDescription(): string {
        return (this.isSignedIn)
            ? Localizer.dashboardCreateTaskForCurrentSiteDescription
            : Localizer.dashboardCreateTaskDescription;
    }

    public get title(): ITitleModel | undefined {
        return RentaTasksController.signInTitle;
    }

    public async initializeAsync(): Promise<void> {
        await RentaTasksController.checkExpirationAsync();
    }
    
    public getManual(): string {
        return Localizer.rentaTasksDashboardGetManual;
    }

    public render(): React.ReactNode {
        return (
            <PageContainer transparent={this.desktop} className={rentaTaskStyles.pageContainer} alertClassName={rentaTaskStyles.alert}>

                <WidgetContainer>

                    {(this.myWorkOrder) && (<RouteWidget wide icon={{name: "fas tools"}} label={Localizer.rentaTasksDashboardRouteWidgetMyWorkOrder} description={this.myWorkOrder.name} route={() => PageDefinitions.rentaTasksWorkOrder(this.myWorkOrder ? this.myWorkOrder.id : "")} />) }

                    <RouteWidget icon={{ name: "fal list-alt" }} label={Localizer.rentaTasksDashboardRouteWidgetWorkOrders} description={Localizer.rentaTasksDashboardRouteWidgetWorkOrdersDescription} route={PageDefinitions.rentaTasksWorkOrdersRoute} />

                    <RouteWidget icon={{ name: "fal plus-octagon" }} label={Localizer.addTaskModalAddTask} description={this.addTaskDescription} onClick={async () => await this.newWorkOrderAsync()} />

                    <RouteWidget wide icon={{ name: "fas business-time" }} label={Localizer.myWorkHoursLabel} description={Localizer.myWorkHoursDescription} route={PageDefinitions.myWorkHoursRoute} />

                </WidgetContainer>

            </PageContainer>
        );
    }
}