import {TimeSpan, Utility} from "@weare/athenaeum-toolkit";
import BaseRouteWidget, { IBaseRouteWidgetProps } from "../WidgetContainer/BaseRouteWidget";

export interface ITimeWidgetProps extends IBaseRouteWidgetProps {
    onClick?(): Promise<void>;
    checkout?: boolean;
    date?: Date;
}

export default class TimeWidget extends BaseRouteWidget<ITimeWidgetProps, Date> {

    protected async onNavigateAsync(): Promise<void> {
        if (this.props.onClick) {
            await this.props.onClick();
        }
    }

    private setTimer(): void {
        setTimeout(async () => await this.refreshDescriptionAsync(), 1000);
    }

    private async refreshDescriptionAsync(): Promise<void> {
        if (this.isMounted) {
            await this.reRenderAsync();
        }
        this.setTimer();
    }

    protected get description(): string {
        let description: string = "";
        const now: Date = Utility.now();
        if (this.props.checkout) {
            if (this.state.data != null) {
                const beginAt = new Date(this.state.data as any);
                const diff: TimeSpan = Utility.diff(now, beginAt);
                description = diff.toTimeString();
            }
        } else {
            description = Utility.format("{0:dd.MM.yyyy} {0:dddd} {0:HH:mm:ss}", now);
        }
        return description;
    }

    public async initializeAsync(): Promise<void> {
        if (this.props.date != null) {
            this.state.data = this.props.date;
        }
        this.setTimer();
    }
}
