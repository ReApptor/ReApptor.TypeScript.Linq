import React from "react";
import {BasePageParameters} from "@weare/athenaeum-react-common";
import AnonymousPage from "../../models/base/AnonymousPage";
import PageContainer from "../../components/PageContainer/PageContainer";
import Form from "../../components/Form/Form";
import { IStringInputModel } from "@/components/Form/Inputs/BaseInput";
import TextInput from "../../components/Form/Inputs/TextInput/TextInput";
import Button, {ButtonType} from "../../components/Button/Button";
import PageRow from "../../components/PageContainer/PageRow/PageRow";
import PageHeader from "../../components/PageContainer/PageHeader/PageHeader";
import ButtonContainer from "../../components/ButtonContainer/ButtonContainer";
import EmailInput from "../../components/Form/Inputs/EmailInput/EmailInput";
import TextAreaInput from "../../components/Form/Inputs/TextAreaInput/TextAreaInput";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import User from "../../models/server/User";
import Localizer from "../../localization/Localizer";

export interface IContactSupportParameters extends BasePageParameters {
    requestId: string | null;
}

export default class ContactSupport extends AnonymousPage<IContactSupportParameters> {
    
    public email: IStringInputModel = { value: "" };
    public phone: IStringInputModel = { value: "" };
    public firstname: IStringInputModel = { value: "" };
    public lastname: IStringInputModel = {value: ""};
    public message: IStringInputModel = {value: ""};
    public formRef: React.RefObject<any> = React.createRef();
     
    public async initializeAsync(): Promise<void> {
        const user: User | null = this.findUser();
        if (user) {
            this.email.value = user.email || "";
            this.phone.value = user.phone || "";
            this.firstname.value = user.firstname || "";
            this.lastname.value = user.lastName || "";
        }
    }

    public async handleSubmitAsync(data: Dictionary<string, any>): Promise<void> {
        const contactSupportRequest = {} as any;
        data.keys().map(key => {
            return contactSupportRequest[key] = data.getValue(key);
        });
        
        await this.postAsync("api/ContactSupport/ContactSupport", contactSupportRequest);
    }

    public get requestId(): string | null {
        return (this.props.parameters != null) ? this.props.parameters.requestId : null;
    }

    public getTitle(): string {
        return Localizer.topNavContactSupport;
    }

    public render(): React.ReactNode {
        return (
            <PageContainer>
                <PageHeader title={Localizer.contactSupportPageTitle} />
                
                <PageRow>
                    <div className="col-lg-12">
                        <Form id="form" onSubmit={async (_, data) => await this.handleSubmitAsync(data)} ref={this.formRef}>
                            <EmailInput id="email" label={Localizer.formInputEmail} model={this.email} required readonly={!!this.email.value} />
                            <TextInput id="phone" label={Localizer.formInputPhone} model={this.phone} />
                            <TextInput id="firstname" label={Localizer.formInputFirstname} model={this.firstname} />
                            <TextInput id="lastname" label={Localizer.formInputLastname} model={this.lastname} />
                            <TextAreaInput id="message" label={Localizer.formInputMessage} model={this.message} required rows={6} />
                            
                            <ButtonContainer>
                                <Button type={ButtonType.Orange} label={Localizer.formSend} submit />
                            </ButtonContainer>
                        </Form>
                    </div>
                </PageRow>
            </PageContainer>
        );
    }
}