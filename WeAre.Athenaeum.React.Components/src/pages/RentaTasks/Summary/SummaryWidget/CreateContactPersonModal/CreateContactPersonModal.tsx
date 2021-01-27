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

import styles from "./CreateContactPersonModal.module.scss";

interface ICreateContactPersonModalProps {
    constructionSiteName: string;
    addContactPerson(sender: IBaseComponent, request: CreateAndAssignContactPersonRequest): Promise<boolean>;
}

interface ICreateContactPersonModalState {
}

export default class CreateContactPersonModal extends BaseComponent<ICreateContactPersonModalProps, ICreateContactPersonModalState> {
    private email: IStringInputModel = {value: ""};
    private firstname: IStringInputModel = {value: ""};
    private lastName: IStringInputModel = {value: ""};
    private middleName: IStringInputModel = {value: ""};
    private phone: IStringInputModel = {value: ""};

    private readonly _modalRef: React.RefObject<Modal> = React.createRef();
    private readonly _formRef: React.RefObject<Form> = React.createRef();

    private async onSubmitAsync(): Promise<void> {
        const request = new CreateAndAssignContactPersonRequest();

        request.email = this.email.value;
        request.firstname = this.firstname.value;
        request.lastName = this.lastName.value;
        request.middleName = this.middleName.value;
        request.phone = this.phone.value;

        const success: boolean = await this.props.addContactPerson(this.modal, request);

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

    private get modal(): Modal {
        return this._modalRef.current!;
    }

    public async openAsync(): Promise<void> {
        await this.modal.openAsync();
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
        return "createContactPersonModal";
    }

    public render(): React.ReactNode {
        return (
            <Modal className={styles.createContactPersonModal}
                   id={CreateContactPersonModal.modalId}
                   ref={this._modalRef}
                   title={this.constructionSiteName}
                   subtitle={Localizer.createContractPersonModalSubtitle}
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
                                        label={Localizer.addContactPersonModalCreate}
                                />
                            </div>
                            
                        </Form>

                    </div>
                </div>

            </Modal>
        )
    }
}