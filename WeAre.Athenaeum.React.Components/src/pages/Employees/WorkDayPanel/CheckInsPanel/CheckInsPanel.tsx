import React from "react";
import {BaseComponent, TextAlign} from "@weare/athenaeum-react-common";
import Grid from "../../../../components/Grid/Grid";
import {CellModel, ColumnDefinition, GridHoveringType, GridOddType, RowModel} from "@/components/Grid/GridModel";
import UserSalaryHour from "../../../../models/server/UserSalaryHour";
import UserCheckIn from "../../../../models/server/UserCheckIn";
import UserSignIn from "../../../../models/server/UserSignIn";
import ConstructionSiteOrWarehouse from "../../../../models/server/ConstructionSiteOrWarehouse";
import WorkOrderModel from "../../../../models/server/WorkOrderModel";
import Comparator from "../../../../helpers/Comparator";
import GetUserCheckInsRequest from "@/models/server/requests/GetUserCheckInsRequest";
import TransformProvider from "../../../../providers/TransformProvider";
import Localizer from "../../../../localization/Localizer";

import styles from "./CheckInsPanel.module.scss";

interface ICheckInsPanelProps  {
    userSalaryHourRow: RowModel<UserSalaryHour>;
}

interface ICheckInsPanelState {
}

export default class CheckInsPanel extends BaseComponent<ICheckInsPanelProps, ICheckInsPanelState> {

    state: ICheckInsPanelState = {
    };

    private readonly _gridRef: React.RefObject<Grid<UserCheckIn>> = React.createRef();
    
    private readonly columns: ColumnDefinition[] = [
        {
            group: Localizer.checkInsPanelSignLanguageItemName,
            header: Localizer.checkInsPanelSignInLanguageItemName,
            accessor: "signIn.signInAt",
            format: "t",
            textAlign: TextAlign.Center,
            init: (cell) => this.initSignInAtColumn(cell),
        } as ColumnDefinition,
        {
            group: Localizer.checkInsPanelSignLanguageItemName,
            header: Localizer.checkInsPanelSignOutLanguageItemName,
            accessor: "signIn.signOutAt",
            format: "t",
            textAlign: TextAlign.Center,
            init: (cell) => this.initSignOutAtColumn(cell),
        } as ColumnDefinition,{
            header: Localizer.checkInsPanelSiteOrWarehouseLanguageItemName,
            accessor: "owner",
            transform: (cell, value) => (value) ? TransformProvider.constructionSiteOrWarehouseToString(value, true) : "",
            minWidth: 250,
            init: (cell) => this.groupBySiteOrWarehouse(cell),
        } as ColumnDefinition,
        {
            header: Localizer.checkInsPanelTaskLanguageItemName,
            accessor: "workOrder",
            minWidth: 300,
            init: (cell) => this.groupByTask(cell),
        } as ColumnDefinition,
        {
            group: Localizer.checkInsPanelCheckInLanguageItemName,
            header: Localizer.checkInsPanelCheckInAtLanguageItemName,
            accessor: "checkInAt",
            format: "t",
            textAlign: TextAlign.Center,
            init: (cell) => this.initCheckInAtColumn(cell),
        } as ColumnDefinition,
        {
            group: Localizer.checkInsPanelCheckInLanguageItemName,
            header: Localizer.checkInsPanelCheckInAddressLanguageItemName,
            accessor: "checkInLocation",
            minWidth: 200
        } as ColumnDefinition,
        {
            group: Localizer.checkInsPanelCheckOutLanguageItemName,
            header: Localizer.checkInsPanelCheckOutAtLanguageItemName,
            accessor: "checkOutAt",
            format: "t",
            textAlign: TextAlign.Center,
            init: (cell) => this.initCheckOutAtColumn(cell),
        } as ColumnDefinition,
        {
            group: Localizer.checkInsPanelCheckOutLanguageItemName,
            header: Localizer.checkInsPanelCheckOutAddressLanguageItemName,
            accessor: "checkOutLocation",
            format: "t",
            minWidth: 200
        } as ColumnDefinition,
        {
            header: Localizer.workDayPanelWorkingHoursLanguageItemName,
            accessor: "autoHours",
            format: "0.00",
            minWidth: 80,
            textAlign: TextAlign.Center
        } as ColumnDefinition,
        {

            header: Localizer.taskHoursPanelExtraHoursLanguageItemName,
            accessor: "extraHours",
            format: "0.00",
            minWidth: 80,
            textAlign: TextAlign.Center
        } as ColumnDefinition,
    ];
    
