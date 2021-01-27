import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseComponent, IBaseComponent} from "@weare/athenaeum-react-common";
import Button, { ButtonType } from "../../../../components/Button/Button";
import Modal from "../../../../components/Modal/Modal";
import DateInput from "../../../../components/Form/Inputs/DateInput/DateInput";
import Dropdown from "../../../../components/Form/Inputs/Dropdown/Dropdown";
import ButtonContainer from "../../../../components/ButtonContainer/ButtonContainer";
import OneColumn from "../../../../components/Layout/OneColumn/OneColumn";
import Form from "../../../../components/Form/Form";
import TextInput from "../../../../components/Form/Inputs/TextInput/TextInput";
import TextAreaInput from "../../../../components/Form/Inputs/TextAreaInput/TextAreaInput";
import CreateWorkOrderRequest from "../../../../models/server/requests/CreateWorkOrderRequest";
import TaskMounter from "../../../../models/server/TaskMounter";
import WorkOrderModel from "../../../../models/server/WorkOrderModel";
import {CellModel} from "@/components/Grid/GridModel";
import Localizer from "../../../../localization/Localizer";

import styles from "./WarehouseAddTaskModal.module.scss";

interface IWarehouseAddTaskModalProps  {
    warehouseId: string;
    fetchMounters(sender: IBaseComponent): Promise<TaskMounter[]>;
    addWorkOrder(sender: IBaseComponent, request: CreateWorkOrderRequest): Promise<void>;
    taskOperation?(cell: CellModel<WorkOrderModel>, actionName: string): Promise<void>;
}

interface IWarehouseAddTaskModalState {
    id: string | null,
    mounters: TaskMounter[] | null,
    activationDate: Date,
    name: string,
    description: string,
    assignedMounters: string[]
    cell: CellModel<WorkOrderModel> | null,
}

export default class WarehouseAddTaskModal extends BaseComponent<IWarehouseAddTaskModalProps, IWarehouseAddTaskModalState> {

    state: IWarehouseAddTaskModalState = {
        id: null,
        mounters: null,
        activationDate: new Date(),
        name: "",
        description: "",
        assignedMounters: [],
        cell: null,
    };

    private readonly _modalRef: React.RefObject<Modal> = React.createRef();

    private async onChangeDateAsync(activationDate: Date): Promise<void> {
        await this.setState({ activationDate });
    }

    private async onChangeNameAsync(name: string): Promise<void> {
        await this.setState({ name });
    }

    private async onChangeDescriptionAsync(description: string): Promise<void> {
        await this.setState({ description });
    }

    private async onChangeMountersAsync(sender: Dropdown<TaskMounter>): Promise<void> {
        const assignedMounters: string[] = sender.selectedItems.map(m => m.user.id);
        await this.setState({assignedMounters});
    }
    
    private async onSubmitAsync(): Promise<void> {
        await this._modalRef.current!.closeAsync();
        if (!this.state.id) {
            const request = new CreateWorkOrderRequest();
            request.constructionSiteOrWarehouseId = this.warehouseId;
            request.name = this.state.name;
            request.description = this.state.description;
            request.activationDate = this.state.activationDate;
            request.equipment = [];
            request.mounters = this.state.assignedMounters;

            await this.props.addWorkOrder(this, request);
        } else {
            if (this.state.cell && this.props.taskOperation) {
                const taskModel = this.state.cell.model;

                taskModel.name = this.state.name;
                //Change cell description instead of taskModel.description to notify grid component
                this.state.cell.description = this.state.description;
                taskModel.mounters = this.state.assignedMounters;

                await this.props.taskOperation(this.state.cell, "save");
            }
        }
    }
    
    private get hasMounters(): boolean {
        return !!this.state.mounters;
    }
    
    private get warehouseId(): string {
        return this.props.warehouseId;
    }

    private async onOpenAsync(sender: Modal): Promise<void> {
        const mounters: TaskMounter[] = await this.props.fetchMounters(sender);
        await this.setState({ mounters });
    }
    
    private deleteHandler = async () => {
        if (this.state.cell && this.props.taskOperation) {
            await this._modalRef.current!.closeAsync();
            await this.props.taskOperation(this.state.cell, "delete");
        }
    };

    public async openAsync(task: WorkOrderModel | null, cell: CellModel<WorkOrderModel> | null = null): Promise<void> {
        if (task) {
            await this.setState({
                id: task.id,
                name: task.name,
                activationDate: task.activationDate,
                description: task.description || '',
                assignedMounters: task.mounters,
                cell: cell,
            });
        } else {
            await this.setState({
                id: null,
                activationDate: new Date(),
                name: "",
                description: "",
                assignedMounters: [],
                cell: null,
            })
        }

        await this._modalRef.current!.openAsync();
    }
    
    public hasSpinner(): boolean {
        return true;
    }
    
    public static get modalId(): string {
        return "addTaskModal";
    }

    public render(): React.ReactNode {

        return (
            <Modal id={WarehouseAddTaskModal.modalId} ref={this._modalRef}
                   className={styles.addTaskModal}
                   title={this.state.id ? Localizer.addTaskModalChangeTask : Localizer.addTaskModalAddTask}
                   subtitle={!this.state.id ? Localizer.addTaskModalAddTaskSubtitle: ""}
                   onOpen={async (sender) => await this.onOpenAsync(sender)}>
                
                <div className="row">
                    <div className="col">

                        <Form id="task" onSubmit={async () => await this.onSubmitAsync()}>
                            
                            <OneColumn>

                                <DateInput id="activationDate"
                                           label={Localizer.tasksPanelDate}
                                           value={this.state.activationDate}
                                           minDate={Utility.addMonths(Utility.now(), -1)}
                                           maxDate={Utility.addMonths(Utility.now(), 1)}
                                           onChange={async (value) => await this.onChangeDateAsync(value)}
                                />

                                <TextInput id="name" required
                                           label={Localizer.tasksPanelName}
                                           value={this.state.name}
                                           onChange={async (sender, value) => await this.onChangeNameAsync(value)}
                                />

                                <TextAreaInput id="description" label={Localizer.addTaskModalDescription}
                                               value={this.state.description}
                                               onChange={async (sender, value) => await this.onChangeDescriptionAsync(value)}
                                />

                                <Dropdown id="mounters" multiple autoCollapse groupSelected
                                          label={Localizer.addTaskModalMounters}
                                          disabled={!this.hasMounters}
                                          items={this.state.mounters || []}
                                          selectedItems={this.state.assignedMounters}
                                          onChange={async (sender) => await this.onChangeMountersAsync(sender)}
                                />

                            </OneColumn>

                            <ButtonContainer>
                                <React.Fragment>
                                    
                                    {
                                        (!!this.state.id) &&
                                        (
                                            <Button
                                                className={styles.deleteButton}
                                                label={Localizer.addTaskModalDelete}
                                                type={ButtonType.Blue}
                                                confirm={Localizer.addTaskModalDeleteConfirm}
                                                onClick={this.deleteHandler}
                                            />
                                        )
                                    }
                                    
                                    <Button
                                        submit
                                        label={this.state.id ? Localizer.addTaskModalSaveTask : Localizer.addTaskModalAddTask}
                                        icon={{name: this.state.id ? "fa-save": "fa-plus"}}
                                        type={ButtonType.Orange}
                                    />
                                    
                                </React.Fragment>
                            </ButtonContainer>

                        </Form>

                    </div>
                </div>
                
            </Modal>
        );
    }
};