import React from "react";
import {ApplicationContext, BaseComponent, ch} from "@weare/athenaeum-react-common";
import Button, {ButtonType} from "../../../components/Button/Button";
import {ConstructionSiteStatus} from "@/models/Enums";
import Panel from "../../../components/Panel/Panel";
import Form from "../../../components/Form/Form";
import TextInput from "../../../components/Form/Inputs/TextInput/TextInput";
import AddressDivider from "../../../components/Form/Inputs/AddressInput/AddressDivider/AddressDivider";
import TwoColumns from "../../../components/Layout/TwoColumn/TwoColumns";
import ButtonContainer from "../../../components/ButtonContainer/ButtonContainer";
import ConstructionSite from "../../../models/server/ConstructionSite";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import Warehouse from "../../../models/server/Warehouse";
import User from "../../../models/server/User";
import SaveConstructionSiteRequest from "../../../models/server/requests/SaveConstructionSiteRequest";
import SaveConstructionSiteResponse from "@/models/server/responses/SaveConstructionSiteResponse";
import ApplicationSettings from "@/models/server/ApplicationSettings";
import NumberInput from "@/components/Form/Inputs/NumberInput/NumberInput";
import {DefaultPrices} from "@/models/server/DefaultPrices";
import {ActivateConstructionSiteRequest} from "@/models/server/requests/ActivateConstructionSiteRequest";
import TransformProvider from "@/providers/TransformProvider";
import Localizer from "../../../localization/Localizer";

interface IConstructionSitePanelProps {
    constructionSite: ConstructionSite;
    warehouses: Warehouse[] | null;
    defaultPrices: DefaultPrices | null;
    managers: User[] | null;
    readonly?: boolean;
    submit(sender: ConstructionSitePanel, request: SaveConstructionSiteRequest): Promise<SaveConstructionSiteResponse>
    setActiveAsync(sender: ConstructionSitePanel, request: ActivateConstructionSiteRequest, active: boolean): Promise<void>;
}

interface IConstructionSitePanelState {
}

export default class ConstructionSitePanel extends BaseComponent<IConstructionSitePanelProps, IConstructionSitePanelState> {

    state: IConstructionSitePanelState = {};

    private _addressDividerRef: React.RefObject<AddressDivider> = React.createRef();

    private get constructionSite(): ConstructionSite | null {
        return this.props.constructionSite;
    }

    private get readonly(): boolean {
        return !!this.props.readonly;
    }

    private async constructionSiteSubmitAsync(data: Dictionary<string, any>): Promise<void> {
        const request = new SaveConstructionSiteRequest();
        request.constructionSiteId = this.constructionSite!.id;
        request.organizationContractId = this.constructionSite!.organizationContractId;
        request.status = this.constructionSite!.status;
        request.formattedAddress = this._addressDividerRef.current!.getValue();
        request.mileagePrice = this.constructionSite!.mileagePrice;
        request.hoursPrice = this.constructionSite!.hoursPrice;
        this.copyTo(data, request, this.constructionSite);
        await this.props.submit(this, request);
    }

    public async initializeAsync(): Promise<void> {
        if (this.constructionSite!.hoursPrice == null) {
            this.constructionSite!.hoursPrice = this.defaultHourPrice;
        }
        if (this.constructionSite!.mileagePrice == null) {
            this.constructionSite!.mileagePrice = this.defaultMileagePrice;
        }
        await super.initializeAsync();
    }

    private get defaultMileagePrice(): number {
        if (this.constructionSite!.mileagePrice != null) {
            return this.constructionSite!.mileagePrice;
        }

        return (this.props.defaultPrices!.defaultMileagePrice != null)
            ? this.props.defaultPrices!.defaultMileagePrice
            : 0;
    }

    private get defaultHourPrice(): number {
        if (this.constructionSite!.hoursPrice != null) {
            return this.constructionSite!.hoursPrice;
        }

        return (this.props.defaultPrices!.defaultHoursPrice != null)
            ? this.props.defaultPrices!.defaultHoursPrice
            : 0;
    }

    private isExternalIdReadonly(): boolean {
        const context: ApplicationContext = ch.getContext();
        const settings: ApplicationSettings = context.settings;
        return settings.defaultConstructionSiteExternalId > 0;
    }

