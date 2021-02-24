import BaseWidget, { IBaseWidgetProps } from "../../BaseWidget";
import { LinkTarget } from "@/models/Enums";

export interface ILinkWidgetProps extends IBaseWidgetProps {
    url: string;
}

export default class LinkWidget extends BaseWidget<ILinkWidgetProps> {
    protected getHref(): string {
        return this.props.url;
    }

    protected getTarget(): LinkTarget {
        return LinkTarget.Blank;
    }
}