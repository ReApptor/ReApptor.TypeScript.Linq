import {Utility, GeoLocation, GeoCoordinate} from "@weare/athenaeum-toolkit";
import {PageRoute} from "@weare/athenaeum-react-common";
import {SelectListItem, StatusListItem} from "@/components/Dropdown/SelectListItem";
import User from "../models/server/User";
import UserSignIn from "../models/server/UserSignIn";
import OrganizationContract from "@/models/server/OrganizationContract";
import AddressHelper from "@/helpers/AddressHelper";
import ConstructionSite from "@/models/server/ConstructionSite";
import Product from "@/models/server/Product";

export default class Comparator {

    private static isEqualGeoCoordinate(x: GeoCoordinate, y: GeoCoordinate): boolean {
        return (x.lat === y.lat) && (x.lon === y.lon);
    }

    private static isEqualGeoLocation(x: GeoLocation, y: GeoLocation): boolean {
        if (x.formattedAddress === y.formattedAddress) {
            return true;
        }
        
        const xCoordinate: GeoCoordinate | null = AddressHelper.getCoordinate(x);
        const yCoordinate: GeoCoordinate | null = AddressHelper.getCoordinate(y);
        
        if (xCoordinate && yCoordinate) {
            return this.isEqualGeoCoordinate(xCoordinate, yCoordinate);
        }
        
        const xAddress: string = AddressHelper.removeLatLon(x.formattedAddress);
        const yAddress: string = AddressHelper.removeLatLon(y.formattedAddress);
        
        return (xAddress === yAddress);
    }

    private static isEqualStatusListItem(x: StatusListItem, y: StatusListItem): boolean {
        return (x.completed === y.completed) && (x.lineThrough === y.lineThrough) && (x.value === y.value);
    }
    
    public static isEqualPageRoute(x: PageRoute | null, y: PageRoute | null): boolean {

        if (x === y) {
            return true;
        }
        if ((x == null) && (y == null)) {
            return true;
        }
        if ((x == null) || (y == null)) {
            return false;
        }
        if (x.name !== y.name) {
            return false;
        }
        if (x.index !== y.index) {
            return false;
        }
        if (x.id !== y.id) {
            return false;
        }
        
        // TODO: compare parameters
        
        return true;
    }
    
    public static isEqual(x: any | string | null | undefined, y: any | string | null | undefined): boolean {
        if (x === y) {
            return true;
        }

        if ((x == null) && (y == null)) {
            return true;
        }

        if ((x == null) || (y == null)) {
            return false;
        }
        
        if (typeof x === "object") {

            if ((x instanceof StatusListItem) || (x.isStatusListItem)) {
                return ((y instanceof StatusListItem) || (y.isStatusListItem)) && (this.isEqualStatusListItem(x, y));
            }

            if ((x instanceof SelectListItem) || (x.isSelectListItem)) {
                return ((y instanceof SelectListItem) || (y.isSelectListItem)) && ((x as SelectListItem).value === (y as SelectListItem).value);
            }
            
            if ((x instanceof PageRoute) || (x.isPageRoute)) {
                return ((y instanceof PageRoute) || (y.isPageRoute)) && (this.isEqualPageRoute(x, y));
            }

            if ((x instanceof OrganizationContract) || (x.isOrganizationContract)) {
                return ((y instanceof OrganizationContract) || (y.isOrganizationContract))
                    ? ((x as OrganizationContract).id == (y as OrganizationContract).id)
                    : ((typeof y === "string") && ((x as OrganizationContract).id === y as string))
            }

            if ((x instanceof User) || (x.isUser)) {
                return ((y instanceof User) || (y.isUser))
                    ? ((x as User).id == (y as User).id)
                    : ((typeof y === "string") && ((x as User).id === y as string));
            }

            if ((x instanceof ConstructionSite) || (x.isConstructionSite)) {
                return ((y instanceof ConstructionSite) || (y.isConstructionSite))
                    ? ((x as ConstructionSite).id == (y as ConstructionSite).id)
                    : ((typeof y === "string") && ((x as ConstructionSite).id === y as string))
            }

            if ((x instanceof Product) || (x.isProduct)) {
                return ((y instanceof Product) || (y.isProduct))
                    ? ((x as Product).id == (y as Product).id)
                    : ((typeof y === "string") && ((x as Product).id === y as string))
            }

            if ((x instanceof UserSignIn) || (x.isUserSignIn)) {
                return ((y instanceof UserSignIn) || (y.isUserSignIn)) && ((x as UserSignIn).id == (y as UserSignIn).id);
            }

            if ((x instanceof GeoLocation) || (x.isGeoLocation)) {
                return ((y instanceof GeoLocation) || (y.isGeoLocation)) && (this.isEqualGeoLocation(x, y));
            }

            if ((x instanceof GeoCoordinate) || (x.isGeoCoordinate)) {
                return ((y instanceof GeoCoordinate) || (y.isGeoCoordinate)) && (this.isEqualGeoCoordinate(x, y));
            }

            if ((Utility.isDateType(x)) || (Utility.isDateType(y))) {
                const xDate: Date = new Date(x);
                const yDate: Date = new Date(y);
                return (xDate.valueOf() === yDate.valueOf());
            }
        }
        
        if ((typeof x === "string") && (typeof y === "object")) {
            return Comparator.isEqual(y as any, x as string);
        }
        
        if ((Array.isArray(x)) && (Array.isArray(y))) {
            
            if (x.length !== y.length) {
                return false;
            }
            
            for (let i: number = 0; i < x.length; i++) {
                if (!Comparator.isEqual(x[i], y[i])) {
                    return false;
                }
            }
            
            return true;
        }

        return (x == y);
    }
}
