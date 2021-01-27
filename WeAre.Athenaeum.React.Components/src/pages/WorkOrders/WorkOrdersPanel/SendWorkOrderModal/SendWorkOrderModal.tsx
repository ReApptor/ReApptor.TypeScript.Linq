import React from "react";
import {BaseComponent, IBaseComponent} from "@weare/athenaeum-react-common";
import Form from "../../../../components/Form/Form";
import ButtonContainer from "../../../../components/ButtonContainer/ButtonContainer";
import Button, {ButtonType} from "../../../../components/Button/Button";
import Modal from "../../../../components/Modal/Modal";
import TextInput from "../../../../components/Form/Inputs/TextInput/TextInput";
import Dropdown from "../../../../components/Form/Inputs/Dropdown/Dropdown";
import User from "../../../../models/server/User";
import ApproveWorkOrderByEmailRequest from "../../../../models/server/requests/ApproveWorkOrderByEmailRequest";
import Checkbox from "../../../../components/Form/Inputs/Checkbox/Checkbox";
import TwoColumns from "../../../../components/Layout/TwoColumn/TwoColumns";
import WorkOrderModel from "@/models/server/WorkOrderModel";
import {IStringInputModel} from "@/components/Form/Inputs/BaseInput";
import PhoneInput from "@/components/Form/Inputs/PhoneInput/PhoneInput";
import {AuthType} from "@/models/Enums";
import RentaTaskConstants from "@/helpers/RentaTaskConstants";
import EmailInput from "@/components/Form/Inputs/EmailInput/EmailInput";
import OneColumn from "@/components/Layout/OneColumn/OneColumn";
import CreateAndAssignContactPersonRequest from "@/models/server/requests/CreateAndAssignContactPersonRequest";
import ApproveWorkOrderByEmailResponse from "@/models/server/responses/ApproveWorkOrderByEmailResponse";
import CreateAndAssignContactPersonResponse from "@/models/server/responses/CreateAndAssignContactPersonResponse";
import {Utility} from "@weare/athenaeum-toolkit";
import TransformProvider from "@/providers/TransformProvider";
import Localizer from "../../../../localization/Localizer";

import styles from "./SendWorkOrderModal.module.scss";

export enum SendWorkOrderAction {
    Send = 0,
    
    Approve = 1,
    
    Save = 2
}

export enum SendWorkOrderUserType {
    Approver = 0,
    
    Orderer = 1
}

interface ISendWorkOrderData {
    workOrder: WorkOrderModel;
    
    action: SendWorkOrderAction;
    
    userType: SendWorkOrderUserType;
}

interface ISendWorkOrderModalProps {
    onClose(sender: IBaseComponent, workOrder: WorkOrderModel, action: SendWorkOrderAction, successfully: boolean): Promise<void>;
}

interface ISendWorkOrderModalState {
    contactPersons: User[];
    contactPerson: User | null;
    newContactPerson: boolean;
    initialized: boolean;
}

export default class SendWorkOrderModal extends BaseComponent<ISendWorkOrderModalProps, ISendWorkOrderModalState> {
    state: ISendWorkOrderModalState = {
        contactPersons: [],
        contactPerson: null,
        newContactPerson: false,
        initialized: false
    };

    private readonly _modalRef: React.RefObject<Modal<ISendWorkOrderData>> = React.createRef();
    private readonly _formRef: React.RefObject<Form> = React.createRef();
    private _resolver: ((successfully: boolean) => void) | null = null;
    private _successfully: boolean = false;
    private email: IStringInputModel = {value: ""};
    private firstname: IStringInputModel = {value: ""};
    private lastName: IStringInputModel = {value: ""};
    private middleName: IStringInputModel = {value: ""};
    private phone: IStringInputModel = {value: ""};

    private get newContactPerson(): boolean {
        return this.state.newContactPerson;
    }
    
    private transformData(data: any): ISendWorkOrderData {
        return ((data instanceof WorkOrderModel) || ((data as WorkOrderModel).isWorkOrderModel))
            ? { workOrder: data as WorkOrderModel, userType: SendWorkOrderUserType.Approver, action: SendWorkOrderAction.Approve }
            : data as ISendWorkOrderData;
    }

