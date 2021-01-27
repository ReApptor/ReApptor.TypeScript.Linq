import React from "react";
import BaseWidget, {IBaseWidgetProps} from "@/components/WidgetContainer/BaseWidget";
import RouteWidget from "@/components/WidgetContainer/Link/RouteWidget/RouteWidget";
import PageDefinitions from "@/providers/PageDefinitions";
import ConstructionSiteOrWarehouse from "@/models/server/ConstructionSiteOrWarehouse";
import {ConstructionSiteOrWarehouseType} from "@/models/Enums";
import {ITitleModel} from "@/components/WizardContainer/TitleWidget/TitleWidget";
import TransformProvider from "@/providers/TransformProvider";

export interface IMySitesOrWarehousesWidgetProps extends IBaseWidgetProps {
}

export default class MySitesOrWarehousesWidget extends BaseWidget<IMySitesOrWarehousesWidgetProps, ConstructionSiteOrWarehouse[]> {

    static defaultProps: IMySitesOrWarehousesWidgetProps = {
        id: "MySitesOrWarehouses",
        async: true
    };
    
    private renderRouteWidget(siteOrWarehouse: ConstructionSiteOrWarehouse, index: number): React.ReactNode {
        const route = (siteOrWarehouse.type == ConstructionSiteOrWarehouseType.ConstructionSite)
            ? PageDefinitions.constructionSiteManagement(siteOrWarehouse.id)
            : PageDefinitions.warehouseManagement(siteOrWarehouse.id);
        const title: ITitleModel = TransformProvider.toConstructionSiteOrWarehouseTitle(siteOrWarehouse);
        
        return (
            <RouteWidget key={index}
                         route={route}
                         label={title.label}
                         description={title.description}
                         icon={title.icon || undefined}
            />
        );
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                {
                    (this.state.data) &&
                    (
                        this.state.data.map((siteOrWarehouse, index) => this.renderRouteWidget(siteOrWarehouse, index))
                    )
                }
            </React.Fragment>
        )
    }
}