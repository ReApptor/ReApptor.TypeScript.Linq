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
import ConstructionSiteOrWarehouse from "../../../../models/server/ConstructionSiteOrWarehouse";
import WorkOrderModel from "../../../../models/server/WorkOrderModel";
import UserStatus from "../../../../models/server/UserStatus";
import NumberInput from "../../../../components/Form/Inputs/NumberInput/NumberInput";
import AddMounterHoursRequest from "../../../../models/server/requests/AddMounterHoursRequest";
import RentaTaskConstants from "../../../../helpers/RentaTaskConstants";
import TwoColumns from "@/components/Layout/TwoColumn/TwoColumns";
import Localizer from "../../../../localization/Localizer";

interface IAddMounterModalProps  {
    id: string;
    fetchMounters(sender: IBaseComponent): Promise<UserStatus[]>;
    fetchConstructionSites(sender: IBaseComponent): Promise<ConstructionSiteOrWarehouse[]>;
    fetchTasks(sender: IBaseComponent, siteOrWarehouseId: string): Promise<WorkOrderModel[]>;
    addHours(sender: IBaseComponent, request: AddMounterHoursRequest): Promise<void>;
}

interface IAddMounterModalState {
    mounters: UserStatus[] | null,
    sites: ConstructionSiteOrWarehouse[] | null,
    tasks: WorkOrderModel[] | null,
    mounter: UserStatus | null,
    constructionSiteOrWarehouse: ConstructionSiteOrWarehouse | null,
    task: WorkOrderModel | null,
    date: Date,
    normalHours: number,
    overtime50Hours: number,
    overtime100Hours: number,
}

export default class AddMounterModal extends BaseComponent<IAddMounterModalProps, IAddMounterModalState> {

    state: IAddMounterModalState = {
        mounters: null,
        sites: null,
        tasks: null,
        mounter: null,
        constructionSiteOrWarehouse: null,
        task: null,
        date: new Date(),
        normalHours: 0.5,
        overtime50Hours: 0,
        overtime100Hours: 0,
    };

    private readonly _modalRef: React.RefObject<Modal> = React.createRef();
    private readonly _mountersDropdownRef: React.RefObject<Dropdown<UserStatus>> = React.createRef();
    private readonly _tasksDropdownRef: React.RefObject<Dropdown<WorkOrderModel>> = React.createRef();

    private async onChangeDateAsync(date: Date): Promise<void> {
        await this.setState({ date });
    }

    private async onChangeHoursAsync(normalHours: number): Promise<void> {
        await this.setState({ normalHours });
    }

    private async onChangeOvertime50HoursAsync(overtime50Hours: number): Promise<void> {
        await this.setState({ overtime50Hours });
    }

    private async onChangeOvertime100HoursAsync(overtime100Hours: number): Promise<void> {
        await this.setState({ overtime100Hours });
    }

    private async onChangeMounterAsync(mounter: UserStatus): Promise<void> {
        await this.setState({ mounter });
    }
    
    private async onChangeConstructionSiteAsync(siteOrWarehouse: ConstructionSiteOrWarehouse): Promise<void> {
        const siteOrWarehouseId: string = siteOrWarehouse.id;
        const tasks: WorkOrderModel[] = await this.props.fetchTasks(this, siteOrWarehouseId);
        await this.setState({ constructionSiteOrWarehouse: siteOrWarehouse, tasks, task: null });
    }

    private async onChangeTaskAsync(task: WorkOrderModel | null): Promise<void> {
        await this.setState({ task });
    }
    
    private async onSubmitAsync(): Promise<void> {

        const request = new AddMounterHoursRequest();
        request.day = Utility.getDateWithoutTime(this.state.date);
        request.workOrderId = this.state.task!.id;
        request.userId = this.state.mounter!.user!.id;
        request.normalHours = this.state.normalHours;
        request.overtime50Hours = this.state.overtime50Hours;
        request.overtime100Hours = this.state.overtime100Hours;

        await this.props.addHours(this, request);

        await this._modalRef.current!.closeAsync();
    }
    
    private async onCloseAsync(): Promise<void> {
        await this.clearStateAsync();
    }
    
    private async clearStateAsync(): Promise<void> {
        this.state.constructionSiteOrWarehouse = null;
        this.state.date = new Date();
        this.state.normalHours = 0.5;
        this.state.overtime50Hours = 0;
        this.state.overtime100Hours = 0;
        
        await this.setState(this.state);

        await this._mountersDropdownRef.current!.selectFirstAsync();
        await this._tasksDropdownRef.current!.selectFirstAsync();
    }
    
