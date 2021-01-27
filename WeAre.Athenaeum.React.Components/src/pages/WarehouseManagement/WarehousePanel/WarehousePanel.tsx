import React from "react";
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import Button, {ButtonType} from "../../../components/Button/Button";
import Panel from "../../../components/Panel/Panel";
import Form from "../../../components/Form/Form";
import TextInput from "../../../components/Form/Inputs/TextInput/TextInput";
import AddressDivider from "../../../components/Form/Inputs/AddressInput/AddressDivider/AddressDivider";
import ButtonContainer from "../../../components/ButtonContainer/ButtonContainer";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import Warehouse from "../../../models/server/Warehouse";
import TwoColumns from "@/components/Layout/TwoColumn/TwoColumns";
import User from "@/models/server/User";
import Dropdown from "@/components/Form/Inputs/Dropdown/Dropdown";
import SaveWarehouseRequest from "@/models/server/requests/SaveWarehouseRequest";
import SaveWarehouseResponse from "@/models/server/responses/SaveWarehouseResponse";
import Localizer from "../../../localization/Localizer";

interface IWarehousePanelProps {
    warehouse: Warehouse | null;
    readonly?: boolean;
}

interface IWarehousePanelState {
    managers: User[] | null,
}

export default class WarehousePanel extends BaseComponent<IWarehousePanelProps, IWarehousePanelState> {
    
    state: IWarehousePanelState = {
        managers: null
    };

    private get readonly(): boolean {
        return !!this.props.readonly;
    }

    private get warehouse(): Warehouse | null {
        return this.props.warehouse;
    }

    private async warehouseSubmitAsync(data: Dictionary<string, any>) {
        const request = new SaveWarehouseRequest();
        request.id = this.warehouse!.id;
        this.copyTo(data, request, this.warehouse);
        
        const response: SaveWarehouseResponse = await this.postAsync("api/warehouse/saveWarehouse", request);
        
        if (response.timeTrackingDeviceIdExists) {
            await ch.alertErrorAsync(Localizer.addConstructionsiteDuplicateDeviceId);
        } else {
            await ch.flyoutMessageAsync(Localizer.tasksPanelFlyoutChangesSaved);
        }
    }

    public async componentDidMount(): Promise<void> {
        const managers: User[] = await this.postAsync("api/warehouse/getManagers");
        await this.setState({ managers });
    }

    public render(): React.ReactNode {
        return (
            <Panel className="col-4" title={Localizer.warehousePanelPanelTitle}>
                <div className="col-12">
                    {
                        (this.warehouse) &&
                        (
                            <Form readonly={this.readonly}
                                  onSubmit={async (sender, data) => await this.warehouseSubmitAsync(data)}>

                                <TwoColumns>
                                    
                                    <TextInput id="name"
                                               label={Localizer.genericName}
                                               value={this.warehouse.name}
                                    />

                                    <TextInput id="timeTrackingDeviceId"
                                               label={Localizer.formInputTimeTrackingDeviceId}
                                               value={this.warehouse.timeTrackingDeviceId || undefined}
                                    />
                                    
                                </TwoColumns>

                                <AddressDivider id="formattedAddress" required
                                                location={this.warehouse.location || undefined}
                                />
                                
                                <TwoColumns>
                                    <Dropdown id="managerId" required noSubtext
                                              filterMinLength={50}
                                              label={Localizer.addConstructionsiteManager}
                                              items={this.state.managers || []}
                                              selectedItem={this.warehouse.manager || undefined}
                                    />
                                    
                                    <TextInput id="costPool"
                                               label={Localizer.formInputCostPool}
                                               value={this.warehouse.costPool || undefined}
                                    />
                                </TwoColumns>

                                <ButtonContainer>

                                    <Button type={ButtonType.Orange}
                                            label={Localizer.formSave}
                                            icon={{name: "far save"}}
                                            disabled={this.readonly}
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


}