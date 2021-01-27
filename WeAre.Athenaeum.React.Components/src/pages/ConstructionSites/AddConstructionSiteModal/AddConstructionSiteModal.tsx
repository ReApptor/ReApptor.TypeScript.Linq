import React from "react";
import {GeoLocation} from "@weare/athenaeum-toolkit";
import {ApplicationContext, BaseComponent, ch, IBaseComponent, PageRouteProvider} from "@weare/athenaeum-react-common";
import Button, {ButtonType} from "../../../components/Button/Button";
import Modal from "../../../components/Modal/Modal";
import Dropdown from "../../../components/Form/Inputs/Dropdown/Dropdown";
import ButtonContainer from "../../../components/ButtonContainer/ButtonContainer";
import OneColumn from "../../../components/Layout/OneColumn/OneColumn";
import Form from "../../../components/Form/Form";
import {ConstructionSiteStatus} from "@/models/Enums";
import User from "../../../models/server/User";
import TextInput from "../../../components/Form/Inputs/TextInput/TextInput";
import AddressInput from "../../../components/Form/Inputs/AddressInput/AddressInput";
import AddConstructionSiteRequest from "../../../models/server/requests/AddConstructionSiteRequest";
import Warehouse from "../../../models/server/Warehouse";
import TwoColumns from "../../../components/Layout/TwoColumn/TwoColumns";
import OrganizationContract from "../../../models/server/OrganizationContract";
import AddConstructionSiteResponse from "@/models/server/responses/AddConstructionSiteResponse";
import Checkbox from "@/components/Form/Inputs/Checkbox/Checkbox";
import ConstructionSite from "@/models/server/ConstructionSite";
import PageDefinitions from "@/providers/PageDefinitions";
import ApplicationSettings from "@/models/server/ApplicationSettings";
import UserInteractionDataStorage from "@/providers/UserInteractionDataStorage";
import Localizer from "../../../localization/Localizer";

import "./BootstrapOverride.scss";
import styles from "./AddConstructionSiteModal.module.scss";

interface IAddConstructionSiteModalProps {
    id: string;

    fetchManagers(sender: IBaseComponent): Promise<User[]>;

    fetchCustomers(sender: IBaseComponent): Promise<OrganizationContract[]>;

    fetchWarehouses(sender: IBaseComponent): Promise<Warehouse[]>;

    addConstructionSite(request: AddConstructionSiteRequest): Promise<AddConstructionSiteResponse>;
}

interface IAddConstructionSiteModalState {
    managers: User[] | null,
    manager: User | null,
    organizationContracts: OrganizationContract[] | null,
    organizationContract: OrganizationContract | null,
    warehouses: Warehouse[] | null,
    warehouse: Warehouse | null,
    location: GeoLocation | null,
    name: string,
    externalId: string,
    customerInvoiceReference: string,
    status: ConstructionSiteStatus | null,
    salesPerson: User | null,
    redirect: boolean;
}

export default class AddConstructionSiteModal extends BaseComponent<IAddConstructionSiteModalProps, IAddConstructionSiteModalState> {

    state: IAddConstructionSiteModalState = {
        managers: null,
        manager: null,
        organizationContracts: null,
        organizationContract: null,
        warehouses: null,
        warehouse: null,
        location: null,
        name: "",
        externalId: "",
        customerInvoiceReference: "",
        status: null,
        salesPerson: null,
        redirect: true
    };

    private readonly _modalRef: React.RefObject<Modal> = React.createRef();
    private readonly _formRef: React.RefObject<Form> = React.createRef();

    private async onPlaceSelected(location: GeoLocation) {
        await this.setState({location});
    }

    private async onChangeCustomerAsync(customer: OrganizationContract): Promise<void> {
        await this.setState({organizationContract: customer});
    }

    private async onChangeWarehouseAsync(warehouse: Warehouse) {
        UserInteractionDataStorage.set("warehouseId", warehouse.id);
        await this.setState({warehouse});
    }

    private async onNameChangeAsync(name: string) {
        await this.setState({name});
    }

    private async onExternalIdChangeAsync(externalId: string) {
        await this.setState({externalId});
    }

    private async onCustomerInvoiceReferenceChangeAsync(customerInvoiceReference: string) {
        await this.setState({customerInvoiceReference});
    }

    private async onRedirectChangeAsync(redirect: boolean) {
        await this.setState({redirect});
    }

    private async onSubmitAsync(): Promise<void> {
        
        const request = new AddConstructionSiteRequest();
        request.name = this.state.name;
        request.externalId = this.state.externalId;
        //request.timeTrackingDeviceId = this.state.timeTrackingDeviceId;
        request.customerInvoiceReference = this.state.customerInvoiceReference;
        request.formattedAddress = this.state.location!.formattedAddress;
        request.organizationContractId = this.state.organizationContract!.id;

        const response: AddConstructionSiteResponse = await this.props.addConstructionSite(request);
        const constructionSite: ConstructionSite | null = response.constructionSite;

        if (response.timeTrackingDeviceIdExists) {
            if (this.form != null) {
                let validationError: string = Localizer.addConstructionsiteDuplicateDeviceId;
                await this.form.setValidationErrorsAsync(validationError);
            }
        } else {
            await this._modalRef.current!.closeAsync();

            if (this.state.redirect && constructionSite != null) {
                await PageRouteProvider.redirectAsync(PageDefinitions.constructionSiteManagement(constructionSite.id));
            }

            await ch.flyoutMessageAsync(Localizer.addConstructionsiteFlyout);
        }
    }


