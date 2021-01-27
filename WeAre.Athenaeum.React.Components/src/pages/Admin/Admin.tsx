import React from "react";
import {Utility, TimeSpan, GeoLocation} from "@weare/athenaeum-toolkit";
import {AlertModel, AlertType, ch, TextAlign, VerticalAlign} from "@weare/athenaeum-react-common";
import {ILanguage} from "@weare/athenaeum-toolkit";
import PageRow from "../../components/PageContainer/PageRow/PageRow";
import AuthorizedPage from "../../models/base/AuthorizedPage";
import PageContainer from "../../components/PageContainer/PageContainer";
import User from "../../models/server/User";
import TwoColumns from "../../components/Layout/TwoColumn/TwoColumns";
import TextInput from "../../components/Form/Inputs/TextInput/TextInput";
import List from "../../components/List/List";
import Form from "../../components/Form/Form";
import EmailInput from "../../components/Form/Inputs/EmailInput/EmailInput";
import Dropdown, {DropdownOrderBy} from "../../components/Form/Inputs/Dropdown/Dropdown";
import ButtonContainer from "../../components/ButtonContainer/ButtonContainer";
import Button, {ButtonType} from "../../components/Button/Button";
import Tab from "../../components/TabContainer/Tab/Tab";
import TabContainer from "../../components/TabContainer/TabContainer";
import Setting from "../../models/server/Setting";
import {CellModel, ColumnDefinition, ColumnType} from "@/components/Grid/GridModel";
import Grid from "../../components/Grid/Grid";
import UserRole from "../../models/server/UserRole";
import PageHeader from "../../components/PageContainer/PageHeader/PageHeader";
import AddressDivider from "../../components/Form/Inputs/AddressInput/AddressDivider/AddressDivider";
import Checkbox from "../../components/Form/Inputs/Checkbox/Checkbox";
import ToolbarContainer from "../../components/ToolbarContainer/ToolbarContainer";
import Inline from "../../components/Layout/Inline/Inline";
import ToolbarButton from "../../components/ToolbarContainer/ToolbarButton/ToolbarButton";
import SaveUserRequest from "../../models/server/requests/SaveUserRequest";
import OrganizationContract from "../../models/server/OrganizationContract";
import {AuthType, LoginResultStatus, UserRoleGroup} from "@/models/Enums";
import {IconSize} from "@/components/Icon/Icon";
import DeleteUserResponse from "@/models/server/responses/DeleteUserResponse";
import Alert from "@/components/Alert/Alert";
import PhoneInput from "@/components/Form/Inputs/PhoneInput/PhoneInput";
import {SelectListItem} from "@/components/Form/Inputs/Dropdown/SelectListItem";
import UserInvitation from "@/models/server/UserInvitation";
import SaveUserResponse from "@/models/server/responses/SaveUserResponse";
import GetUsersRequest from "@/models/server/requests/GetUsersRequest";
import TransformProvider from "@/providers/TransformProvider";
import EnumProvider from "@/providers/EnumProvider";
import Localizer from "../../localization/Localizer";

import styles from "../Admin/Admin.module.scss";

interface IAdminProps {
    organizationContracts: OrganizationContract[] | null;
}

interface IAdminState {
    filterShowDeleted: boolean;
    filterRoleNames: string[];
    settingsModified: boolean;
    user: User | null;
    prevUser: User | null;
    roles: UserRole[];
    showAddButton: boolean;
    isModified: boolean;
    organizationContracts: OrganizationContract[];
}

export default class Admin extends AuthorizedPage<IAdminProps, IAdminState> {

    public getTitle(): string {
        return Localizer.topNavAdmin;
    }

    state: IAdminState = {
        filterShowDeleted: false,
        filterRoleNames: [],
        user: null,
        prevUser: null,
        roles: [],
        showAddButton: true,
        settingsModified: true,
        isModified: false,
        organizationContracts: [],
    };

    private readonly _settingsGridRef: React.RefObject<Grid<Setting>> = React.createRef();
    private readonly _listRef: React.RefObject<List<User>> = React.createRef();
    private readonly _emailRef: React.RefObject<EmailInput> = React.createRef();
    private _originalUser: User | null = null;

