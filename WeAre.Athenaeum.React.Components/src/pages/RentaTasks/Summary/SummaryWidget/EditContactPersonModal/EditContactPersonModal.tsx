import React from "react";
import {BaseComponent, IBaseComponent} from "@weare/athenaeum-react-common";
import {IStringInputModel} from "@/components/Form/Inputs/BaseInput";
import Modal from "@/components/Modal/Modal";
import Form from "@/components/Form/Form";
import TextInput from "@/components/Form/Inputs/TextInput/TextInput";
import EmailInput from "@/components/Form/Inputs/EmailInput/EmailInput";
import Button, {ButtonType} from "@/components/Button/Button";
import CreateAndAssignContactPersonRequest from "@/models/server/requests/CreateAndAssignContactPersonRequest";
import PhoneInput from "@/components/Form/Inputs/PhoneInput/PhoneInput";
import Localizer from "@/localization/Localizer";

import styles from "./EditContactPersonModal.module.scss";
import WorkOrderModel from "@/models/server/WorkOrderModel";
import User from "@/models/server/User";
import {AuthType} from "@/models/Enums";

interface IEditContactPersonModalProps {
    constructionSiteName: string;
    editContactPerson(sender: IBaseComponent, request: CreateAndAssignContactPersonRequest): Promise<boolean>;
    workOrder: WorkOrderModel;
}

interface IEditContactPersonModalState {
    contactPersons: User[];
    contactPerson: User | null;
    newContactPerson: boolean;
    initialized: boolean;
}

interface IEditContactPersonModalData {
    workOrder: WorkOrderModel;
}

export default class EditContactPersonModal extends BaseComponent<IEditContactPersonModalProps, IEditContactPersonModalState> {
    state: IEditContactPersonModalState = {
        contactPersons: [],
        contactPerson: null,
        newContactPerson: false,
        initialized: false
    }
    
    private _successfully: boolean = false;
    private email: IStringInputModel = {value: ""};
    private firstname: IStringInputModel = {value: ""};
    private lastName: IStringInputModel = {value: ""};
    private middleName: IStringInputModel = {value: ""};
    private phone: IStringInputModel = {value: ""};

    private readonly _modalRef: React.RefObject<Modal<IEditContactPersonModalData>> = React.createRef();
    private readonly _formRef: React.RefObject<Form> = React.createRef();

    private transformData(data: any): IEditContactPersonModalData {
        return ((data instanceof WorkOrderModel) || ((data as WorkOrderModel).isWorkOrderModel))
        ? { workOrder: data as WorkOrderModel}
        : data as IEditContactPersonModalData;
    }

    private async setContactPersonAsync(user: User): Promise<void> {
        await this.initializeContractPersonFields(user);
        await this.setState({contactPerson: user});
    }

    private get newContactPerson(): boolean {
        return this.state.newContactPerson;
    }

    private get selectedContactPerson(): User | null {
        return (!this.newContactPerson) ? this.state.contactPerson : null;
    }

    private initializeContractPersonFields(user: User | null): void {
        this.email.value = (user) ? user.email : "";
        this.firstname.value = (user) ? user.firstname : "";
        this.lastName.value = (user) ? user.lastName : "";
        this.middleName.value = (user) ? user.middleName : "";
        this.phone.value = (user) ? user.phone : "";
    }
    
    private async onOpenAsync(): Promise<void> {
        this._successfully = false;
        
        const contactPerson: User | null = null
            ? this.workOrder.customerOrderer
            : this.workOrder.customerOrderer;
        
        await this.initializeContractPersonFields(contactPerson);
        
        await this.setState({ contactPerson, initialized: true});
        (this.workOrder.customerApprover != null) &&
        await this.setContactPersonAsync(this.workOrder.customerApprover);

    }
    
    private async onSubmitAsync(): Promise<void> {
        
        const isValid: boolean = await this._formRef.current!.validateAsync();
        if (!isValid) {
            return;
        }
        
        const request = new CreateAndAssignContactPersonRequest();
        
        request.authType = (this.state.contactPerson) ? this.state.contactPerson.authType : AuthType.Email; 
        request.email = this.email.value;
        request.phone = this.phone.value;
        request.firstname = this.firstname.value;
        request.lastName = this.lastName.value;
        request.middleName = this.middleName.value;
        request.externalId = (this.selectedContactPerson) ? this.selectedContactPerson.externalId : "";


        const success: boolean = await this.props.editContactPerson(this.modal, request);
        
        if (!success) {
            const form: Form | null = this._formRef.current;
            if (form != null) {
                let validationError: string = Localizer.sendWorkReportModalEmailExists;
                await form.setValidationErrorsAsync(validationError);
            }

            return;
        }

        
        
        
        await this.modal.closeAsync();
        
    }

    private get constructionSiteName(): string {
        return this.props.constructionSiteName;
    }

    private get modal(): Modal<IEditContactPersonModalData> {
        return this._modalRef.current!;
    }
    
    private get data(): IEditContactPersonModalData {
        return this.modal.data!;
    }

    private get workOrder(): WorkOrderModel {
        return this.data.workOrder;
    }

    public async openAsync(workOrder: WorkOrderModel): Promise<void> {
        const data: IEditContactPersonModalData = { workOrder };
        await this.modal.openAsync(data);
    }

    public async closeAsync(): Promise<void> {
        this.email = {value: ""};
        this.firstname = {value: ""};
        this.lastName = {value: ""};
        this.middleName = {value: ""};
        this.phone = {value: ""};

        await this.modal.closeAsync();
        await this.reRenderAsync();
    }

    public static get modalId(): string {
        return "editContactPersonModal";
    }

    private get initialized(): boolean {
        return this.state.initialized;
    }

    public get isEditable(): boolean {
        return (
            (this.initialized) &&
            ((this.newContactPerson) || ((this.selectedContactPerson != null) && (!WorkOrderModel.isApproverOrOrdererValid(this.selectedContactPerson))))
        );
    }

    public render(): React.ReactNode {
        return (
            <Modal className={styles.editContactPersonModal}
                   id={EditContactPersonModal.modalId}
                   ref={this._modalRef}
                   title={this.constructionSiteName}
                   subtitle={"EN: Fill in missing information"}
                   transform={this.transformData}
                   onOpen={async () => await this.onOpenAsync()}
            >

                <div className="row">
                    <div className="col">

                        <Form className={styles.form}
                              ref={this._formRef}
                              id="newContactPerson"
                              onSubmit={async () => await this.onSubmitAsync()}>

                            <TextInput id="firstname" required
                                       label={Localizer.formInputFirstname}
                                       model={this.firstname}
                            />

                            <TextInput id="lastName" required
                                       label={Localizer.formInputLastname}
                                       model={this.lastName}
                            />

                            <TextInput id="middleName"
                                       label={Localizer.formInputMiddlename}
                                       model={this.middleName}
                            />

                            <EmailInput id="email" required
                                        label={Localizer.formInputEmail}
                                        model={this.email}
                            />

                            <PhoneInput id="phone" required
                                        label={Localizer.formInputPhone}
                                        model={this.phone}
                            />

                            <div>
                                <Button className={styles.buttons}
                                        type={ButtonType.Light}
                                        label={Localizer.genericCancel}
                                        onClick={async () => await this.closeAsync()}
                                />

                                        <Button className={this.css(styles.buttons, "float-right")}
                                                type={ButtonType.Orange}
                                                submit
                                                label={"EN: Save changes"}
                                        />

                            </div>

                        </Form>

                    </div>
                </div>

            </Modal>
        )
    }
}