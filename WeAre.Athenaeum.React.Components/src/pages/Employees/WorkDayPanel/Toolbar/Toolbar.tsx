import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseComponent, IBaseComponent} from "@weare/athenaeum-react-common";
import Dropdown, {DropdownAlign, DropdownOrderBy} from "../../../../components/Form/Inputs/Dropdown/Dropdown";
import Button, {ButtonType} from "../../../../components/Button/Button";
import {IconSize} from "@/components/Icon/Icon";
import Form from "../../../../components/Form/Form";
import DateInput from "../../../../components/Form/Inputs/DateInput/DateInput";
import Inline, {JustifyContent} from "../../../../components/Layout/Inline/Inline";
import Spinner from "../../../../components/Spinner/Spinner";
import {SelectListGroup, SelectListItem, SelectListSeparator} from "@/components/Form/Inputs/Dropdown/SelectListItem";
import ToolbarContainer from "../../../../components/ToolbarContainer/ToolbarContainer";
import ToolbarButton from "../../../../components/ToolbarContainer/ToolbarButton/ToolbarButton";
import ToolbarModel from "./ToolbarModel";
import { ConstructionSiteOrWarehouseType } from "@/models/Enums";
import ConstructionSiteOrWarehouse from "../../../../models/server/ConstructionSiteOrWarehouse";
import WorkOrderModel from "../../../../models/server/WorkOrderModel";
import AddMounterModal from "../AddMounterModal/AddMounterModal";
import UserStatus from "../../../../models/server/UserStatus";
import AddMounterHoursRequest from "../../../../models/server/requests/AddMounterHoursRequest";
import ToolbarRow from "../../../../components/ToolbarContainer/ToolbarRow/ToolbarRow";
import Localizer from "../../../../localization/Localizer";

import styles from "./Toolbar.module.scss";

interface IToolbarProps {
    model: ToolbarModel;

    onChange?(model: ToolbarModel, reloadManagersAndMounters: boolean, clear: boolean): Promise<void>;

    fetchMounters(sender: IBaseComponent): Promise<UserStatus[]>;

    fetchConstructionSites(sender: IBaseComponent): Promise<ConstructionSiteOrWarehouse[]>;

    fetchTasks(sender: IBaseComponent, constructionSiteOrWarehouseId: string): Promise<WorkOrderModel[]>;

    addHours(sender: IBaseComponent, request: AddMounterHoursRequest): Promise<void>;
}

interface IToolbarState {
    model: ToolbarModel;
}

export default class Toolbar extends BaseComponent<IToolbarProps, IToolbarState> {

    state: IToolbarState = {
        model: this.props.model
    };

    private async processOnChange(invoke: boolean = false, reloadManagersAndMounters: boolean = false, clear: boolean = false): Promise<void> {
        await this.setState({model: this.state.model});
        if ((invoke) && (this.props.onChange)) {
            reloadManagersAndMounters = reloadManagersAndMounters && this.dailyHours;
            await this.props.onChange(this.state.model, reloadManagersAndMounters, clear);
        }
    }

    private getDataTypeItemList(reportType: string | Date | null): SelectListItem[] {

        const items: SelectListItem[] = [];
        //
        const item: SelectListItem = new SelectListItem();
        item.value = "";
        item.ref = "*";
        item.text = Localizer.workDayPanelToolbarDailyHoursLanguageItemName;
        item.subtext = Localizer.workDayPanelToolbarDailyHoursSubTextLanguageItemName;
        item.selected = (!reportType);
        items.push(item);
        //
        const groupMonths = new SelectListGroup();
        groupMonths.name = Localizer.workDayPanelToolbarMonthsLanguageItemName;
        groupMonths.order = 0;
        const now: Date = Utility.now();
        const month: Date = new Date(now.getFullYear(), now.getMonth(), 1);
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach((index) => {
            const date: Date = Utility.addMonths(month, -index);
            const item = new SelectListItem();
            item.value = date.toDateString();
            item.ref = date;
            item.selected = ((!!reportType) && (date.toString() == reportType.toString()));
            item.text = Utility.format("{0:MM.yyyy}", date);
            item.subtext = Utility.format("{0} {1}", Utility.getMonth(date), date.getFullYear());
            item.group = groupMonths;
            items.push(item);
        });
        return items;
    }

    private async setDataTypeAsync(reportType: string | Date | null): Promise<void> {
        if (reportType === "*") {
            reportType = null;
        }
        this.state.model.reportType = reportType;
        await this.processOnChange(true);
    }

    private async setConstructionSiteTypeAsync(item: SelectListItem): Promise<void> {
        this.state.model.source = (item.value === "0")
            ? ConstructionSiteOrWarehouseType.ConstructionSite
            : (item.value === "1")
                ? ConstructionSiteOrWarehouseType.Warehouse
                : null;
        await this.processOnChange(true, true);
    }

    private async setFromAsync(from: Date | null): Promise<void> {
        if (this.state.model.from !== from) {
            this.state.model.from = from;
            await this.processOnChange();
        }
    }