    private get canSetExternalId() : boolean{
        const context: ApplicationContext = ch.getContext();
        const settings: ApplicationSettings = context.settings;

        return settings.defaultConstructionSiteExternalId == -1;
    }

    private get hasCustomers(): boolean {
        return !!this.state.organizationContracts;
    }

    private get form(): Form | null {
        return this._formRef.current;
    }

    public hasSpinner(): boolean {
        return true;
    }

    public async openAsync(): Promise<void> {
        await this._modalRef.current!.openAsync();
    }

    public async initializeAsync(): Promise<void> {

        if (!this.hasCustomers) {
            const organizationContracts: OrganizationContract[] = await this.props.fetchCustomers(this);
            const warehouses: Warehouse[] = await this.props.fetchWarehouses(this);

            let warehouse: Warehouse | null = null;

            let warehouseId: string | null = UserInteractionDataStorage.get("warehouseId");
            if (warehouseId != null) {
                warehouse = warehouses!.find(item => item.id == warehouseId)!;
            }
            
            await this.setState({organizationContracts, warehouses, warehouse});
        }
    }

    public render(): React.ReactNode {

        return (
            <Modal id={this.props.id} ref={this._modalRef} className={styles.addConstructionSiteModal} title={Localizer.addConstructionsiteTitle}>
                <div className="row">
                    <div className="col">

                        <Form ref={this._formRef} id="addConstructionSiteForm" onSubmit={async () => await this.onSubmitAsync()} submitOnEnter={false}>

                            <OneColumn>

                                <TextInput id="name" required
                                           label={Localizer.tasksPanelName}
                                           value={this.state.name!}
                                           onChange={async (sender, item) => await this.onNameChangeAsync(item!)}
                                />

                                <AddressInput id="address" required
                                              label={Localizer.formInputAddress}
                                              value={this.state!.location != null ? this.state.location.formattedAddress : ""}
                                              locationPicker
                                              append
                                              onChange={async (location) => await this.onPlaceSelected(location)}
                                />
                                
                                {
                                    this.canSetExternalId
                                        ?
                                        (
                                            <TwoColumns>

                                                <TextInput id="externalId"
                                                           label={Localizer.addConstructionsiteProjectNumber}
                                                           value={this.state.externalId}
                                                           onChange={async (sender, item) => await this.onExternalIdChangeAsync(item!)}

                                                />

                                                <TextInput id="customerInvoiceReference"
                                                           label={Localizer.addConstructionSiteInvoiceReference}
                                                           value={this.state.customerInvoiceReference}
                                                           onChange={async (sender, item) => await this.onCustomerInvoiceReferenceChangeAsync(item!)}
                                                />

                                            </TwoColumns>
                                        )
                                        :
                                        (
                                            <OneColumn>

                                                <TextInput id="customerInvoiceReference"
                                                           label={Localizer.addConstructionSiteInvoiceReference}
                                                           value={this.state.customerInvoiceReference}
                                                           onChange={async (sender, item) => await this.onCustomerInvoiceReferenceChangeAsync(item!)}
                                                />

                                            </OneColumn> 
                                        )
                                }

                                <TwoColumns>

                                    <Dropdown id="organizationContract" required noSubtext
                                              label={Localizer.addConstructionsiteOrganization}
                                              items={this.state.organizationContracts || []}
                                              selectedItem={this.state.organizationContract || undefined}
                                              onChange={async (sender, item) => await this.onChangeCustomerAsync(item!)}
                                    />

                                    <Dropdown id="warehouse" required noSubtext
                                              filterMinLength={50}
                                              label={Localizer.addConstructionsiteWarehouse}
                                              items={this.state.warehouses || []}
                                              selectedItem={this.state.warehouse || undefined}
                                              onChange={async (sender, item) => await this.onChangeWarehouseAsync(item!)}
                                    />

                                </TwoColumns>

                            </OneColumn>

                            <ButtonContainer>

                                <div className={styles.redirect}>
                                    <Checkbox value={this.state.redirect}
                                              onChange={async (sender, item) => await this.onRedirectChangeAsync(item!)}/>

                                    <span>{Localizer.addConstructionsiteRedirect}</span>
                                </div>

                                <Button submit
                                        label={Localizer.addConstructionsiteAddSite}
                                        type={ButtonType.Orange}
                                />
                            </ButtonContainer>

                        </Form>

                    </div>
                </div>
            </Modal>
        );
    }
};