    private get hasSites(): boolean {
        return !!this.state.sites;
    }

    private get hasTasks(): boolean {
        return !!this.state.tasks;
    }
    
    public hasSpinner(): boolean {
        return true;
    }

    public async setSpinnerAsync(isSpinning: boolean): Promise<void> {
        if (this._modalRef.current) {
            await this._modalRef.current.setSpinnerAsync(isSpinning);
        }
    }

    public async componentDidMount(): Promise<void> {
        if (!this.hasSites) {
            const mounters: UserStatus[] = await this.props.fetchMounters(this);
            const sites: ConstructionSiteOrWarehouse[] = await this.props.fetchConstructionSites(this);
            await this.setState({ mounters, sites });
        }
    }

    public render(): React.ReactNode {

        return (
            <Modal id={this.props.id} ref={this._modalRef}
                   title={Localizer.addMounterModalAddHours}
                   subtitle={Localizer.addMounterModalAddHoursInfo}
                   onClose={async () => await this.onCloseAsync()}>
                <div className="row">
                    <div className="col">

                        <Form id="userDocument" onSubmit={async () => await this.onSubmitAsync()}>

                            <OneColumn>

                                <Dropdown id="mounters" required noSubtext
                                          ref={this._mountersDropdownRef}
                                          disabled={!this.hasSites}
                                          label={Localizer.taskHoursPanelMounter}
                                          items={this.state.mounters || []}
                                          selectedItem={this.state.mounter || undefined}
                                          onChange={async (sender, item) => await this.onChangeMounterAsync(item!)}
                                />

                                <Dropdown id="constructionSiteOrWarehouse" required noSubtext //favorite
                                          label={Localizer.topNavConstructionSites}
                                          disabled={!this.hasSites}
                                          items={this.state.sites || []}
                                          selectedItem={this.state.constructionSiteOrWarehouse || undefined}
                                          onChange={async (sender, item) => await this.onChangeConstructionSiteAsync(item!)}
                                />

                                <Dropdown id="task" required noSubtext
                                          ref={this._tasksDropdownRef}
                                          disabled={!this.hasTasks}
                                          nothingSelectedText={Localizer.addMounterModalNoTasksAvailable}
                                          label={Localizer.addMounterModalTask}
                                          items={this.state.tasks || []}
                                          selectedItem={this.state.task || undefined}
                                          onChange={async (sender, item) => await this.onChangeTaskAsync(item)}
                                />

                            </OneColumn>

                            <TwoColumns>

                                <DateInput id="date" label={Localizer.tasksPanelDate}
                                           value={this.state.date}
                                           maxDate={Utility.now()}
                                           minDate={Utility.addMonths(Utility.now(), -1)}
                                           onChange={async (value) => await this.onChangeDateAsync(value)}
                                />

                                <NumberInput id="normalHours" required
                                             label={Localizer.addMounterModalWorkingHours}
                                             format="0.0" step={0.5}
                                             min={0.5} max={RentaTaskConstants.maxHoursPerDay}
                                             value={this.state.normalHours}
                                             onChange={async (sender, value) => await this.onChangeHoursAsync(value)}
                                />

                            </TwoColumns>

                            <TwoColumns>

                                <NumberInput id="overtime50Hours" required
                                             label={Localizer.addMounterModalLabelsOvertime50Hours}
                                             format="0.0" step={0.5}
                                             min={0} max={RentaTaskConstants.maxHoursPerDay}
                                             value={this.state.overtime50Hours}
                                             onChange={async (sender, value) => await this.onChangeOvertime50HoursAsync(value)}
                                />

                                <NumberInput id="overtime100Hours" required
                                             label={Localizer.addMounterModalLabelsOvertime100Hours}
                                             format="0.0" step={0.5}
                                             min={0} max={RentaTaskConstants.maxHoursPerDay}
                                             value={this.state.overtime100Hours}
                                             onChange={async (sender, value) => await this.onChangeOvertime100HoursAsync(value)}
                                />

                            </TwoColumns>

                            <ButtonContainer>
                                <Button submit type={ButtonType.Orange} label={Localizer.addMounterModalAddHours}/>
                            </ButtonContainer>

                        </Form>

                    </div>
                </div>
            </Modal>
        );
    }
};