    private async fetchDataAsync(): Promise<UserCheckIn[]> {
        const request = new GetUserCheckInsRequest();
        request.userSalaryDayId = this.userSalaryHour.userSalaryDay!.id;
        request.userId = this.userSalaryHour.user!.id;
        return await this.grid.postAsync("api/employees/getUserCheckIns", request);
    }

    private groupBySignIn(cell: CellModel<UserCheckIn>): void {
        if (!cell.spanned) {
            const model: UserCheckIn = cell.row.model;
            const signIn: UserSignIn | null = model.signIn;
            const sameRows: RowModel<UserCheckIn>[] = (cell.nextRows(item => Comparator.isEqual(item.signIn, signIn)));
            cell.rowSpan = (sameRows.length + 1);
        }
    }

    private groupBySiteOrWarehouse(cell: CellModel<UserCheckIn>): void {
        if (!cell.spanned) {
            const model: UserCheckIn = cell.row.model;
            const signIn: UserSignIn | null = model.signIn;
            const constructionSiteOrWarehouse: ConstructionSiteOrWarehouse | null = model.owner;
            const sameRows: RowModel<UserCheckIn>[] = (cell.nextRows(item => 
                (Comparator.isEqual(item.signIn, signIn)) &&
                (Comparator.isEqual(item.owner, constructionSiteOrWarehouse))));
            cell.rowSpan = (sameRows.length + 1);
        }
    }

    private groupByTask(cell: CellModel<UserCheckIn>): void {
        if (!cell.spanned) {
            const model: UserCheckIn = cell.row.model;
            const signIn: UserSignIn | null = model.signIn;
            const constructionSiteOrWarehouse: ConstructionSiteOrWarehouse | null = model.owner;
            const workOrder: WorkOrderModel | null = model.workOrder;
            const sameRows: RowModel<UserCheckIn>[] = (cell.nextRows(item =>
                (Comparator.isEqual(item.signIn, signIn)) &&
                (Comparator.isEqual(item.owner, constructionSiteOrWarehouse)) &&
                (Comparator.isEqual(item.workOrder, workOrder))));
            cell.rowSpan = (sameRows.length + 1);
        }
    }

    private initSignInAtColumn(cell: CellModel<UserCheckIn>): void {
        this.groupBySignIn(cell);
        const model: UserCheckIn = cell.row.model;
        const signIn: UserSignIn = model.signIn!;
        cell.className = (signIn.signOutAt == null)
            ? "green"
            : "";
    }

    private initSignOutAtColumn(cell: CellModel<UserCheckIn>): void {
        this.groupBySignIn(cell);
        const model: UserCheckIn = cell.row.model;
        const signIn: UserSignIn = model.signIn!;
        cell.className = (signIn.expired)
            ? "danger"
            : "";
    }

    private initCheckInAtColumn(cell: CellModel<UserCheckIn>): void {
        const model: UserCheckIn = cell.row.model;
        cell.className = (model.checkOutAt == null)
            ? "green"
            : "";
    }

    private initCheckOutAtColumn(cell: CellModel<UserCheckIn>): void {
        const model: UserCheckIn = cell.row.model;
        cell.className = (model.expired)
            ? "danger"
            : "";
    }

    private get userSalaryHour(): UserSalaryHour {
        return this.userSalaryHourRow.model;
    }

    private get userSalaryHourRow(): RowModel<UserSalaryHour> {
        return this.props.userSalaryHourRow;
    }

    private get grid(): Grid<UserCheckIn> {
        return this._gridRef.current!;
    }
    
    public hasSpinner(): boolean {
        return true;
    }

    public render(): React.ReactNode {
        
        return (
            <div className={this.css(styles.checkInsPanel)}>
                
                <Grid id="userCheckIns" ref={this._gridRef}
                      noDataNoHeader
                      noDataText={Localizer.checkInsPanelNoDataText}
                      className={this.css(styles.grid)}
                      minWidth="auto"
                      hovering={GridHoveringType.None}
                      odd={GridOddType.None}
                      columns={this.columns}
                      fetchData={async () => await this.fetchDataAsync()}
                />
                      
            </div>
        );
    }
};