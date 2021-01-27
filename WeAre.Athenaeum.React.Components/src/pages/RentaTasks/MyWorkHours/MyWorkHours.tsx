import React from "react";
import {Utility, TimeSpan} from "@weare/athenaeum-toolkit";
import AuthorizedPage from "../../../models/base/AuthorizedPage";
import PageContainer from "../../../components/PageContainer/PageContainer";
import WidgetContainer from "../../../components/WidgetContainer/WidgetContainer";
import RentaTaskConstants from "../../../helpers/RentaTaskConstants";
import User from "../../../models/server/User";
import TitleWidget from "../../../components/WizardContainer/TitleWidget/TitleWidget";
import GetUserDailyHoursRequest from "../../../models/server/requests/GetUserDailyHoursRequest";
import SaveUserDailyHourRequest from "../../../models/server/requests/SaveUserDailyHourRequest";
import WorkHoursWidget from "./WorkHoursWidget/WorkHoursWidget";
import UserDailyHourResponse from "../../../models/server/responses/UserDailyHourResponse";
import UserSalaryHour from "@/models/server/UserSalaryHour";
import HoursWidget from "@/components/WidgetContainer/HoursWidget/HoursWidget";
import WorkOrderModel from "@/models/server/WorkOrderModel";
import TransformProvider from "@/providers/TransformProvider";
import RentaTasksController from "../RentaTasksController";
import Localizer from "../../../localization/Localizer";

import rentaTaskStyles from "@/pages/RentaTask.module.scss";
import styles from "./MyWorkHours.module.scss";

interface IMyWorkHoursState {
    userDailyHours: UserSalaryHour[] | null;
    date: Date | null;
}

export default class MyWorkHoursPage extends AuthorizedPage<IMyWorkHoursState> {
    
    state: IMyWorkHoursState = {
        userDailyHours: null,
        date: Utility.today()
    };
    
    private get day(): string {
        return Utility.getDayOfWeek(this.state.date!.getDay());
    }
    
    private get userDailyHours(): UserSalaryHour[] {
        return this.state.userDailyHours || [];
    }
    
    private get normalHoursSum(): number {
        return this.userDailyHours.sum(item => item.normalHours);
    }
    
    private canModify(workOrder: WorkOrderModel | null): boolean {
        const currentDate: Date = this.state.date!;
        const today: Date = Utility.today();
        const diff: TimeSpan = Utility.diff(today, currentDate, true);
        let canModify: boolean = (diff.totalHours <= RentaTaskConstants.canModifyHoursRange);
        canModify = canModify && ((workOrder == null) || ((!workOrder.locked) && (RentaTasksController.checkedInWorkOrderId != workOrder.id)));
        return canModify;
    }

    private async onDateChangeAsync(date: Date) {
        date = date.date();

        await this.setState({ date });
        
        await this.fetchUserDailyHours();
    }

    private async fetchUserDailyHours(): Promise<void> {
        const user: User = this.getUser();

        const request: GetUserDailyHoursRequest = {
            day: this.state.date,
            mounterUserId: user.id
        };

        const response: UserDailyHourResponse = await this.postAsync("api/rentaTasks/getUserDailyHours", request);

        await this.setState({userDailyHours: response.userDailyHours});
    }
    
    private async saveUserDailyHourAsync(dailyHour: UserSalaryHour, normalHours: number, overtime50Hours: number, overtime100Hours: number) {

        dailyHour.normalHours = normalHours;
        dailyHour.overtime50Hours = overtime50Hours;
        dailyHour.overtime100Hours = overtime100Hours;
        dailyHour.overtimeTotalHours = overtime50Hours + overtime100Hours;

        const request: SaveUserDailyHourRequest = {
            userSalaryHourId: dailyHour.id,
            normalHours: normalHours,
            overtime50Hours: overtime50Hours,
            overtime100Hours: overtime100Hours
        };

        await this.postAsync("api/rentaTasks/saveUserDailyHour", request);

        await this.reRenderAsync();
    }

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();
        
        await this.fetchUserDailyHours();
    }
    
    private renderDailyHours(dailyHour: UserSalaryHour, compactView: boolean): React.ReactNode {
        
        const canModify: boolean = this.canModify(dailyHour.workOrder);
        
        return (
            <HoursWidget key={dailyHour.id} wide
                         minimized={compactView}
                         label={(dailyHour.workOrder) ? dailyHour.workOrder.name : Localizer.myWorkHoursNoTask}
                         description={TransformProvider.toString(dailyHour.owner)}
                         className={this.css(!canModify && styles.approved)}
                         readonly={!canModify}
                         normalHours={dailyHour.normalHours} overtime50Hours={dailyHour.overtime50Hours} overtime100Hours={dailyHour.overtime100Hours}
                         onChange={async (sender, normalHours, overtime50Hours, overtime100Hours) => await this.saveUserDailyHourAsync(dailyHour, normalHours, overtime50Hours, overtime100Hours)}
            />
        );
    }

    public render(): React.ReactNode {
        
        const compactView: boolean = (this.userDailyHours.length >= 3);
        
        return (
            <PageContainer transparent={this.desktop} className={this.css(rentaTaskStyles.pageContainer, styles.myWorkHours)} alertClassName={rentaTaskStyles.alert}>

                <WidgetContainer>
                 
                    <WorkHoursWidget wide
                                     label={this.day}
                                     normalHours={this.normalHoursSum}
                                     onChange={async (_, date) => await this.onDateChangeAsync(date)}
                    />

                    <TitleWidget label={Localizer.myWorkHoursLunchHourInstructionsTitle} description={Localizer.myWorkHoursLunchHourInstructionsDescription} wide />

                    {
                        (this.userDailyHours.length === 0)
                            ? <TitleWidget wide label={Localizer.myWorkHoursNoReportedHours}/>
                            : this.userDailyHours.map((dailyHour: UserSalaryHour) => this.renderDailyHours(dailyHour, compactView))
                    }
                    
                </WidgetContainer>
                
            </PageContainer>
        )
    }
}