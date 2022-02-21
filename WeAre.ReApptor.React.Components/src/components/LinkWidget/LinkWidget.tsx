import {LinkTarget} from "@weare/reapptor-react-common";
import BaseWidget, { IBaseWidgetProps } from "../WidgetContainer/BaseWidget";

export interface ILinkWidgetProps extends IBaseWidgetProps {
    url: string;
    target?: LinkTarget;
}

export default class LinkWidget extends BaseWidget<ILinkWidgetProps> {

    protected getHref(): string {
        return this.props.url;
    }

    protected getTarget(): LinkTarget {
        return this.props.target ?? LinkTarget.Blank;
    }
}