import $ from "jquery";

export default class JQueryUtility {

    private static _jQuery: JQueryStatic | null;

    public static get $(): JQueryStatic {
        return this._jQuery || (this._jQuery = (window as any).$ || $);
    }
}