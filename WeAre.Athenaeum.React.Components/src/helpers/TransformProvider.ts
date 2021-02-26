import {BaseTransformProvider, TFormat, Utility, GeoLocation} from "@weare/athenaeum-toolkit";
import {ch} from "@weare/athenaeum-react-common";
import ConstructionSite from "../models/server/ConstructionSite";
import ConstructionSiteOrWarehouse from "../models/server/ConstructionSiteOrWarehouse";
import FavoriteItem from "../models/server/FavoriteItem";
import {ConstructionSiteOrWarehouseType} from "@/models/Enums";
import {ITitleModel} from "@/components/WizardContainer/TitleWidget/TitleWidget";
import WorkOrderModel from "../models/server/WorkOrderModel";
import Organization from "../models/server/Organization";
import Product from "../models/server/Product";
import TaskMounter from "../models/server/TaskMounter";
import User from "../models/server/User";
import UserStatus from "../models/server/UserStatus";
import UserRole from "../models/server/UserRole";
import OrganizationContract from "../models/server/OrganizationContract";
import RentaTaskConstants from "@/helpers/RentaTaskConstants";
import EnumProvider from "@/providers/EnumProvider";
import Localizer from "../localization/Localizer";

class TransformProvider extends BaseTransformProvider {

    public constructor() {
        super();
    }

    public toTitle(item: any): ITitleModel {

        let label: string | null = null;
        let description: string | null = null;

        if (item != null) {

            if ((item instanceof WorkOrderModel) || (item.isWorkOrderModel === true)) {
                return this.toWorkOrderModelTitle(item as WorkOrderModel);
            }

            if ((item instanceof ConstructionSiteOrWarehouse) || (item.isConstructionSiteOrWarehouse === true)) {
                return this.toConstructionSiteOrWarehouseTitle(item as ConstructionSiteOrWarehouse);
            }

            label = Utility.findStringValueByAccessor(item, ["label", "name"]);
            description = Utility.findStringValueByAccessor(item, ["description", "text"]);
        }

        return {
            description: description || "",
            label: label || "",
            icon: null
        };
    }

    public toWorkOrderModelTitle(item: WorkOrderModel): ITitleModel {
        const label: string = (item.owner != null)
            ? `${item.name}, ${item.owner.name}`
            : item.name;

        let description: string | null = item.description || "";
        if (description) {
            description = (description.length > RentaTaskConstants.maxTitleDescriptionLength)
                ? description.substr(0, RentaTaskConstants.maxTitleDescriptionLength) + "..."
                : description;
        } else {
            description = ((item.owner != null) && (item.owner.location != null))
                ? (item.code)
                    ? `#${item.code}, ${this.locationToString(item.owner.location)}`
                    : this.locationToString(item.owner.location)
                : (item.code)
                    ? `#${item.code}`
                    : "";
        }
        
        return {
            label: label,
            description: description,
            icon: {name: "far layer-plus"}
        };
    }

    public toConstructionSiteOrWarehouseTitle(item: ConstructionSiteOrWarehouse): ITitleModel {
        const type: string = (item.type === ConstructionSiteOrWarehouseType.ConstructionSite) ? Localizer.genericConstructionsite : Localizer.genericWarehouse;
        const address: string = this.locationToString(item.location);
        return {
            label: `${item.name}`,
            description: (address) ? `${address} \n ${type}` : type,
            icon: (item.type === ConstructionSiteOrWarehouseType.ConstructionSite)
                ? { name: "fas user-hard-hat" }
                : { name: "far forklift" }
        };
    }

    public workOrderModelToString(item: WorkOrderModel): string {
        return item.name;
    }

    public productToString(item: Product): string {
        return item.name;
    }

    public constructionSiteOrWarehouseToString(item: ConstructionSiteOrWarehouse, nameOnly: boolean = false): string {
        const address = (nameOnly) ? "" : this.locationToString(item.location);
        return (address) ? `${item.name}, ${address}` : item.name;
    }

    public userToString(item: User): string {
        const firstname: string = (item.firstname != null) ? item.firstname : "";
        const lastName: string = (item.lastName != null) ? item.lastName : "";
        if (firstname || lastName) {
            return `${firstname} ${lastName}`.trim();
        }
        return item.username;
    }

    public constructionSiteToString(item: ConstructionSite): string {
        const address: string = this.locationToString(item.location);
        return (address)
            ? `${item.name}, ${address}`
            : item.name;
    }

    public organizationToString(item: Organization): string {
        return (item.vatId)
            ? `${item.name}, ${item.vatId}`
            : item.name;
    }