    private async setToAsync(to: Date | null): Promise<void> {
        if (this.state.model.to !== to) {
            this.state.model.to = to;
            await this.processOnChange();
        }
    }

    private async clearAsync(): Promise<void> {
        this.state.model = new ToolbarModel();
        await this.processOnChange(true, true, true);
    }

    private getConstructionSiteTypeSelectedItem(): SelectListItem {
        const value: string = (this.state.model.source != null)
            ? this.state.model.source.toString()
            : "";
        return new SelectListItem(value);
    }

    private getConstructionSiteTypeItemList(): SelectListItem[] {
        const item0: SelectListItem = new SelectListItem();
        item0.value = "";
        item0.text = Localizer.workDayPanelToolbarAnyLanguageItemName;
        item0.subtext = Localizer.workDayPanelToolbarAnySubTextLanguageItemName;

        const item2: SelectListItem = new SelectListItem();
        item2.value = ConstructionSiteOrWarehouseType.ConstructionSite.toString();
        item2.text = Localizer.constructionSitesSitesInfoLanguageItemName;
        item2.subtext = Localizer.workDayPanelToolbarConstructionSitesInfoSubTextLanguageItemName;

        const item3: SelectListItem = new SelectListItem();
        item3.value = ConstructionSiteOrWarehouseType.Warehouse.toString();
        item3.text = Localizer.dropdownGroupWarehousesLanguageItemName;
        item3.subtext = Localizer.workDayPanelToolbarAssignedWarehousesLanguageItemName;

        return [item0, new SelectListSeparator(), item2, item3];
    }

    private get dailyHours(): boolean {
        return !this.state.model.reportType;
    }

    protected getEndpoint(): string {
        return "api/employees/getLastPeriods";
    }

    public hasSpinner(): boolean {
        return true;
    }

    public isAsync(): boolean {
        return true;
    }

    public render(): React.ReactNode {

        return (
            <ToolbarContainer className={styles.toolbar}>

                <ToolbarRow justify={JustifyContent.SpaceBetween}>

                    <Form inline>

                        <Dropdown inline small required noValidate noSubtext noWrap align={DropdownAlign.Left}
                                  label={Localizer.workDayPanelToolbarReportType}
                                  minWidth="170px"
                                  orderBy={DropdownOrderBy.None}
                                  items={this.getDataTypeItemList(this.state.model.reportType)}
                                  onChange={async (sender, item) => await this.setDataTypeAsync(item as any)}
                        />

                        {
                            (this.dailyHours) &&
                            <Dropdown inline small required noValidate noSubtext noWrap align={DropdownAlign.Left}
                                      label={Localizer.workDayPanelToolbarSource}
                                      minWidth="105px"
                                      orderBy={DropdownOrderBy.None}
                                      items={this.getConstructionSiteTypeItemList()}
                                      selectedItem={this.getConstructionSiteTypeSelectedItem()}
                                      onChange={async (sender, item) => await this.setConstructionSiteTypeAsync(item!)}
                            />
                        }

                        {
                            (this.dailyHours) &&
                            <DateInput id="from" inline small rentaStyle label={Localizer.workDayPanelToolbarDate}
                                       maxDate={new Date()}
                                       value={this.state.model.from || undefined}
                                       onChange={async (date) => await this.setFromAsync(date)}
                            />
                        }

                        {
                            (this.dailyHours) &&
                            <span className={styles.dateDelimiter}>-</span>
                        }

                        {
                            (this.dailyHours) &&
                            <DateInput inline small rentaStyle
                                       maxDate={new Date()}
                                       value={this.state.model.to || undefined}
                                       onChange={async (date) => await this.setToAsync(date)}
                            />
                        }

                        {
                            (this.dailyHours) &&
                            <Button small label={Localizer.workDayPanelToolbarSearch}
                                    icon={{name: "fas search"}}
                                    type={ButtonType.Orange}
                                    onClick={async () => await this.processOnChange(true, true)}
                            />
                        }

                        {
                            (this.dailyHours) &&
                            <Button small title={Localizer.addConstructionsiteToolbarClearFilter}
                                    icon={{name: "far history", size: IconSize.Large}}
                                    type={ButtonType.Info}
                                    onClick={async () => await this.clearAsync()}
                            />
                        }
                    </Form>

                    {
                        (this.dailyHours) &&
                        (
                            <Inline>

                                <ToolbarButton label={Localizer.workDayPanelToolbarAddMounter}
                                               icon={{name: "plus", size: IconSize.Large}}
                                               type={ButtonType.Orange}
                                               dataTarget="addMounterModal" toggleModal
                                />

                            </Inline>
                        )
                    }

                </ToolbarRow>

                {
                    (this.isSpinning()) && <Spinner />
                }

                <AddMounterModal
                    id="addMounterModal"
                    fetchMounters={this.props.fetchMounters}
                    fetchConstructionSites={this.props.fetchConstructionSites}
                    fetchTasks={this.props.fetchTasks}
                    addHours={this.props.addHours}
                />

            </ToolbarContainer>
        );
    }
};