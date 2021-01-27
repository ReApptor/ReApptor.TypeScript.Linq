import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import Button, { ButtonType } from "../../../components/Button/Button";
import Panel from "../../../components/Panel/Panel";
import Form from "../../../components/Form/Form";
import TextInput from "../../../components/Form/Inputs/TextInput/TextInput";
import AddressDivider from "../../../components/Form/Inputs/AddressInput/AddressDivider/AddressDivider";
import ButtonContainer from "../../../components/ButtonContainer/ButtonContainer";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import SaveOrganizationContractRequest from "../../../models/server/requests/SaveOrganizationContractRequest";
import OrganizationContract from "../../../models/server/OrganizationContract";
import ConstructionSite from "../../../models/server/ConstructionSite";
import TwoColumns from "../../../components/Layout/TwoColumn/TwoColumns";
import VirtualAddressDivider from "@/components/Form/Inputs/AddressInput/VirtualAddressDivider/VirtualAddressDivider";
import Checkbox, { InlineType } from "@/components/Form/Inputs/Checkbox/Checkbox";
import Localizer from "../../../localization/Localizer";

interface IOrganizationPanelProps {
    constructionSite: ConstructionSite;
    readonly?: boolean;
    submit(sender: OrganizationPanel, request: SaveOrganizationContractRequest): Promise<void>
}

interface IOrganizationPanelState {
    virtualAddress: boolean;
}

export default class OrganizationPanel extends BaseComponent<IOrganizationPanelProps, IOrganizationPanelState> {
    
    state: IOrganizationPanelState = {
        virtualAddress: !!this.organizationContract.virtualAddress
    };

    private get organizationContract(): OrganizationContract {
        return this.props.constructionSite.organizationContract!;
    }

    private get readonly(): boolean {
        return !!this.props.readonly;
    }

    private async onVirtualAddressCheckboxChangeAsync(value: boolean) {
        await this.setState({virtualAddress: value});
    }

    private async organizationContractSubmitAsync(data: Dictionary<string, any>): Promise<void> {
        const request = new SaveOrganizationContractRequest();
        this.copyTo(data, request, this.organizationContract);
        request.id = this.organizationContract!.id;
        await this.props.submit(this, request);
    }

    public render(): React.ReactNode {

        return (
            <Panel className={"flex-2"} title={Localizer.addConstructionsiteOrganization}>
                <div className="col-12">
                    <Form readonly={this.readonly}
                            onSubmit={async (sender, data) => await this.organizationContractSubmitAsync(data)}>
                        
                        <TwoColumns>

                            <TextInput id="name"
                                       label={Localizer.organizationPanelName}
                                       readonly
                                       value={this.organizationContract.name}
                            />
    
                            <TextInput id="externalId"
                                       label={Localizer.organizationPanelExternalId}
                                       readonly
                                       value={this.organizationContract.externalId}
                            />
                        
                        </TwoColumns>
                        
                        {
                            ((!this.organizationContract.location) && (this.organizationContract.externalAddress)) &&
                            (
                                <TextInput id="externalAddress"
                                           label={Localizer.organizationPanelExternalAddress}
                                           readonly
                                           value={this.organizationContract.externalAddress}
                                />
                            )
                        }
                        
                        <Checkbox label={Localizer.organizationPanelVirtualAddress}
                                  value={this.state.virtualAddress}
                                  inline
                                  inlineType={InlineType.Right}
                                  className="mb-3"
                                  onChange={async (sender, item) => await this.onVirtualAddressCheckboxChangeAsync(item!)}
                        />
                        
                        {
                            (this.state.virtualAddress)
                                ? 
                                (
                                    <VirtualAddressDivider id="virtualAddress" required
                                                           value={this.organizationContract.virtualAddress || undefined}
                                    />
                                )
                                :
                                (
                                    <AddressDivider id="formattedAddress" required
                                                    location={this.organizationContract.location || undefined}
                                                    locationPicker
                                    />
                                )
                        }
                        
                        <TwoColumns>
                            <TextInput id="transactionIdentifier"
                                       label={Localizer.organizationPanelTransactionIdentifier}
                                       value={this.organizationContract.transactionIdentifier}
                            />
                            <TextInput id="intermediator"
                                       label={Localizer.organizationPanelIntermediator}
                                       value={this.organizationContract.intermediator}
                            />
                        </TwoColumns>

                        <ButtonContainer>
                            <Button submit
                                    type={ButtonType.Orange}
                                    label={Localizer.formSave}
                                    icon={{name: "far save"}}
                                    disabled={this.readonly}
                            />
                        </ButtonContainer>

                    </Form>
                </div>
            </Panel>
        );

    }
};