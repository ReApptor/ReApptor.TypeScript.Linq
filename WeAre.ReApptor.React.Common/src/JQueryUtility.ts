import $ from "jquery";

export default class JQueryUtility {

    private static _jQuery: JQueryStatic | null;

    public static get $(): JQueryStatic {
        return this._jQuery || (this._jQuery = (window as any).$ || $);
    }

    public static getNode(id: string | JQuery<{}>): JQuery<{}> {
        return (typeof id === "string")
            ? this.$(`#${id}`)
            : id;
    }

    public static outerWidth(id: string | JQuery<{}>, includeMargin: boolean = true): number {
        return this.getNode(id).outerWidth(includeMargin) ?? 0;
    }

    public static innerWidth(id: string | JQuery<{}>): number {
        return this.getNode(id).innerWidth() ?? 0;
    }

    public static outerHeight(id: string | JQuery<{}>, includeMargin: boolean = true): number {
        return this.getNode(id).outerHeight(includeMargin) ?? 0;
    }

    public static innerHeight(id: string | JQuery<{}>): number {
        return this.getNode(id).innerHeight() ?? 0;
    }

    public static offsetLeft(id: string | JQuery<{}>, includeMargin: boolean = true): number {
        const node: JQuery<{}> = this.getNode(id);
        let offsetLeft: number = node.offset()?.left ?? 0;
        if (includeMargin) {
            const marginLeft = parseInt(node.css("margin-left")) || 0;
            offsetLeft -= marginLeft;
        }
        return offsetLeft;
    }

    public static offsetRight(id: string | JQuery<{}>, includeMargin: boolean = true): number {
        return JQueryUtility.viewportWidth() - this.offsetLeft(id, includeMargin) - this.outerWidth(id, includeMargin);
    }

    public static offsetTop(id: string | JQuery<{}>, includeMargin?: boolean): number {
        const node: JQuery<{}> = this.getNode(id);
        let offsetTop: number = node.offset()?.top ?? 0;
        if (includeMargin) {
            const marginTop = parseInt(node.css("margin-top")) || 0;
            offsetTop -= marginTop;
        }
        return offsetTop;
    }

    // public static offsetBottom(id: string): number {
    //     return this.documentHeight() - this.offsetTop(id);
    // }

    public static positionLeft(id: string | JQuery): number {
        return this.getNode(id).position()?.left;
    }

    public static positionRight(id: string | JQuery): number {
        return this.documentWidth() - this.positionLeft(id);
    }

    public static positionTop(id: string | JQuery): number {
        return this.getNode(id).position()?.top;
    }

    public static positionBottom(id: string | JQuery): number {
        return this.documentHeight() - this.positionTop(id);
    }

    public static viewportLeft(id: string | JQuery): number {
        return this.positionLeft(id) - this.viewportScrollLeft();
    }

    public static viewportRight(id: string | JQuery): number {
        return this.viewportWidth() - this.positionLeft(id);
    }

    public static viewportTop(id: string | JQuery): number {
        return this.positionTop(id) - this.viewportScrollTop();
    }

    public static viewportBottom(id: string | JQuery): number {
        return this.viewportHeight() - this.positionTop(id);
    }

    /**
     * Width of the visible part of the screen in pixels
     */
    public static viewportWidth(): number {
        return window.innerWidth;
    }

    /**
     * Height of the visible part of the screen in pixels
     */
    public static viewportHeight(): number {
        return window.innerHeight;
    }

    /**
     * Full width in pixels of the whole document, including the hidden part behind the horizontal scroll.
     */
    public static documentWidth(): number {
        return window.innerWidth;
    }

    /**
     * Full height in pixels of the whole document, including the hidden part behind the vertical scroll.
     */
    public static documentHeight(): number {
        return window.innerHeight;
    }

    public static viewportOffsetLeft(): number {
        return this.viewportScrollLeft();
    }

    public static viewportOffsetTop(): number {
        return this.viewportScrollTop();
    }

    public static viewportScrollLeft(): number {
        return this.$(document).scrollLeft() ?? 0;
    }

    public static viewportScrollTop(): number {
        return this.$(document).scrollTop() ?? 0;
    }
}