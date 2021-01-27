import React from "react";
import PageRow from "../../components/PageContainer/PageRow/PageRow";
import AuthorizedPage from "../../models/base/AuthorizedPage";
import PageContainer from "../../components/PageContainer/PageContainer";
import TabContainer from "../../components/TabContainer/TabContainer";
import Tab from "../../components/TabContainer/Tab/Tab";
import PageHeader from "../../components/PageContainer/PageHeader/PageHeader";
import Warehouse from "../../models/server/Warehouse";
import WarehouseTasksPanel from "./WarehouseTaskPanel/WarehouseTaskPanel";
import WarehousePanel from "./WarehousePanel/WarehousePanel";
import Localizer from "../../localization/Localizer";

import styles from "./WarehouseManagement.module.scss";

interface IWarehouseManagementProps {
    wareHouse: Warehouse;
}

interface IWarehouseManagementState {
    warehouse: Warehouse | null;
}

export default class ConstructionSiteManagement extends AuthorizedPage<IWarehouseManagementProps, IWarehouseManagementState> {

    state: IWarehouseManagementState = {
        warehouse: null
    };

    public getTitle(): string {
        return Localizer.topNavWarehouse;
    }

    private readonly _tasksPanelRef: React.RefObject<WarehouseTasksPanel> = React.createRef();

    private get warehouse(): Warehouse | null {
        return this.state.warehouse;
    }

    private get warehouseId(): string {
        return this.routeId!;
    }

    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();

        if (this.warehouse == null) {
            const warehouse: Warehouse = await this.postAsync("api/warehouse/getWarehouse", this.warehouseId);

            await this.setState({warehouse});
        }
    }

    public render(): React.ReactNode {
        return (

            (this.warehouse) &&
            (
                <PageContainer scale className="">

                    <PageHeader title={this.warehouse!.name} subtitle="" withTabs className={styles.pageHeader}>

                    </PageHeader>

                    <PageRow>
                        <div className="col">

                            <TabContainer id="warehouseManagementTabs">
                                
                                <Tab id="tasks" title={Localizer.genericTasksLanguageItemName}>
                                    <div className="row">
                                        <WarehouseTasksPanel ref={this._tasksPanelRef}
                                                             readonly={false}
                                                             warehouse={this.warehouse}
                                        />
                                    </div>
                                </Tab>

                                <Tab id="details" title={Localizer.genericDetailsLanguageItemName}>
                                    <div className="row">
                                        <WarehousePanel warehouse={this.warehouse} />
                                    </div>
                                </Tab>

                            </TabContainer>
                            
                        </div>
                    </PageRow>

                </PageContainer>
            )
        );
    }
}