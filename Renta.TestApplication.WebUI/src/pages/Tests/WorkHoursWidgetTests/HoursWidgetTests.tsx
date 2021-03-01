import React from "react";
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import { WidgetContainer, HoursWidget, WorkHoursWidget } from "@weare/athenaeum-react-components";

export interface IHoursWidgetTestsState {
    normalHours: number,
    overtime50Hours: number,
    overtime100Hours: number,
}

export default class HoursWidgetTests extends BaseComponent<{}, IHoursWidgetTestsState> {
    state: IHoursWidgetTestsState = {
        normalHours: 0,
        overtime50Hours: 0,
        overtime100Hours: 0
    }
    
    private async onChange(normalHours: number, overtime50Hours: number, overtime100Hours: number): Promise<void> {
        await this.setState({normalHours, overtime50Hours, overtime100Hours});
        await ch.flyoutMessageAsync(`normalHours:${normalHours} overtime50Hours:${overtime50Hours} overtime100Hours:${overtime100Hours}`);
    }
    
    public render(): React.ReactNode {

        return (
            <React.Fragment>

                <WidgetContainer>

                    <HoursWidget label={Localizer.componentHoursWidgetHoursSpent}
                                 description={Localizer.componentHoursWidgetAddOvertime}
                                 normalHours={this.state.normalHours} overtime50Hours={this.state.overtime50Hours} overtime100Hours={this.state.overtime100Hours}
                                 wide
                                 onChange={async (sender, normal, overtime50, overtime100) => await this.onChange(normal, overtime50, overtime100)} />
                    
                    <WorkHoursWidget wide label={"WorkHoursWidget"} normalHours={7.5} />

                </WidgetContainer>
                
            </React.Fragment>
        );
    }
}