    private readonly _invitationColumns: ColumnDefinition[] = [
        {
            header: Localizer.adminGridCreatedByLanguageItemName,
            accessor: "createdBy",
            minWidth: 100
        } as ColumnDefinition,
        {
            header: Localizer.adminGridTypeLanguageItemName,
            accessor: "type",
            type: ColumnType.Custom,
            format: "InvitationType",
            minWidth: 90
        } as ColumnDefinition,
        {
            header: Localizer.adminGridAuthTypeLanguageItemName,
            accessor: "authType",
            type: ColumnType.Custom,
            format: "AuthType",
            minWidth: 90,
        } as ColumnDefinition,
        {
            header: Localizer.adminGridCreatedAtLanguageItemName,
            accessor: "createdAt",
            format: "D",
            textAlign: TextAlign.Center,
            minWidth: 90,
            verticalAlign: VerticalAlign.Middle
        } as ColumnDefinition,
        {
            header: Localizer.adminGridExpiresAtLanguageItemName,
            accessor: "validTill",
            format: "D",
            textAlign: TextAlign.Center,
            minWidth: 90,
            init: (cell) => this.initValidTill(cell)
        } as ColumnDefinition,
        {
            header: Localizer.adminGridProcessedAtLanguageItemName,
            accessor: "processedAt",
            format: "D",
            textAlign: TextAlign.Center,
            minWidth: 90
        } as ColumnDefinition,
        {
            header: Localizer.adminGridReusableLanguageItemName,
            accessor: (model: UserInvitation) => model.reusable ? "✓" : "",
            textAlign: TextAlign.Center,
            minWidth: 90
        } as ColumnDefinition
    ];

    private readonly _columns: ColumnDefinition[] = [
        {
            header: Localizer.adminSettingsKeyLanguageItemName,
            accessor: "key",
            transform: (cell): string => this.transformKeyCell(cell),
            minWidth: 300,
        } as ColumnDefinition,
        {
            header: Localizer.adminSettingsValueLanguageItemName,
            accessor: "value",
            editable: true,
            type: ColumnType.Text,
            minWidth: 150,
            callback: async (cell) => await this.onChangeSettingsAsync(cell)
        } as ColumnDefinition
    ];

    private get settings(): Setting[] {
        return this.settingsGrid.model.items;
    }

    private get hasSettingsAccess(): boolean {
        const user: User | null = this.findUser();
        return (user != null) && ((user.isAdmin) || (user.isSiteAdmin));
    }

    private initValidTill(cell: CellModel<UserInvitation>): void {
        const model: UserInvitation = cell.row.model;
        const diff: TimeSpan = Utility.diff(model.validTill, Utility.utcNow());
        const expired: boolean = (diff.totalMilliseconds < 0);
        if (expired) {
            cell.className = "danger";
        }
    }

    private transformKeyCell(cell: CellModel<Setting>): string {
        const setting: Setting = cell.model;

        const key: string = setting.key;

        return Localizer.get(`KnownSettings.${key}`);
    }

    private async cancelModifyingAsync(): Promise<void> {
        Utility.copyTo(this._originalUser, this.user);
        await this.setIsModified(false);
    }

    private async setSelectedUser(selectedUser: User | null): Promise<void> {
        if (this.user !== selectedUser) {
            if (this.state.showAddButton) {
                await this.setState({user: selectedUser, prevUser: null, showAddButton: true});
            }

            this._originalUser = Utility.clone(selectedUser);
        }
    }

    private get userFullName(): string {
        return (this.user) ? TransformProvider.userToString(this.user) : "";
    }

    private async handleSettingsSubmitAsync(): Promise<void> {

        await this.postAsync("api/admin/SaveSettings", this.settings);

        await this.alertMessageAsync(Localizer.adminSettingsSaved, true);
    }