    public organizationContractToString(item: OrganizationContract): string {
        return (item.externalId)
            ? `${item.name}, ${item.externalId}`
            : item.name;
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

        if ((item instanceof ConstructionSiteOrWarehouse) || (item.isConstructionSiteOrWarehouse === true)) {
            return this.constructionSiteOrWarehouseToString(item as ConstructionSiteOrWarehouse);
        }

        if ((item instanceof ConstructionSite) || (item.isConstructionSite === true)) {
            return this.constructionSiteToString(item as ConstructionSite);
        }

        if ((item instanceof Organization) || (item.isOrganization === true)) {
           return this.organizationToString(item as Organization);
        }

        if ((item instanceof OrganizationContract) || (item.isOrganizationContract === true)) {
            return this.organizationContractToString(item as OrganizationContract);
        }

        if ((item instanceof User) || (item.isUser === true)) {
            return this.userToString(item as User);
        }

        if ((item instanceof GeoLocation) || (item.isGeoLocation === true)) {
            return this.locationToString(item as GeoLocation);
        }

        if ((item instanceof WorkOrderModel) || (item.isWorkOrderModel === true)) {
            return this.workOrderModelToString(item as WorkOrderModel);
        }

        if ((item instanceof Product) || (item.isProduct === true)) {
            return this.productToString(item as Product);
        }

        return super.toString(item, format);
    }

    public toSelectListItem(item: any): SelectListItem {

        if ((item instanceof SelectListItem) || (item.isSelectListItem === true)) {
            return item as SelectListItem;
        }

        if ((item instanceof FavoriteItem) || (item.isFavoriteItem === true)) {
            return this.toFavoriteListItem(item as FavoriteItem);
        }

        if ((item instanceof ConstructionSiteOrWarehouse) || (item.isConstructionSiteOrWarehouse === true)) {
            return this.toConstructionSiteOrWarehouseListItem(item as ConstructionSiteOrWarehouse);
        }

        if ((item instanceof WorkOrderModel) || (item.isWorkOrderModel === true)) {
            return this.toWorkOrderModelListItem(item as WorkOrderModel);
        }

        if ((item instanceof ConstructionSite) || (item.isConstructionSite === true)) {
            return this.toConstructionSiteListItem(item as ConstructionSite);
        }

        if ((item instanceof Warehouse) || (item.isWarehouse === true)) {
            return this.toWarehouseListItem(item as Warehouse);
        }

        if ((item instanceof Organization) || (item.isOrganization === true)) {
            return this.toOrganizationListItem(item as Organization);
        }

        if ((item instanceof OrganizationContract) || (item.isOrganizationContract === true)) {
            return this.toOrganizationContractListItem(item as OrganizationContract);
        }

        if ((item instanceof Product) || (item.isProduct === true)) {
            return this.toProductListItem(item as Product);
        }

        if ((item instanceof TaskMounter) || (item.isTaskMounter === true)) {
            return this.toTaskMounterListItem(item as TaskMounter);
        }

        if ((item instanceof User) || (item.isUser === true)) {
            return this.toUserListItem(item as User);
        }

        if ((item instanceof UserRole) || (item.isUserRole === true)) {
            return this.toUserRoleListItem(item as UserRole);
        }

        if ((item instanceof UserStatus) || (item.isUserStatus === true)) {
            return this.toUserStatusListItem(item as UserStatus);
        }
        

        if (typeof item === "number") {
            const listItem = new SelectListItem();
            listItem.value = item.toString();
            listItem.text = item.toString();
            listItem.ref = item;
            return listItem;
        }

        if (typeof item === "string") {
            const listItem = new SelectListItem();
            listItem.value = item;
            listItem.text = item;
            listItem.ref = item;
            return listItem;
        }

        const value: any = Utility.findStringValueByAccessor(item, ["value"]);
        const id: any = Utility.findValueByAccessor(item, ["id", "code"]);
        const name: string | null = Utility.findStringValueByAccessor(item, ["name", "text", "label"]);
        const subtext: string | null = Utility.findStringValueByAccessor(item, ["subtext", "description"]);
        const favorite: boolean = (Utility.findStringValueByAccessor(item, "favorite") === "true");
        const groupName: string | null = Utility.findStringValueByAccessor(item, ["group", "group.name"]);

        const listItem = new SelectListItem();

        listItem.value = (value)
            ? value
            : (id != null)
                ? id.toString()
                : (name)
                    ? name
                    : ch.getId().toString();

        if (name) {
            listItem.text = name;
        }

        if (subtext) {
            listItem.subtext = subtext;
        }

        if (groupName) {
            listItem.group = SelectListGroup.create(groupName);
        }

        listItem.favorite = favorite;
        listItem.ref = item;

        return listItem;
    }

    public toUserListItem(item: User): StatusListItem {
        const selectedItem = new StatusListItem();
        selectedItem.ref = item;
        selectedItem.value = item.id;
        selectedItem.text = this.toString(item);
        selectedItem.subtext = item.email || item.phone;
        selectedItem.lineThrough = item.isDeleted;
        selectedItem.completed = !item.isLocked;
        if(item.role != null && item.role.group != null){
            selectedItem.group = SelectListGroup.create(EnumProvider.getUserRoleGroupName(item.role.group));
        }

        return selectedItem;
    }

    public toUserRoleListItem(item: UserRole): SelectListItem {
        const selectedItem = new SelectListItem();
        selectedItem.ref = item;
        selectedItem.value = item.roleName;
        selectedItem.text = Localizer.get(`RoleName.${item.roleName}`);
        selectedItem.group = SelectListGroup.create(EnumProvider.getUserRoleGroupName(item.group));
        return selectedItem;
    }

