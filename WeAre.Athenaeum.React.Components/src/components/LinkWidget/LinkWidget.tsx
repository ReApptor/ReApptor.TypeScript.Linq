import {LinkTarget} from "@weare/athenaeum-react-common";
import BaseWidget, { IBaseWidgetProps } from "../WidgetContainer/BaseWidget";

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