    private async saveAsync(): Promise<void> {

        const user: User = this.user!;
        const newUser: boolean = (!user.id);

        const request = new SaveUserRequest();
        request.id = user.id;
        request.authType = user.authType;
        request.roleName = user.role.roleName;
        request.email = user.email;
        request.phone = user.phone;
        request.firstname = user.firstname;
        request.lastName = user.lastName;
        request.middleName = user.middleName;
        request.language = user.language;
        request.formattedAddress = (user.homeLocation) ? user.homeLocation.formattedAddress : "";
        request.agreementAccepted = this.user!.agreementAccepted;
        request.registrationAccepted = this.user!.registrationAccepted;

        if (this.isContactPersonRole) {
            request.organizationContractIds = user.roles.map(item => item.organizationContractId);
        }

        const response: SaveUserResponse = await this.postAsync("api/admin/saveUser", request);

        if (response.userAlreadyExists) {
            const message: string = Utility.format(Localizer.adminAlertErrorAccountExist, this.userFullName);
            await this.alertErrorAsync(message, true);
            return;
        }

        if (response.idCardRfcCodeAlreadyExists) {
            const message: string = Utility.format(Localizer.adminAlertErrorWorkCardIdExists, this.user!.workCardId);
            await this.alertErrorAsync(message, true);
            return;
        }

        if (response.invitationSentFailed) {
            const message: string = Utility.format(Localizer.adminAlertErrorPhoneNumberInvalid, this.userFullName);
            await this.alertErrorAsync(message, true);
            return;
        }

        const message: string = Utility.format(Localizer.adminAlertMessageAccountSaved, this.userFullName);
        await this.alertMessageAsync(message, true);

        const responseUser: User = response.user!;

        this._originalUser = responseUser!;

        if (newUser) {

            await this.list.reloadAsync();

            await this.setState({user: responseUser, showAddButton: true, isModified: false});

            this.list.scrollToSelected();

        } else {
            await this.setIsModified(false);

            await this.list.reRenderAsync();
        }
    }

    private async resetPasswordAsync(): Promise<void> {
        const userId: string = this.user!.id;
        await this.postAsync<LoginResultStatus>("api/admin/ResetPassword", userId);
        await this.list.reloadAsync();
        await this.list.reRenderAsync();
    }

    private async setFilterShowDeletedAsync(filterShowDeleted: boolean): Promise<void> {
        await this.setState({filterShowDeleted});
        await this.list.reloadAsync();
    }

    private async setFilterRoleNamesAsync(filterRoles: UserRole[]): Promise<void> {
        const filterRoleNames: string[] = filterRoles.map(item => item.roleName);
        await this.setState({filterRoleNames});
        await this.list.reloadAsync();
    }

    private async addUserAsync(): Promise<void> {
        const prevUser: User | null = this.user;

        const user = new User();
        user.language = Localizer.language;
        user.role = this.state.roles[0];

        await this.setState({user, prevUser, showAddButton: false});

        if (this._emailRef.current) {
            this._emailRef.current.focus();
        }
    }

    private async resendInvitationAsync(): Promise<void> {
        const userId: string = this.user!.id;
        await this.postAsync("api/admin/resendInvitation", userId);
        await this.list.reloadAsync();
        await this.list.reRenderAsync();
    }

    private async setIsModified(isModified = true, forceReRender: boolean = false): Promise<void> {
        isModified = isModified && this.state.showAddButton;
        if ((forceReRender) || (isModified !== this.state.isModified)) {
            await this.setState({isModified});
        }
    }

    private get isModified(): boolean {
        return this.state.isModified;
    }

    private async setPhone(value: string): Promise<void> {
        this.user!.phone = value;
        await this.setIsModified();
    }

    private async setEmail(value: string): Promise<void> {
        this.user!.email = value;
        await this.setIsModified();
    }

    private async setAuthType(item: SelectListItem, userInteration: boolean): Promise<void> {
        if (userInteration) {
            await this.setIsModified();
        }

        const user: User = this.user!;
        user.authType = parseInt(item.value);
        await this.reRenderAsync();
    }

    public get alert(): AlertModel {
        const alertModel = new AlertModel();
        alertModel.message = Utility.format(Localizer.adminAlertUserPasswordInfo, this.userFullName);
        alertModel.dismissible = false;
        alertModel.alertType = AlertType.Info;
        return alertModel;
    }

    public async deleteUserAsync(): Promise<void> {
        const user: User = this.user!;

        const response: DeleteUserResponse = await this.postAsync("api/admin/deleteUser", user.id);

        const message: string = (response.removedPermanently)
            ? Utility.format(Localizer.adminUserDeletedPermanently, this.userFullName)
            : Utility.format(Localizer.get(Localizer.adminUserDeleted, this.userFullName));

        await this.alertMessageAsync(message, true);

        if (!this.filterShowDeleted || response.removedPermanently) {
            await this.setState({user: null});

            await this.list.reloadAsync();

            this.list.scrollToSelected();
        } else {
            user.isDeleted = true;

            await this.list.reRenderAsync();

            await this.reRenderAsync();
        }
    }

