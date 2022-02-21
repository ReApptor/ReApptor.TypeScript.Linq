import {BaseTransformProvider, Utility, GeoLocation, TFormat} from "@weare/reapptor-toolkit";
import {ITitleModel, SelectListGroup, SelectListItem} from "@weare/reapptor-react-components";

class TransformProvider extends BaseTransformProvider {
    
    protected createSelectListItem(value: string, text: string, subtext: string, groupName?: string | null, favorite?: boolean | null): SelectListItem {
        const listItem = new SelectListItem(value, text, subtext);
        listItem.favorite = (favorite == true);
        if (groupName) {
            listItem.group = SelectListGroup.create(groupName);
        }
        return listItem;
    }

    public constructor() {
        super();
    }

    public toTitle(item: any): ITitleModel {

        let label: string | null = null;
        let description: string | null = null;

        if (item != null) {

            label = Utility.findStringValueByAccessor(item, ["label", "name"]);
            description = Utility.findStringValueByAccessor(item, ["description", "text"]);
        }

        return {
            description: description || "",
            label: label || "",
            icon: null
        };
    }

    public locationToString(location: GeoLocation | null) {
        return (location != null)
            ? [location.address, location.postalCode, location.city].filter(item => !!item).join(", ")
            : "";
    }
    
    public toString(item: any, format?: TFormat | null): string {
        
        if (item == null) {
            return "";
        }

        if ((item instanceof GeoLocation) || (item.isGeoLocation === true)) {
            return this.locationToString(item as GeoLocation);
        }

        return super.toString(item, format);
    }

    public toSelectListItem(item: any): SelectListItem {
        return super.toSelectListItem(item) as SelectListItem;
    }
}

export default new TransformProvider();