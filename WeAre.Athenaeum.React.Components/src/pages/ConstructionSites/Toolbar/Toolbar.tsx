import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import ToolbarContainer from "../../../components/ToolbarContainer/ToolbarContainer";
import Form from "../../../components/Form/Form";
import Dropdown, { DropdownOrderBy } from "../../../components/Form/Inputs/Dropdown/Dropdown";
import TextInput from "../../../components/Form/Inputs/TextInput/TextInput";
import { IconSize } from "@/components/Icon/Icon";
import Button, { ButtonType } from "../../../components/Button/Button";
import Spinner from "../../../components/Spinner/Spinner";
import { SelectListItem } from "@/components/Form/Inputs/Dropdown/SelectListItem";
import ToolbarModel from "./ToolbarModel";
import ToolbarRow from "../../../components/ToolbarContainer/ToolbarRow/ToolbarRow";
import { JustifyContent } from "@/components/Layout/Inline/Inline";
import EnumProvider from "@/providers/EnumProvider";
import Localizer from "../../../localization/Localizer";

import styles from "./Toolbar.module.scss";

interface IToolbarProps  {
    model?: ToolbarModel;
    onChange?(model: ToolbarModel): Promise<void>;
}

interface IToolbarState {
    model: ToolbarModel
}

export default class Toolbar extends BaseComponent<IToolbarProps, IToolbarState> {

    state: IToolbarState = {
        model: this.props.model || new ToolbarModel()
    };
    
    private async processOnChange(invoke: boolean = false): Promise<void> {
        await this.setState({ model: this.state.model });
        if ((invoke) && (this.props.onChange)) {
            await this.props.onChange(this.state.model);
        }
    }

    private async setCustomerAsync(customer: string): Promise<void> {
        this.state.model.customer = customer;
        await this.processOnChange();
    }

    private async setSiteAsync(site: string): Promise<void> {
        this.state.model.site = site;
        await this.processOnChange();
    }

    private async setStatusAsync(item: SelectListItem | null): Promise<void> {
        this.state.model.status = (item) ? parseInt(item.value) : null;
        await this.processOnChange(true);
    }

    private async clearAsync(): Promise<void> {
        this.state.model = new ToolbarModel();
        await this.processOnChange(true);
    }

    public render(): React.ReactNode {
        
        return (
            <ToolbarContainer className={styles.toolbar}>
                
                <ToolbarRow justify={JustifyContent.SpaceBetween}>

                    <Form inline onSubmit={async () => await this.processOnChange(true)}>
                       
                        <TextInput id="customer" inline small
                                   placeholder={Localizer.constructionSitesToolBarCustomerFilter}
                                   value={this.state.model.customer}
                                   width="11rem"
                                   onChange={async (sender, value) => await this.setCustomerAsync(value)}
                        />
    
                        <TextInput id="constructionSite" inline small
                                   placeholder={Localizer.constructionSitesToolBarSiteFilter}
                                   value={this.state.model.site}
                                   width="11rem"
                                   onChange={async (sender, value) => await this.setSiteAsync(value)}
                        />
    
                        <Dropdown inline small noValidate noSubtext noWrap autoCollapse
                                  nothingSelectedText={Localizer.addConstructionsiteToolbarAnyStatus}
                                  minWidth="7rem"
                                  orderBy={DropdownOrderBy.None}
                                  items={EnumProvider.getConstructionSiteStatusItems()}
                                  selectedItem={(this.state.model.status != null) ? EnumProvider.getConstructionSiteStatusItem(this.state.model.status) : undefined}
                                  onChange={async (sender, item) => await this.setStatusAsync(item)}
                        />
    
                        <Button small submit
                                label={Localizer.addConstructionsiteToolbarFilter}
                                icon={{name : "fas search"}}
                                type={ButtonType.Orange}
                        />
    
                        <Button small title={Localizer.addConstructionsiteToolbarClearFilter}
                                icon={{name: "far history", size: IconSize.Large }}
                                type={ButtonType.Info}
                                onClick={async () => await this.clearAsync()}
                        />
    
                    </Form>

                </ToolbarRow>

                {
                    (this.isSpinning()) && <Spinner />
                }
                
            </ToolbarContainer>
        );
    }
};