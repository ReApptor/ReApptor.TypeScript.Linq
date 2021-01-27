import React from "react";
import {BaseComponent, IBaseComponent} from "@weare/athenaeum-react-common";
import WorkOrderFiltersData from "@/models/server/WorkOrderFiltersData";
import Modal from "@/components/Modal/Modal";
import Dropdown, {DropdownAlign} from "@/components/Form/Inputs/Dropdown/Dropdown";
import {Dictionary} from "typescript-collections";
import Form from "@/components/Form/Form";
import Inline from "@/components/Layout/Inline/Inline";
import ButtonContainer from "@/components/ButtonContainer/ButtonContainer";
import Button, {ButtonType} from "@/components/Button/Button";
import TextInput from "@/components/Form/Inputs/TextInput/TextInput";
import {WorkOrderStatus} from "@/models/Enums";
import OrganizationContract from "@/models/server/OrganizationContract";
import ConstructionSiteOrWarehouse from "@/models/server/ConstructionSiteOrWarehouse";
import User from "@/models/server/User";
import ListActiveWorkOrdersRequest from "@/models/server/requests/ListActiveWorkOrdersRequest";
import EnumProvider from "@/providers/EnumProvider";
import Localizer from "@/localization/Localizer";

import styles from "./WorkOrdersFiltersModal.module.scss";

interface IWorkOrdersFiltersModalProps {
    request: ListActiveWorkOrdersRequest;
    filtersData: WorkOrderFiltersData;
    title: string;
    onSubmit(sender: IBaseComponent, request: ListActiveWorkOrdersRequest): Promise<void>;
}

interface IWorkOrdersFiltersModalState {
    request: ListActiveWorkOrdersRequest;
}

export default class WorkOrdersFiltersModal extends BaseComponent<IWorkOrdersFiltersModalProps, IWorkOrdersFiltersModalState> {
    state: IWorkOrdersFiltersModalState = {
        request: this.props.request
    };

    private readonly _modalRef: React.RefObject<Modal> = React.createRef();
    private readonly _ownersRef: React.RefObject<Dropdown<ConstructionSiteOrWarehouse>> = React.createRef();
    private readonly _organizationContractRef: React.RefObject<Dropdown<OrganizationContract>> = React.createRef();
    private readonly _statusesRef: React.RefObject<Dropdown<WorkOrderStatus>> = React.createRef();
    private readonly _employeesRef: React.RefObject<Dropdown<User>> = React.createRef();
    private readonly _managersRef: React.RefObject<Dropdown<User>> = React.createRef();
    
    private async clearAsync(): Promise<void> {
        this.state.request.clear();
        
        await this.setState({ request: this.state.request });
        
        this._ownersRef.current!.reRender();
        this._organizationContractRef.current!.reRender();
        this._statusesRef.current!.reRender();
        this._employeesRef.current!.reRender();
        this._managersRef.current!.reRender();
    }
    
    private async submitAsync(data: Dictionary<string, any>): Promise<void> {
        this.copyTo(data, this.state.request);
        
        await this._modalRef.current!.closeAsync();

        await this.props.onSubmit(this, this.state.request);
    }
    
    public async openAsync(): Promise<void> {
        await this._modalRef.current!.openAsync();
    }
    
    public render(): React.ReactNode {

        return (
            <Modal id={this.id} title={this.props.title} ref={this._modalRef} className={styles.workOrdersFiltersModal}>

                <Form className={styles.form} onSubmit={async (sender, data) => await this.submitAsync(data)}>
                    
                    <Inline className={styles.inline}>
                        <TextInput id="name"
                                   name="name"
                                   label={Localizer.workOrdersFiltersName}
                                   value={this.state.request.name || ""}
                        />

                        <Dropdown name={`statuses`} ref={this._statusesRef} multiple autoCollapse noSubtext
                                  label={Localizer.workOrdersFiltersStatuses}
                                  nothingSelectedText={"-"}
                                  transform={(value) => EnumProvider.getWorkOrderStatusItem(value)}
                                  items={this.props.filtersData.statuses}
                                  selectedItems={this.state.request.statuses}
                        />
                    </Inline>
                    
                    <Inline className={styles.inline}>
                        <Dropdown name={`organizationContractId`} ref={this._organizationContractRef} noWrap noSubtext
                                  label={Localizer.workOrdersFiltersCustomer}
                                  nothingSelectedText={"-"}
                                  align={DropdownAlign.Left}
                                  items={this.props.filtersData.organizationContracts}
                                  selectedItem={this.state.request.organizationContractId || undefined}
                        />
                        
                        <Dropdown name={`constructionSiteOrWarehouseId`} ref={this._ownersRef} noWrap noSubtext
                                  label={Localizer.workOrdersFiltersConstructionSite}
                                  nothingSelectedText={"-"}
                                  items={this.props.filtersData.owners}
                                  selectedItem={this.state.request.constructionSiteOrWarehouseId || undefined}
                        />
                    </Inline>

                    <Inline className={styles.inline}>
                        <Dropdown name={`employeesIds`} ref={this._employeesRef} multiple noSubtext
                                  label={Localizer.workOrdersFiltersEmployees}
                                  nothingSelectedText={"-"}
                                  align={DropdownAlign.Left}
                                  items={this.props.filtersData.employees}
                                  selectedItems={this.state.request.employeesIds}
                        />
                        
                        <Dropdown name={`managersIds`} ref={this._managersRef} multiple noSubtext
                                  label={Localizer.workOrdersFiltersManagers}
                                  nothingSelectedText={"-"}
                                  items={this.props.filtersData.managers}
                                  selectedItems={this.state.request.managersIds}
                        />
                    </Inline>
                    
                    <ButtonContainer className={this.css(styles.buttons, this.mobile && styles.mobile)}>
                        <Button submit type={ButtonType.Orange}
                                label={Localizer.workOrdersFiltersButtonApply}
                        />
                        
                        <Button type={ButtonType.Blue} 
                                label={Localizer.workOrdersFiltersButtonClear}
                                onClick={async () => await this.clearAsync()}
                        />
                    </ButtonContainer>
                    
                </Form>
                
            </Modal>
        );
    }
};