    private async restoreUserAsync(): Promise<void> {
        const user: User = this.user!;

        await this.postAsync("api/admin/restoreUser", user.id);

        user.isDeleted = false;

        await this.alertMessageAsync(Localizer.get(Localizer.adminUserRestored, user.email), true);

        await this.list.reRenderAsync();

        await this.reRenderAsync();
    }

    private async unlockUserAsync(): Promise<void> {
        const user: User = this.user!;

        await this.postAsync("api/admin/unlockUser", user.id);

        user.isLocked = false;

        const message: string = Utility.format(Localizer.adminAlertMessageUnlockUser, this.userFullName);

        await this.alertMessageAsync(message, true);

        await this.list.reRenderAsync();

        await this.reRenderAsync();
    }

    private async cancelAddUserAsync() {
        await this.setState({user: this.state.prevUser, prevUser: null, showAddButton: true});
    }

    private get canDelete(): boolean {
        const me: boolean = (ch.getUser().id == this.user!.id);
        return !me;
    }

    private async getUsersAsync(sender: List<User>): Promise<User[]> {
        const request = new GetUsersRequest();
        request.showDeleted = this.filterShowDeleted;
        request.roleNames = this.filterRoleNames;
        return await sender.postAsync("api/admin/getUsers", request);
    }

    private async onFirstNameChangeAsync(item: string) {
        const user = this.user;
        user!.firstname = item;
        await this.setIsModified();
    }

    private async onLastNameChangeAsync(item: string) {
        const user = this.user;
        user!.lastName = item;
        await this.setIsModified();
    }

    private async onMiddleNameChangeAsync(item: string) {
        const user = this.user;
        user!.middleName = item;
        await this.setIsModified();
    }

    private async onAddressChangeAsync(item: GeoLocation) {
        const user = this.user;
        user!.homeLocation = item;
        await this.setIsModified();
    }

    private async setUserRole(userRole: UserRole, userInteraction: boolean): Promise<void> {
        if (userInteraction) {
  
            this.user!.role = userRole;


            await this.setIsModified(true, true);
        }
    }

    private async setLanguage(language: ILanguage, userInteraction: boolean): Promise<void> {
        this.user!.language = language.code;

        if (userInteraction) {
            await this.setIsModified();
        }
    }

    private async getSettingsAsync(grid: Grid<Setting>): Promise<Setting[]> {
        return await grid.getAsync("api/admin/listSettings");
    }

    private async onChangeSettingsAsync(cell: CellModel): Promise<void> {
        const settingsModified: boolean = cell.grid.modified;
        await this.setState({settingsModified});
    }

    private get isContactPersonRole(): boolean {
        return (this.user != null) && (this.user.role.roleName == "ContactPerson");
    }

    private async setRoleContractsAsync(contracts: OrganizationContract[], userInteraction: boolean): Promise<void> {
        if (this.user != null) { //&& (this.user.role.organizationContractId != contract.id)) {
            const roleName: string = this.user.role.roleName;
            const group: UserRoleGroup = this.user.role.group;
            this.user.roles = contracts.map(contract => new UserRole(roleName, contract.id, group));

            if (userInteraction) {
                await this.setIsModified();
            }
        }
    }

    private get organizationContracts(): OrganizationContract[] {
        return this.state.organizationContracts;
    }

    private get user(): User | null {
        return this.state.user;
    }

    private get list(): List<User> {
        return this._listRef.current!;
    }

    private get settingsGrid(): Grid<Setting> {
        return this._settingsGridRef.current!;
    }

    private get filterShowDeleted(): boolean {
        return this.state.filterShowDeleted;
    }

    private get filterRoleNames(): string[] {
        return this.state.filterRoleNames;
    }

    private get isEmailRequired(): boolean {
        return ((this.user != null) && ((this.user.authType == AuthType.Email) || (this.user.role.roleName == "ContactPerson")));
    }