    public toUserStatusListItem(item: UserStatus): StatusListItem {
        const selectedItem = new StatusListItem();
        selectedItem.ref = item;
        selectedItem.value = item.user.id;
        selectedItem.text = this.toString(item.user);
        selectedItem.subtext = item.user.email || item.user.phone;
        selectedItem.completed = item.completed;
        selectedItem.lineThrough = item.user.isDeleted;
        return selectedItem;
    }

    public toFavoriteListItem(item: FavoriteItem): SelectListItem {
        let selectedItem: SelectListItem | null = null;

        if (item.constructionSite != null) {
            selectedItem = this.toConstructionSiteListItem(item.constructionSite);
        } else if (item.warehouse != null) {
            selectedItem = this.toWarehouseListItem(item.warehouse);
        }

        if (selectedItem == null) {
            selectedItem = this.toSelectListItem(item);
        }

        selectedItem!.favorite = item.favorite;

        return selectedItem!;
    }

    public toConstructionSiteListItem(item: ConstructionSite): SelectListItem {
        const address: string = this.locationToString(item.location);
        const selectedItem = new SelectListItem();
        selectedItem.ref = item;
        selectedItem.value = item.id;
        selectedItem.text = item.name || address;
        selectedItem.subtext = address;
        return selectedItem;
    }

    public toWarehouseListItem(item: Warehouse): SelectListItem {
        const selectedItem = new SelectListItem();
        selectedItem.ref = item;
        selectedItem.value = item.id;
        selectedItem.text = item.name;
        selectedItem.subtext = this.locationToString(item.location);
        return selectedItem;
    }

    public toConstructionSiteOrWarehouseListItem(item: ConstructionSiteOrWarehouse): SelectListItem {
        const address: string = this.locationToString(item.location);
        const selectedItem = new SelectListItem();
        selectedItem.ref = item;
        selectedItem.value = item.id;
        selectedItem.text = item.name || address;
        selectedItem.subtext = address;
        selectedItem.favorite = item.favorite;
        selectedItem.group = (item.type === ConstructionSiteOrWarehouseType.ConstructionSite)
            ? SelectListGroup.create(Localizer.dropdownGroupConstructionSitesLanguageItemName)
            : SelectListGroup.create(Localizer.dropdownGroupWarehousesLanguageItemName);
        return selectedItem;
    }

    public toWorkOrderModelListItem(item: WorkOrderModel): SelectListItem {
        const selectedItem = new StatusListItem();
        selectedItem.ref = item;
        selectedItem.value = item.id;
        selectedItem.text = this.workOrderModelToString(item);
        const activationDate: string = Utility.format("{0:D}", item.activationDate);
        const completed: string = (item.completed) ? ", completed" : "";
        selectedItem.subtext = `#${item.code}, ${item.mounters.length} mounters, ${activationDate}${completed}`;
        selectedItem.lineThrough = item.deleted;
        selectedItem.completed = item.locked;
        return selectedItem;
    }

    public toOrganizationListItem(item: Organization): SelectListItem {
        const selectedItem = new SelectListItem();
        selectedItem.ref = item;
        selectedItem.value = item.id;
        selectedItem.text = item.name || item.vatId;
        selectedItem.subtext = item.vatId;
        selectedItem.favorite = item.favorite;        
        return selectedItem;
    }
    
    public toOrganizationContractListItem(item: OrganizationContract): SelectListItem {
        const selectedItem = new SelectListItem();
        selectedItem.ref = item;
        selectedItem.value = item.id;
        selectedItem.text = item.name || item.externalId;
        selectedItem.subtext = item.externalId;
        selectedItem.favorite = item.favorite;
        return selectedItem;
    }

    public toProductListItem(item: Product): SelectListItem {
        const selectedItem = new SelectListItem();
        selectedItem.ref = item;
        selectedItem.value = item.id;
        selectedItem.text = item.name;
        if (item.category !== null) {
            selectedItem.group = new SelectListGroup();
            selectedItem.group.name = (item.category.parent != null)
                    ? `${item.category.parent.name} / ${item.category.name}`
                    : item.category.name;
        }
        return selectedItem;
    }

    public toTaskMounterListItem(item: TaskMounter): SelectListItem {
        const selectedItem = new SelectListItem();
        const user: User = item.user!;
        selectedItem.ref = item;
        selectedItem.value = user.id;
        selectedItem.text = this.userToString(user);
        selectedItem.subtext = `${item.workingPlace !== null ? 1 : 0}/${item.tasks} tasks`;
        selectedItem.group = SelectListGroup.create(EnumProvider.getUserRoleGroupName(item.user.role.group));
        if (item.workingPlace !== null) {
            selectedItem.group = new SelectListGroup();
            selectedItem.group.name = this.constructionSiteOrWarehouseToString(item.workingPlace);
        }
        return selectedItem;
    }
}

export default new TransformProvider();