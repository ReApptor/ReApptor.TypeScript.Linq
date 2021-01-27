import {Utility} from "@weare/athenaeum-toolkit";
import {ApiProvider} from "@weare/athenaeum-react-common";
import DropdownWidget from "../../../../components/WidgetContainer/DropdownWidget/DropdownWidget";
import { IconSize, IconStyle, IIconProps } from "@/components/Icon/Icon";
import { IBaseWidgetState } from "@/components/WidgetContainer/BaseWidget";
import Dropdown from "../../../../components/Form/Inputs/Dropdown/Dropdown";
import SetFavoriteRequest from "../../../../models/server/requests/SetFavoriteRequest";
import ConstructionSiteOrWarehouse from "@/models/server/ConstructionSiteOrWarehouse";

export default abstract class ConstructionSitesWidget extends DropdownWidget<ConstructionSiteOrWarehouse> {

    private async onGetPositionHandler(position: Position): Promise<void> {
        const items: ConstructionSiteOrWarehouse[] = this.items.where(item => item.location != null);
        if (items.length > 0) {
            const closest: ConstructionSiteOrWarehouse = items.min(item => Utility.distance(position, item.location!));
            await this.selectItemAsync(closest);
        }
    }

    protected async processDataAsync(state: IBaseWidgetState<ConstructionSiteOrWarehouse[]>, data: ConstructionSiteOrWarehouse[] | null): Promise<void> {

        await super.processDataAsync(state, data);
        
        if ((this.props.selectedItem == null) && (navigator.geolocation)) {
            navigator.geolocation.getCurrentPosition(async (position) => await this.onGetPositionHandler(position));
        }
    }

    protected async onFavoriteChangeAsync(sender: Dropdown<ConstructionSiteOrWarehouse>, item: ConstructionSiteOrWarehouse | null, favorite: boolean): Promise<void> {
        const endpoint: string = this.getActionEndpoint("SetFavorite");
        const request: SetFavoriteRequest = {
            id: item!.id,
            favorite: favorite
        };
        
        // do not await, we do not need result
        // noinspection ES6MissingAwait
        ApiProvider.postAsync(endpoint, request, null);
    }

    protected get icon(): IIconProps | null {
        return { name: "user-hard-hat", style: IconStyle.Solid, size: IconSize.X3 }
    }
    
    public isAsync(): boolean { return true; }

    public get favorite(): boolean { return true; }
};