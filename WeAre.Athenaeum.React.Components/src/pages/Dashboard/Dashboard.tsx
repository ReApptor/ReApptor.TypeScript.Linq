import React from "react";
import AuthorizedPage from "../../models/base/AuthorizedPage";
import PageContainer from "../../components/PageContainer/PageContainer";
import WidgetContainer from "../../components/WidgetContainer/WidgetContainer";
import { IconStyle } from "@/components/Icon/Icon";
import RouteWidget from "../../components/WidgetContainer/Link/RouteWidget/RouteWidget";
import PageDefinitions from "../../providers/PageDefinitions";
import MySitesOrWarehousesWidget from "@/pages/Dashboard/MySitesOrWarehousesWidget/MySitesOrWarehousesWidget";
import Localizer from "../../localization/Localizer";

import rentaTaskStyles from "../RentaTask.module.scss";

interface IDashboardProps {
    name: string | null;
}

interface IDashboardState {
}

export default class Dashboard extends AuthorizedPage<IDashboardProps, IDashboardState> {
    
    public getManual(): string {
        return Localizer.dashboardGetManual;
    }

    public getTitle(): string {
        return Localizer.topNavFrontpage;
    }
    
    public render(): React.ReactNode {
        
        return (
            <PageContainer transparent className={rentaTaskStyles.pageContainer} alertClassName={rentaTaskStyles.alert}>

                <WidgetContainer controller="Dashboard" async>

                    <RouteWidget id="Employees" async icon={{ name: "users" }} route={PageDefinitions.employeesRoute} label={Localizer.topNavEmployees} description={Localizer.widgetEmployeesDescription} />
                    
                    <RouteWidget id="ConstructionSites" async icon={{ name: "list", style: IconStyle.Solid }} route={PageDefinitions.constructionSitesRoute} label={Localizer.widgetConstructionSitesLabel} description={Localizer.widgetConstructionSitesDescription} />
                    
                    <RouteWidget id="MyWorkReports" wide icon={{name: "fas tools" }} route={PageDefinitions.myWorkReportsRoute} label={Localizer.widgetMyWorkReportsLabel} description={Localizer.widgetMyWorkReportsDescription} />
                    
                    <MySitesOrWarehousesWidget />

                </WidgetContainer>

            </PageContainer>
        );
    }
}