    private async toggleConstructionSiteActivationAsync(): Promise<void> {
        const active: boolean | null = (this.constructionSite!.status == ConstructionSiteStatus.Active)
            ? true
            : (this.constructionSite!.status == ConstructionSiteStatus.Inactive)
                ? false : null;

        const request: ActivateConstructionSiteRequest = new ActivateConstructionSiteRequest();

        request.constructionSiteId = this.constructionSite!.id;
        request.mileagePrice = this.constructionSite!.mileagePrice;
        request.hoursPrice = this.constructionSite!.hoursPrice;
        
        if (active !== null) {
            await this.props.setActiveAsync(this, request, !active);
        }
    }

    public render(): React.ReactNode {
        return (
            <Panel className="flex-2" title={Localizer.genericConstructionsite}>
                <div className="col-12">
                    {
                        (this.constructionSite) &&
                        (
                            <Form onSubmit={async (sender, data) => await this.constructionSiteSubmitAsync(data)}>

                                <TextInput id="name" required
                                           label={Localizer.genericName}
                                           value={this.constructionSite.name}
                                />

                                <TextInput required readonly
                                           label={Localizer.constructionSitePanelExternalName}
                                           value={this.constructionSite.externalName}
                                />

                                {
                                    ((!this.constructionSite.location) && (this.constructionSite.externalAddress)) &&
                                    (
                                        <TextInput id="externalAddress"
                                                   label={Localizer.constructionSitePanelExternalAddress}
                                                   readonly
                                                   value={this.constructionSite.externalAddress}
                                        />
                                    )
                                }

                                <AddressDivider ref={this._addressDividerRef} required locationPicker
                                                location={this.constructionSite.location || undefined}
                                />

                                <TwoColumns>

                                    <TextInput id="externalId"
                                               noValidate={this.readonly}
                                               label={Localizer.addConstructionsiteProjectNumber}
                                               readonly={this.isExternalIdReadonly()}
                                               value={this.constructionSite.externalId}
                                    />

                                    <TextInput id="externalReference"
                                               noValidate={this.readonly}
                                               label={Localizer.addConstructionSiteReference}
                                               readonly={true}
                                               value={this.constructionSite.externalReference}
                                    />

                                </TwoColumns>
                                
                                <TwoColumns>
                                    
                                    <NumberInput id="hoursPrice"
                                                 label={Localizer.addConstructionSiteHourPrice}
                                                 step={0.01}
                                                 format="0.0"
                                                 onChange={async (sender, value) => { this.constructionSite!.hoursPrice = value }}
                                                 value={this.constructionSite.hoursPrice!}
                                    />
                                    
                                    <NumberInput id="mileagePrice"
                                                 label={Localizer.addConstructionSiteMileagePrice}
                                                 step={0.01}
                                                 format="0.0"
                                                 onChange={async (sender, value) => { this.constructionSite!.mileagePrice = value }}
                                                 value={this.constructionSite.mileagePrice!}
                                    />
                                    
                                </TwoColumns>

                                <TwoColumns>
                                    
                                    <TextInput readonly
                                               label={Localizer.constructionSitePanelOrganizationContract}
                                               value={TransformProvider.toString(this.constructionSite.organizationContract)}
                                    />
                                    
                                </TwoColumns>

                                <ButtonContainer>

                                    {
                                        !(this.constructionSite!.status == ConstructionSiteStatus.Closed) &&
                                        (
                                            <React.Fragment>

                                                {
                                                    (this.constructionSite!.status == ConstructionSiteStatus.Active) &&
                                                    <Button type={ButtonType.Default}
                                                            label={Localizer.constructionSitesDeactivate}
                                                            icon={{name: "far stop-circle"}}
                                                            onClick={async () => await this.toggleConstructionSiteActivationAsync()}
                                                            confirm={Localizer.constructionSitePanelDeactivateConfirmation}
                                                    />
                                                }

                                                {
                                                    (this.constructionSite!.status == ConstructionSiteStatus.Inactive) &&
                                                    <Button type={ButtonType.Success}
                                                            label={Localizer.constructionSitesActivate}
                                                            icon={{name: "far play-circle"}}
                                                            onClick={async () => await this.toggleConstructionSiteActivationAsync()}
                                                            confirm={Localizer.constructionSitePanelActivateConfirmation}
                                                    />
                                                }

                                            </React.Fragment>
                                        )
                                    }

                                    <Button type={ButtonType.Orange}
                                            label={Localizer.formSave}
                                            icon={{name: "far save"}}
                                            submit
                                    />

                                </ButtonContainer>

                            </Form>
                        )
                    }
                </div>
            </Panel>
        );
    }
};