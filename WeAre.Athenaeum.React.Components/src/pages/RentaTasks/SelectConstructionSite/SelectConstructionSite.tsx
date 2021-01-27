import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {ApiProvider, IBaseComponent} from "@weare/athenaeum-react-common";
import ConstructionSitesWidget from "../Dashboard/Widgets/ConstructionSitesWidget";
import RentaTasksWizardPage from "../RentaTasksWizardPage";
import GetConstructionSitesDataRequest from "@/models/server/requests/GetConstructionSitesDataRequest";
import ConstructionSiteOrWarehouse from "@/models/server/ConstructionSiteOrWarehouse";
import Localizer from "../../../localization/Localizer";

export interface ISelectConstructionSiteProps {
}

interface ISelectConstructionSiteState {
}

export default class SelectConstructionSite extends RentaTasksWizardPage<ISelectConstructionSiteProps, ISelectConstructionSiteState> {

    private readonly ConstructionSitesId = "ConstructionSites";

    private get constructionSites(): ConstructionSitesWidget | null {
        return this.findWidget(this.ConstructionSitesId);
    }

    private async fetchConstructionSitesAsync(sender: IBaseComponent, endpoint: string): Promise<ConstructionSiteOrWarehouse[]> {

        const request = new GetConstructionSitesDataRequest();
        
        const items: ConstructionSiteOrWarehouse[] = await ApiProvider.postAsync(endpoint, request, sender);

        if (items.length === 0) {
            await this.alertErrorAsync(Localizer.rentaTasksSelectSiteNoAvailableSites);
        }

        return items;
    }

    private async selectConstructionSiteAsync(constructionSite: ConstructionSiteOrWarehouse, userInteraction: boolean): Promise<void> {
        
        this.wizard.owner = constructionSite;
        this.saveContext();

        if (userInteraction) {
            
            await this.setState({ constructionSite });
            
            await this.nextAsync();
        }
    }

    private async onSelectConstructionSiteAsync(constructionSite: ConstructionSiteOrWarehouse | null, userInteraction: boolean): Promise<void> {
        if (constructionSite != null) {
            await this.selectConstructionSiteAsync(constructionSite, userInteraction);
        }
    }
    
    private get selectedItem(): ConstructionSiteOrWarehouse | null {
        return (Utility.geoEnabled)
            ? null
            : this.wizard.owner;
    }

    protected get workOrderRequired(): boolean {
        return false;
    }
    
    public async nextAsync(): Promise<void> {
        if ((this.constructionSites != null) && (this.constructionSites!.selectedItem != null)) {
            await super.nextAsync();
        }
    }

    public getManual(): string {
        return Localizer.selectConstructionSiteGetManual;
    }

    public renderContent(): React.ReactNode {
        
        return (
            <React.Fragment>
                
                <ConstructionSitesWidget id={this.ConstructionSitesId} required stretchContent wide
                                         label={Localizer.selectConstructionSiteConstructionSite}
                                         description={Localizer.selectConstructionSiteConstructionSiteDescription}
                                         selectedItem={this.selectedItem || undefined}
                                         onChange={async (sender: ConstructionSitesWidget, item, userInteraction) => await this.onSelectConstructionSiteAsync(item, userInteraction)}
                                         fetchDataAsync={async (sender: ConstructionSitesWidget, endpoint) => this.fetchConstructionSitesAsync(sender, endpoint)}
                />

            </React.Fragment>
        );
    }
}