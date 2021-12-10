import BasePageParameters from "./BasePageParameters";
import {Utility} from "@weare/athenaeum-toolkit";

export default class PageRoute {

    /**
     * Name of the route. Unlocalized.
     */
    public name: string;

    public index: number | null;

    /**
     * Id of the route.
     */
    public id: string | null;

    /**
     * Parameters of the route.
     */
    public parameters: BasePageParameters | null;

    public isPageRoute: true = true;

    constructor(name: string, index: number | null = null, id: string | null = null, parameters: BasePageParameters | null = null) {
        this.name = name;
        this.index = index;
        this.id = id;
        this.parameters = parameters;
        this.isPageRoute = true;
    }

    public static isEqual(x: PageRoute | null, y: PageRoute | null): boolean {

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
        if ((x.parameters == null) && (y.parameters == null)) {
            return true;
        }

        if (Utility.getHashCode(x.parameters) != Utility.getHashCode(y.parameters)) {
            return false;
        }

        return true;
    }
}