    private async setContactPersonAsync(user: User): Promise<void> {
        await this.initializeContractPersonFields(user);
        await this.setState({contactPerson: user});
    }

    private initializeContractPersonFields(user: User | null): void {
        this.email.value = (user) ? user.email : "";
        this.firstname.value = (user) ? user.firstname : "";
        this.lastName.value = (user) ? user.lastName : "";
        this.middleName.value = (user) ? user.middleName : "";
        this.phone.value = (user) ? user.phone : "";
    }

    private async setNewOrModifyContactPersonAsync(value: boolean): Promise<void> {
        const user: User | null = (value) ? new User() : this.selectedContactPerson;
        await this.initializeContractPersonFields(user);
        await this.setState({newContactPerson: value});
    }

    private async onOpenAsync(): Promise<void> {
        this._successfully = false;
        
        const contactPersons: User[] = await this.modal.postAsync("api/workOrders/getContactPersons", this.ownerId);
        
        const workOrderContactPerson: User | null = (this.userType == SendWorkOrderUserType.Approver)
            ? this.workOrder.customerApprover
            : this.workOrder.customerOrderer;
        
        const contactPerson: User | null = (workOrderContactPerson)
                ? contactPersons.find(item => item.id == workOrderContactPerson.id) || null
                : null;

        const newContactPerson: boolean = ((!contactPerson) && (contactPersons.length === 0));
        
        await this.initializeContractPersonFields(contactPerson);
        
        await this.setState({contactPersons, contactPerson, newContactPerson, initialized: true});
    }

    private async onCloseAsync(): Promise<void> {
        
        if (this._resolver) {
            this._resolver(this._successfully);
            this._resolver = null;
        }

        await this.props.onClose(this, this.workOrder, this.action, this._successfully);
        
        await this.setState({ contactPersons: [], contactPerson: null, newContactPerson: true, initialized: false });
    }

    private async onSubmitAsync(approved: boolean): Promise<void> {
        if (this.isEditable) {
            const isValid: boolean = await this._formRef.current!.validateAsync();
            if (!isValid) {
                return;
            }
        }

        let workOrder: WorkOrderModel | null = null;
        let user: User | null;
        let success: boolean;
        let userFullName: string;

        if (this.action == SendWorkOrderAction.Save) {

            if (this.isEditable) {
                const request = new CreateAndAssignContactPersonRequest();

                request.constructionSiteId = this.ownerId;
                request.authType = (this.selectedContactPerson) ? this.selectedContactPerson.authType : AuthType.Email;
                request.email = this.email.value;
                request.phone = this.phone.value;
                request.firstname = this.firstname.value;
                request.lastName = this.lastName.value;
                request.middleName = this.middleName.value
                request.externalId = (this.selectedContactPerson) ? this.selectedContactPerson.externalId : "";

                const response: CreateAndAssignContactPersonResponse = await this.modal.postAsync("api/workOrders/createAndAssignContactPerson", request);

                success = response.successfully;
                user = response.user;

                userFullName = "{0} {1}".format(request.firstname, request.lastName);
            } else {
                success = true;
                user = this.selectedContactPerson;
                userFullName = TransformProvider.toString(user);
            }
            
        } else {
            this.data.action = (approved) ? SendWorkOrderAction.Approve : SendWorkOrderAction.Send;

            const request = new ApproveWorkOrderByEmailRequest();

            if (this.newContactPerson) {
                request.customerApprover = new User();
                request.customerApprover.id = RentaTaskConstants.defaultGuid;
                request.customerApprover.role.organizationContractId = RentaTaskConstants.defaultGuid;
            } else {
                request.customerApprover = this.state.contactPerson!;
            }

            request.workOrderId = this.workOrderId;
            request.approved = approved;
            request.customerApprover.email = this.email.value;
            request.customerApprover.firstname = this.firstname.value;
            request.customerApprover.lastName = this.lastName.value;
            request.customerApprover.middleName = this.middleName.value;
            request.customerApprover.phone = this.phone.value;

            const response: ApproveWorkOrderByEmailResponse = await this.modal.postAsync("api/workOrders/approveWorkOrderByEmail", request);

            success = response.successfully;
            workOrder = response.workOrder;
            user = (response.workOrder) ? response.workOrder.customerApprover : null;

            userFullName = TransformProvider.toString(user);
        }

        if (success) {
            if (user) {
                if (this.action == SendWorkOrderAction.Save) {
                    if (this.userType == SendWorkOrderUserType.Approver) {
                        this.workOrder.customerApprover = user;
                        this.workOrder.customerApproverId = user.id;
                    } else {
                        this.workOrder.customerOrderer = user;
                        this.workOrder.customerOrdererId = user.id;
                    }
                }

                if (this.selectedContactPerson) {
                    Utility.copyTo(user, this.selectedContactPerson);

                    if (workOrder) {
                        Utility.copyTo(workOrder, this.workOrder);
                    }
                }
            }

            this._successfully = true;
            await this.modal.closeAsync();
        } else {
            const form: Form | null = this._formRef.current;
            if (form != null) {
                const validationError: string = Localizer.workOrdersValidationErrorApproverCreationRejected.format(userFullName);
                await form.setValidationErrorsAsync(validationError);
            }
        }
    }

