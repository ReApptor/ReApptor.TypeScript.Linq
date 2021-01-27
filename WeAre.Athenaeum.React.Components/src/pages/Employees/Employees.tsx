import React from "react";
import PageRow from "../../components/PageContainer/PageRow/PageRow";
import AuthorizedPage from "../../models/base/AuthorizedPage";
import PageContainer from "../../components/PageContainer/PageContainer";
import WorkDayPanel from "./WorkDayPanel/WorkDayPanel";
import Localizer from "@/localization/Localizer";

import styles from "./Employees.module.scss";

interface IEmployeesProps {
}

interface IEmployeesState {
}

export default class Employees extends AuthorizedPage<IEmployeesProps, IEmployeesState> {

    public getTitle(): string {
        return Localizer.topNavEmployees;
    }
    
    state: IEmployeesState = {};

    public render(): React.ReactNode {
        return (
            <PageContainer scale className={styles.employees}>
                <PageRow>
                    <WorkDayPanel />
                </PageRow>
            </PageContainer>
        );
    }
}