    private get isPhoneRequired(): boolean {
        return ((this.user != null) && ((this.user.authType == AuthType.Phone) || (this.user.role.roleName == "ContactPerson")));
    }

    public async initializeAsync(): Promise<void> {

        const roles: UserRole[] = await this.getAsync("api/admin/getUserRoles");

        const organizationContracts: OrganizationContract[] = await this.postCacheAsync("api/admin/getActiveCustomers", 60000);

        await this.setState({roles, organizationContracts});
    }

    public render(): React.ReactNode {
        return (
            <PageContainer className={styles.admin} fullHeight>
                <PageHeader title={Localizer.adminHeaderTitle} withTabs/>

                <PageRow>
                    <div className="col">
                        <TabContainer id="adminManagementTabs" scale>

                            <Tab id="accounts" title={Localizer.adminUsersTab}>

                                <ToolbarContainer>

                                    <Form inline className="d-flex">

                                        <Dropdown id="roleNameFilter"
                                                  inline noWrap multiple autoCollapse
                                                  minWidth={210}
                                                  nothingSelectedText={Localizer.adminChooseRole}
                                                  label={Localizer.formInputRole}
                                                  orderBy={DropdownOrderBy.None}
                                                  items={this.state.roles}
                                                  onChange={async (sender) => await this.setFilterRoleNamesAsync(sender.selectedItems)}
                                        />

                                        <Checkbox inline
                                                  label={Localizer.adminShowDeleted}
                                                  value={this.filterShowDeleted}
                                                  onChange={async (sender, value) => await this.setFilterShowDeletedAsync(value)}
                                        />

                                    </Form>

                                    <Inline>

                                        <ToolbarButton label={Localizer.adminAddUser}
                                                       icon={{name: "plus", size: IconSize.Large}}
                                                       type={ButtonType.Orange}
                                                       disabled={!this.state.showAddButton || this.isModified}
                                                       onClick={async () => await this.addUserAsync()}
                                        />

                                    </Inline>

                                </ToolbarContainer>

                                <div className="row h-100">

                                    <div className="col-md-4">

                                        <List id="users" ref={this._listRef} required noGrouping absoluteListItems
                                              maxHeight={"auto"}
                                              disabled={!this.state.showAddButton || this.isModified}
                                              orderBy={DropdownOrderBy.None}
                                              filterMinLength={10}
                                              fetchItems={async (sender) => await this.getUsersAsync(sender)}
                                              selectedItem={this.user || undefined}
                                              onChange={async (_, item) => await this.setSelectedUser(item)}
                                        />

                                    </div>

                                    <div className="col-md-8">

                                        {
                                            (this.user != null) &&
                                            (
                                                <TabContainer id="userManagementTabs">

                                                    <Tab id="account" title={Localizer.topNavAccount}>

                                                        <Form id="form" onSubmit={async () => await this.saveAsync()}>

                                                            <TwoColumns>

                                                                <Dropdown id="authType" required noSubtext
                                                                          label={Localizer.adminLabelAuthenticationType}
                                                                          disabled={!!this.user.id}
                                                                          orderBy={DropdownOrderBy.None}
                                                                          items={EnumProvider.getAuthTypeItems()}
                                                                          selectedItem={EnumProvider.getAuthTypeItem(this.user.authType)}
                                                                          onChange={async (sender, item, userInteraction) => await this.setAuthType(item!, userInteraction)}
                                                                />

                                                                <Dropdown id="roleName" required
                                                                          nothingSelectedText={Localizer.adminChooseRole}
                                                                          label={Localizer.formInputRole}
                                                                          orderBy={DropdownOrderBy.None}
                                                                          value={this.user.role.roleName}
                                                                          items={this.state.roles}
                                                                          selectedItem={this.user.role}
                                                                          onChange={(sender, item, userInteraction) => this.setUserRole(item!, userInteraction)}
                                                                />

                                                            </TwoColumns>

                                                            <TwoColumns>

                                                                {
                                                                    (this.isContactPersonRole) &&
                                                                    (
                                                                        <Dropdown id="organizationContractIds" required multiple noWrap noSubtext groupSelected autoCollapse
                                                                                  label={Localizer.adminOrganizationContractsLabel}
                                                                                  filterMaxLength={10000000}
                                                                                  items={this.organizationContracts}
                                                                                  selectedItems={this.user.roles.map(item => item.organizationContractId)}
                                                                                  onChange={(sender, item, userInteraction) => this.setRoleContractsAsync(sender.selectedItems, userInteraction)}
                                                                        />
                                                                    )
                                                                }

                                                            </TwoColumns>

                                                            <TwoColumns>

                                                                <EmailInput id="email" ref={this._emailRef}
                                                                            label={Localizer.formInputEmail}
                                                                            required={this.isEmailRequired}
                                                                            value={this.user.email}
                                                                            readonly={(this.user.authType == AuthType.Email) && (!!this.user.id)}
                                                                            onChange={async (sender, value) => await this.setEmail(value)}
                                                                />

                                                                <PhoneInput id="phone"
                                                                            label={Localizer.formInputPhone}
                                                                            required={this.isPhoneRequired}
                                                                            value={this.user.phone}
                                                                            readonly={(this.user.authType == AuthType.Phone) && (!!this.user.id)}
                                                                            onChange={async (sender, value) => await this.setPhone(value)}
                                                                />

                                                            </TwoColumns>

                                                            <TwoColumns>
                                                                
                                                                <TextInput id="firstname" label={Localizer.formInputFirstname}
                                                                           value={this.user.firstname} required
                                                                           onChange={async (sender, item) => await this.onFirstNameChangeAsync(item!)}
                                                                />
                                                                
                                                                <TextInput id="lastName"
                                                                           onChange={async (sender, item) => await this.onLastNameChangeAsync(item!)}
                                                                           label={Localizer.formInputLastname}
                                                                           value={this.user.lastName} required
                                                                />
                                                                
                                                            </TwoColumns>

                                                            <TwoColumns>
                                                                
                                                                <TextInput id="middleName"
                                                                           label={Localizer.formInputMiddlename}
                                                                           onChange={async (sender, item) => await this.onMiddleNameChangeAsync(item!)}
                                                                           value={this.user.middleName}
                                                                />

                                                                <Dropdown
                                                                    id="language" required
                                                                    label={Localizer.formInputLanguage}
                                                                    items={Localizer.supportedLanguages}
                                                                    selectedItem={Localizer.findLanguage(this.user.language)}
                                                                    onChange={async (sender, item, userInteraction) => await this.setLanguage(item!, userInteraction)}
                                                                />

                                                            </TwoColumns>

                                                            <AddressDivider id="formattedAddress"
                                                                            onChange={async (sender, item) => await this.onAddressChangeAsync(item!)}
                                                                            location={this.user.homeLocation || undefined}
                                                            />

                                                            <ButtonContainer>

                                                                {
                                                                    (!this.state.showAddButton) &&
                                                                    (
                                                                        <Button small
                                                                                minWidth={90}
                                                                                label={Localizer.genericCancel}
                                                                                type={ButtonType.Primary}
                                                                                icon={{name: "far ban", size: IconSize.Large}}
                                                                                onClick={async () => await this.cancelAddUserAsync()}
                                                                        />
                                                                    )
                                                                }

                                                                {
                                                                    (this.isModified) &&
                                                                    (
                                                                        <Button small
                                                                                minWidth={90}
                                                                                label={Localizer.genericCancel}
                                                                                type={ButtonType.Primary}
                                                                                icon={{name: "far ban", size: IconSize.Large}}
                                                                                confirm={Localizer.adminConfirmationButtonRollback}
                                                                                onClick={async () => await this.cancelModifyingAsync()}
                                                                        />
                                                                    )
                                                                }

                                                                {
                                                                    ((this.state.showAddButton) && (!this.user.isDeleted)) &&
                                                                    (
                                                                        <Button small
                                                                                minWidth={90}
                                                                                label={Localizer.adminButtonDelete}
                                                                                icon={{name: "trash-alt", size: IconSize.Large}}
                                                                                type={ButtonType.Primary}
                                                                                disabled={!this.canDelete || this.isModified}
                                                                                onClick={async () => await this.deleteUserAsync()}
                                                                                confirm={Utility.format(Localizer.adminConfirmationButtonDeleteUser, this.userFullName)}
                                                                        />
                                                                    )
                                                                }

                                                                {
                                                                    ((this.state.showAddButton) && (this.user.isDeleted)) &&
                                                                    (
                                                                        <Button small
                                                                                minWidth={90}
                                                                                label={Localizer.adminButtonRestore}
                                                                                icon={{name: "trash-restore", size: IconSize.Large}}
                                                                                type={ButtonType.Primary}
                                                                                onClick={async () => await this.restoreUserAsync()}
                                                                                confirm={Utility.format(Localizer.adminConfirmationButtonRestoreUser, this.userFullName)}
                                                                        />
                                                                    )
                                                                }

                                                                {
                                                                    ((this.state.showAddButton) && (!this.user.isDeleted) && (this.user.isLocked)) &&
                                                                    (
                                                                        <Button small
                                                                                minWidth={90}
                                                                                label={Localizer.adminButtonUnlock}
                                                                                icon={{name: "unlock", size: IconSize.Large}}
                                                                                type={ButtonType.Success}
                                                                                onClick={async () => await this.unlockUserAsync()}
                                                                                confirm={Utility.format(Localizer.adminConfirmationButtonUnlockUser, this.userFullName)}
                                                                        />
                                                                    )
                                                                }

                                                                <Button type={ButtonType.Orange} icon={{name: "far save"}} label={Localizer.formSave} submit/>

                                                            </ButtonContainer>

                                                        </Form>

                                                    </Tab>

                                                    {
                                                        (this.state.showAddButton) &&
                                                        (

                                                            <Tab id="invitations" title={Localizer.adminTabInvitations}>

                                                                <div className={styles.passwordInfo}>
                                                                    {
                                                                        (!this.user.hasPassword) &&
                                                                        (
                                                                            <Alert model={this.alert}/>
                                                                        )
                                                                    }
                                                                </div>

                                                                <div className={styles.invitations}>

                                                                    <Grid columns={this._invitationColumns}
                                                                          data={this.user.invitations}
                                                                          noDataText={Localizer.adminGridNoInvitationsText}
                                                                    />

                                                                </div>

                                                                <ButtonContainer>

                                                                    <Button small
                                                                            minWidth={90}
                                                                            label={Localizer.adminButtonResendInvitation}
                                                                            icon={{name: "envelope", size: IconSize.Large}}
                                                                            disabled={this.user.isDeleted || this.user.isLocked || this.user.hasPassword}
                                                                            type={ButtonType.Primary}
                                                                            onClick={async () => await this.resendInvitationAsync()}
                                                                            confirm={Utility.format(Localizer.adminConfirmationButtonResendInvitation, this.userFullName)}
                                                                    />

                                                                    <Button small
                                                                            minWidth={90}
                                                                            label={Localizer.adminButtonResetPassword}
                                                                            icon={{name: "repeat", size: IconSize.Large}}
                                                                            disabled={this.user.isDeleted || this.user.isLocked || !this.user.hasPassword}
                                                                            type={ButtonType.Success}
                                                                            onClick={async () => await this.resetPasswordAsync()}
                                                                            confirm={Utility.format(Localizer.adminConfirmationButtonResetPassword, this.userFullName)}
                                                                    />

                                                                </ButtonContainer>

                                                            </Tab>
                                                        )
                                                    }

                                                </TabContainer>
                                            )
                                        }

                                    </div>

                                </div>

                            </Tab>

                            <Tab id="system" title={Localizer.adminSettingsTab}>

                                <Form id="form" onSubmit={async () => await this.handleSettingsSubmitAsync()}>

                                    <div>

                                        <Grid id="settings" ref={this._settingsGridRef}
                                              minWidth={400}
                                              readonly={!this.hasSettingsAccess}
                                              columns={this._columns}
                                              fetchData={async (sender) => await this.getSettingsAsync(sender)}
                                        />

                                    </div>

                                    <ButtonContainer>

                                        {
                                            (this.hasSettingsAccess) &&
                                            (
                                                <Button disabled={!this.state.settingsModified} type={ButtonType.Orange} icon={{name: "far save"}} label={Localizer.formSave} submit/>
                                            )
                                        }

                                    </ButtonContainer>

                                </Form>

                            </Tab>

                        </TabContainer>
                    </div>
                </PageRow>

            </PageContainer>
        );
    }
}