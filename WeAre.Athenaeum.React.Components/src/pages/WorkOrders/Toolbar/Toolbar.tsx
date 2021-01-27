import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import WorkOrderModel from "../../../models/server/WorkOrderModel";
import ToolbarModel from "./ToolbarModel";
import ToolbarContainer from "../../../components/ToolbarContainer/ToolbarContainer";
import Form from "../../../components/Form/Form";
import Button, {ButtonType} from "../../../components/Button/Button";
import DateInput from "../../../components/Form/Inputs/DateInput/DateInput";
import {IconSize} from "@/components/Icon/Icon";
import Dropdown, {DropdownAlign, DropdownOrderBy} from "@/components/Form/Inputs/Dropdown/Dropdown";
import {SelectListItem} from "@/components/Form/Inputs/Dropdown/SelectListItem";
import {TaskStatusFilter} from "@/models/Enums";
import Checkbox from "@/components/Form/Inputs/Checkbox/Checkbox";
import Inline, {JustifyContent} from "@/components/Layout/Inline/Inline";
import ToolbarRow from "@/components/ToolbarContainer/ToolbarRow/ToolbarRow";
import ToolbarButton from "@/components/ToolbarContainer/ToolbarButton/ToolbarButton";
import Localizer from "@/localization/Localizer";

import styles from "./Toolbar.module.scss";
import EnumProvider from "@/providers/EnumProvider";

interface IToolbarProps {
    model: ToolbarModel;
    readonly?: boolean;

    addWorkOrder(model: WorkOrderModel): Promise<void>;

    onChange?(model: ToolbarModel, reloadManagers: boolean, reloadMounters: boolean): Promise<void>;
}

interface IToolbarState {
    model: ToolbarModel;
}

export default class Toolbar extends BaseComponent<IToolbarProps> {

    state: IToolbarState = {
        model: this.props.model
    };

    private async processOnChange(invoke: boolean = false, reloadManagers: boolean = false, reloadMounters: boolean = false): Promise<void> {
        await this.setState({model: this.state.model});
        if ((invoke) && (this.props.onChange)) {
            await this.props.onChange(this.state.model, reloadManagers, reloadMounters);
        }
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


    private async selectTaskStatusesAsync(items: SelectListItem[], userInteraction: boolean): Promise<void> {

        this.state.model.taskStatusesFilter = (items != null && items.length > 0)
            ? items.map(item => parseInt(item.value))
            : [];

        if (userInteraction) {
            await this.processOnChange(true);
        }

    }


    private async setNotAssignedAsync(value: boolean): Promise<void> {
        this.state.model.notAssigned = value;
        await this.processOnChange(true);
    }

    private getTaskStatusFilterSelectedItems(): SelectListItem[] {
        return (this.state.model.taskStatusesFilter != null && this.state.model.taskStatusesFilter.length > 0)
            ? this.state.model.taskStatusesFilter.map(item => EnumProvider.getTaskStatusFilterItem(item))
            : [];
    }

    private getTaskStatusFilterItemList(): TaskStatusFilter[] {

        return [
            TaskStatusFilter.Unscheduled,
            TaskStatusFilter.InProgress,
            TaskStatusFilter.Upcoming,
            TaskStatusFilter.Completed,
            TaskStatusFilter.SentToCustomer,
            TaskStatusFilter.ApprovedByCustomer,
            TaskStatusFilter.ReadyForInvoicing
        ];

    }

    private async clearAsync(): Promise<void> {
        this.state.model = new ToolbarModel();
        await this.processOnChange(true, true, true);
    }

    private async addWorkOrderAsync() {
        const workOrderModel = new WorkOrderModel();
        await this.props.addWorkOrder(workOrderModel);
    }

    private get readonly(): boolean {
        return !!this.props.readonly;
    }

    public hasSpinner(): boolean {
        return true;
    }

    public isAsync(): boolean {
        return false;
    }

    public render(): React.ReactNode {

        return (
            <ToolbarContainer className={styles.toolbar}>
                <ToolbarRow justify={JustifyContent.SpaceBetween}>

                    <Form inline>

                        <Dropdown multiple inline small required noValidate noSubtext noWrap align={DropdownAlign.Left} noFilter
                                  label={Localizer.tasksPageTaskStatus}
                                  minWidth="180px"
                                  orderBy={DropdownOrderBy.None}
                                  items={EnumProvider.getTaskStatusFilterItems()}
                                  selectedItems={this.getTaskStatusFilterSelectedItems()}
                                  disabled={this.readonly}
                                  onChange={(sender, item, userInteraction) => this.selectTaskStatusesAsync(sender.selectedItems, userInteraction)}

                        />

                        <Checkbox inline
                                  label={Localizer.tasksPageNotAssigned}
                                  value={this.state.model.notAssigned}
                                  onChange={async (sender, value) => await this.setNotAssignedAsync(value)}
                                  readonly={this.readonly}
                        />

                        <DateInput id="from" inline small rentaStyle label={Localizer.tasksToolbarDate}
                                   maxDate={new Date()}
                                   value={this.state.model.from || undefined}
                                   onChange={async (date) => await this.setFromAsync(date)}
                                   readonly={this.readonly}
                        />

                        <span className={styles.dateDelimiter}>-</span>

                        <DateInput inline small rentaStyle
                                   maxDate={new Date()}
                                   value={this.state.model.to || undefined}
                                   onChange={async (date) => await this.setToAsync(date)}
                                   readonly={this.readonly}
                        />

                        <Button small label={Localizer.tasksToolbarSearch}
                                icon={{name: "fas search"}}
                                type={ButtonType.Orange}
                                onClick={async () => await this.processOnChange(true, true, true)}
                                disabled={this.readonly}
                        />

                        <Button small title={Localizer.tasksToolbarClearFilters}
                                icon={{name: "far history", size: IconSize.Large}}
                                type={ButtonType.Info}
                                onClick={async () => await this.clearAsync()}
                                disabled={this.readonly}
                        />

                    </Form>

                    <Inline>
                        <ToolbarButton icon={{name: "plus", size: IconSize.Large}}
                                       label={Localizer.workOrdersPanelNewWorkOrder}
                                       type={ButtonType.Orange}
                                       onClick={async () => await this.addWorkOrderAsync()}
                                       disabled={this.readonly}
                        />
                    </Inline>

                </ToolbarRow>
            </ToolbarContainer>
        );
    }


};