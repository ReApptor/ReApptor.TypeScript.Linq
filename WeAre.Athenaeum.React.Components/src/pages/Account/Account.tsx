import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {ch, PageRouteProvider} from "@weare/athenaeum-react-common";
import PageRow from "../../components/PageContainer/PageRow/PageRow";
import PageHeader from "../../components/PageContainer/PageHeader/PageHeader";
import AuthorizedPage from "../../models/base/AuthorizedPage";
import PageContainer from "../../components/PageContainer/PageContainer";
import ButtonContainer from "../../components/ButtonContainer/ButtonContainer";
import Form from "../../components/Form/Form";
import TextInput from "../../components/Form/Inputs/TextInput/TextInput";
import Button, { ButtonType } from "../../components/Button/Button";
import EmailInput from "../../components/Form/Inputs/EmailInput/EmailInput";
import User from "../../models/server/User";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import TwoColumns from "../../components/Layout/TwoColumn/TwoColumns";
import Dropdown from "../../components/Form/Inputs/Dropdown/Dropdown";
import { AuthType } from "@/models/Enums";
import PageDefinitions from "../../providers/PageDefinitions";
import AddressDivider from "../../components/Form/Inputs/AddressInput/AddressDivider/AddressDivider";
import SaveUserRequest from "../../models/server/requests/SaveUserRequest";
import PhoneInput from "@/components/Form/Inputs/PhoneInput/PhoneInput";
import SaveUserResponse from "@/models/server/responses/SaveUserResponse";
import Modal, { ModalSize } from "@/components/Modal/Modal";
import Checkbox, { InlineType } from "@/components/Form/Inputs/Checkbox/Checkbox";
import Inline from "@/components/Layout/Inline/Inline";
import OneColumn from "@/components/Layout/OneColumn/OneColumn";
import TransformProvider from "@/providers/TransformProvider";
import Localizer from "../../localization/Localizer";

interface IAccountProps  {
}

interface IAccountState {
}
   
export default class Account extends AuthorizedPage<IAccountProps, IAccountState> {
    state: IAccountState = {
    };
    
    private readonly _agreementRef: React.RefObject<Checkbox> = React.createRef();
    private readonly _registrationRef: React.RefObject<Checkbox> = React.createRef();

    private get agreementCheckbox(): Checkbox {
        return this._agreementRef.current!;
    }

    private get registrationCheckbox(): Checkbox {
        return this._registrationRef.current!;
    }

    public getTitle(): string {
        return Localizer.topNavAccount;
    }

    public async handleSubmitAsync(data: Dictionary<string, any>): Promise<void> {
        
        if (!this.agreementCheckbox.checked || !this.registrationCheckbox.checked) {
            return await ch.alertErrorAsync(Localizer.myAccountPageAcceptanceRequired);
        }
        
        const request = new SaveUserRequest();
        request.id = this.user.id;
        request.authType = this.user.authType;
        
        this.copyTo(data, request, this.user);

        const response: SaveUserResponse = await this.postAsync("api/account/saveUserAccount", request);

        if (response.userAlreadyExists) {
            await this.alertErrorAsync(Localizer.myAccountPageUserAlreadyExists, true);
            return;
        }
        
        const message: string = Utility.format(Localizer.myAccountPageDataSaved, TransformProvider.userToString(this.user));
        await this.alertMessageAsync(message, true);
    }

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();
        
        const user: User = this.getUser();
        await this.setState({ user });
    }

    public get user(): User {
        return this.getUser();
    }

    private async redirectToPasswordPage() {
        await PageRouteProvider.redirectAsync(PageDefinitions.changePasswordRoute);        
    }

    public render(): React.ReactNode {
        return (
            <PageContainer>
                <PageHeader title={Localizer.myAccountPageTitle}
                            subtitle={Localizer.myAccountPageSubtitle} withTabs />

                <PageRow>
                    <div className="col">
                        {
                            (this.user) &&
                            (
                                <Form id="form" onSubmit={async (_, data) => await this.handleSubmitAsync(data)}>

                                    <TwoColumns>
                                        <EmailInput id="email"
                                                    label={Localizer.formInputEmail}
                                                    value={this.user!.email}
                                                    required={(this.user.authType == AuthType.Email)}
                                                    readonly={!!this.user.email && (this.user.authType == AuthType.Email)} />

                                        <PhoneInput id="phone"
                                                    label={Localizer.formInputPhone}
                                                    value={this.user.phone}
                                                    required={(this.user.authType == AuthType.Phone)}
                                                    readonly={!!this.user.phone && (this.user.authType == AuthType.Phone)} />
                                    </TwoColumns>

                                    <TwoColumns>
                                        <TextInput id="firstname" label={Localizer.formInputFirstname} value={this.user.firstname} required />

                                        <TextInput id="lastName" label={Localizer.formInputLastname} value={this.user.lastName} required />
                                    </TwoColumns>

                                    <TwoColumns>
                                        <TextInput id="middleName" label={Localizer.formInputMiddlename} value={this.user.middleName} />

                                        <Dropdown id="language"
                                                  required
                                                  label={Localizer.formInputLanguage}
                                                  items={Localizer.supportedLanguages}
                                                  selectedItem={Localizer.findLanguage(this.user.language)} />
                                    </TwoColumns>

                                    <AddressDivider id="formattedAddress" location={this.user.homeLocation || undefined} required />

                                    <OneColumn className="mb-3">
                                        <Inline>
                                            <Checkbox ref={this._agreementRef}
                                                      id="agreementAccepted"
                                                      label={Localizer.myAccountPageAcceptance}
                                                      inline
                                                      inlineType={InlineType.Right}
                                                      value={this.user.agreementAccepted}
                                                      readonly={this.user.agreementAccepted}
                                            />

                                            <Button className={"ml-n2"}
                                                    label={Localizer.myAccountPageAcceptanceTerms}
                                                    type={ButtonType.Text}
                                                    toggleModal
                                                    dataTarget="agreementModal"
                                            />
                                        </Inline>

                                        <Inline>
                                            <Checkbox ref={this._registrationRef}
                                                      id="registrationAccepted"
                                                      label={Localizer.myAccountPageAcceptance}
                                                      inline
                                                      inlineType={InlineType.Right}
                                                      value={this.user.registrationAccepted}
                                                      readonly={this.user.registrationAccepted}
                                            />

                                            <Button className={"ml-n2"}
                                                    label={Localizer.myAccountPageAcceptancePrivacyNotice}
                                                    type={ButtonType.Text}
                                                    toggleModal
                                                    dataTarget="privacyNoticeModal"
                                            />
                                        </Inline>
                                    </OneColumn>

                                    <ButtonContainer>
                                        <Button type={ButtonType.Blue} onClick={() => this.redirectToPasswordPage()} label={Localizer.changePasswordButton}/>

                                        <Button type={ButtonType.Orange} label={Localizer.formSave} icon={{name: "far save"}} submit />
                                    </ButtonContainer>

                                </Form>
                            )
                        }
                    </div>
                </PageRow>

                <Modal id="agreementModal" info keepTextFormatting
                       title={Localizer.myAccountPageAcceptanceTermsTitle}
                       content={Localizer.myAccountPageAcceptanceTermsContent}
                       size={ModalSize.Large}
                />

                <Modal id="privacyNoticeModal" info keepTextFormatting
                       title={Localizer.myAccountPageAcceptancePrivacyNoticeTitle}
                       content={Localizer.myAccountPageAcceptancePrivacyNoticeContent}
                       size={ModalSize.Large}
                />
                
            </PageContainer>
        );
    }
}