    private get modal(): Modal<ISendWorkOrderData> {
        return this._modalRef.current!;
    }

    private get emailReadonly(): boolean {
        return ((this.selectedContactPerson != null) && (this.selectedContactPerson.authType == AuthType.Email));
    }

    private get phoneReadonly(): boolean {
        return ((this.selectedContactPerson != null) && (this.selectedContactPerson.authType == AuthType.Phone));
    }

    private get hasData(): boolean {
        return ((this._modalRef.current != null) && (this.modal.data != null));
    }

    private get data(): ISendWorkOrderData {
        return this.modal.data!;
    }

    private get workOrder(): WorkOrderModel {
        return this.data.workOrder;
    }

    private get ownerId(): string {
        const workOrder: WorkOrderModel = this.workOrder;
        return workOrder.owner
                ? workOrder.owner.id
                : workOrder.constructionSiteId || workOrder.warehouseId!;
    }

    private get action(): SendWorkOrderAction {
        return this.data.action;
    }

    private get userType(): SendWorkOrderUserType {
        return this.data.userType;
    }

    private get workOrderId(): string {
        return this.workOrder.id;
    }

    private get contactPersons(): User[] {
        return this.newContactPerson ? [] : this.state.contactPersons;
    }

    private get hasContactPersons(): boolean {
        return (this.state.contactPersons.length > 0);
    }

    private get selectedContactPerson(): User | null {
        return (!this.newContactPerson) ? this.state.contactPerson : null;
    }

    private get enabled(): boolean {
        return (this.hasContactPersons) || (this.newContactPerson);
    }

    private get initialized(): boolean {
        return this.state.initialized;
    }

    private get title(): string {
        return (this.hasData)
            ? (this.action == SendWorkOrderAction.Save)
                ? (this.userType == SendWorkOrderUserType.Approver)
                    ? Localizer.sendWorkOrderModalApproverTitle
                    : Localizer.sendWorkOrderModalOrdererTitle
                : Localizer.sendWorkReportTitle
            : "...";
    }

    private get subtitle(): string {
        return (this.hasData)
            ? (this.action == SendWorkOrderAction.Save)
                ? (this.userType == SendWorkOrderUserType.Approver)
                    ? Localizer.sendWorkOrderModalApproverSubtitle
                    : Localizer.sendWorkOrderModalOrdererSubtitle
                : Localizer.sendWorkReportSubtitle
            : "...";
    }

    public get successfully(): boolean {
        return this._successfully;
    }

    public get isEditable(): boolean {
        return (
            (this.initialized) &&
            ((this.newContactPerson) || ((this.selectedContactPerson != null) && (!WorkOrderModel.isApproverOrOrdererValid(this.selectedContactPerson))))
        );
    }

    public async closeAsync(): Promise<void> {
        await this.modal.closeAsync();
    }

    public async openAsync(workOrder: WorkOrderModel, userType: SendWorkOrderUserType, action: SendWorkOrderAction = SendWorkOrderAction.Save): Promise<void> {
        const data: ISendWorkOrderData = { workOrder, userType, action };
        await this.modal.openAsync(data);
    }

    public async showAsync(workOrder: WorkOrderModel, userType: SendWorkOrderUserType, action: SendWorkOrderAction = SendWorkOrderAction.Save): Promise<boolean> {
        await this.openAsync(workOrder, userType, action);

        return new Promise((resolve) => {
            this._resolver = resolve;
        });
    }

    public static get modalId(): string {
        return "sendWorkReportModal";
    }

    public render(): React.ReactNode {
        return (
            <Modal id={SendWorkOrderModal.modalId} ref={this._modalRef}
                   title={this.title}
                   subtitle={this.subtitle}
                   transform={this.transformData}
                   onOpen={async () => await this.onOpenAsync()}
                   onClose={async () => await this.onCloseAsync()}
            >
                
                {
                    (this.hasData) &&
                    (
                        <div className="row">
                            <div className="col">

                                <Form ref={this._formRef} id="sendWorkReport">
                                    <TwoColumns>
                                        <Dropdown required noSubtext
                                                  label={Localizer.sendWorkReportDropdownLabel}
                                                  disabled={this.newContactPerson}
                                                  items={this.contactPersons}
                                                  selectedItem={this.selectedContactPerson || undefined}
                                                  onChange={(_, value) => this.setContactPersonAsync(value!)}
                                        />

                                        <Checkbox id="new"
                                                  label={Localizer.sendWorkReportNewContactPerson}
                                                  className={styles.checkbox}
                                                  value={this.newContactPerson}
                                                  readonly={!this.hasContactPersons}
                                                  onChange={async (_, value) => await this.setNewOrModifyContactPersonAsync(value)}/>
                                    </TwoColumns>

                                    <OneColumn className={this.css(styles.newContactPerson, (this.isEditable) && styles.open)}>

                                        <TwoColumns>

                                            <EmailInput id="email" required
                                                        label={Localizer.formInputEmail}
                                                        model={this.email}
                                                        readonly={this.emailReadonly}
                                            />

                                            <PhoneInput id="phone" required
                                                        label={Localizer.formInputPhone}
                                                        model={this.phone}
                                                        readonly={this.phoneReadonly}
                                            />

                                        </TwoColumns>

                                        <TwoColumns>

                                            <TextInput id="firstname" required
                                                       label={Localizer.formInputFirstname}
                                                       model={this.firstname}
                                            />

                                            <TextInput id="lastName" required
                                                       label={Localizer.formInputLastname}
                                                       model={this.lastName}
                                            />

                                        </TwoColumns>

                                        <TwoColumns>

                                            <TextInput id="middleName"
                                                       label={Localizer.formInputMiddlename}
                                                       model={this.middleName}
                                            />

                                        </TwoColumns>

                                    </OneColumn>

                                    <ButtonContainer>
                                        {
                                            (this.action == SendWorkOrderAction.Save)
                                                ?
                                                (
                                                    <Button className={this.css(styles.modifyButtonsMode)}
                                                            type={ButtonType.Orange}
                                                            label={Localizer.sendWorkOrderModalButtonAssign}
                                                            title={Localizer.sendWorkOrderModalButtonTooltipAssign}
                                                            onClick={async () => await this.onSubmitAsync(false)}
                                                    />
                                                )
                                                :
                                                (
                                                    <Button type={ButtonType.Orange} label={Localizer.sendWorkOrderModalButtonSendOrApprove} disabled={!this.enabled}>
                                                        <Button.Action title={Localizer.sendWorkReportTitle} onClick={async () => await this.onSubmitAsync(false)}/>
                                                        <Button.Action title={Localizer.approveWorkReportTitle} onClick={async () => await this.onSubmitAsync(true)}/>
                                                    </Button>
                                                )
                                        }
                                    </ButtonContainer>

                                </Form>

                            </div>
                        </div>
                    )
                }

            </Modal>
        )
    }
}