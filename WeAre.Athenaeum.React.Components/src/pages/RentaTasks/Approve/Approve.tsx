import React from "react";
import TitleWidget, {ITitleModel} from "../../../components/WizardContainer/TitleWidget/TitleWidget";
import DropdownWidget from "../../../components/WidgetContainer/DropdownWidget/DropdownWidget";
import SignatureWidget from "../../../components/WidgetContainer/SignatureWidget/SignatureWidget";
import RentaTasksWizardPage from "../RentaTasksWizardPage";
import {CustomerApprovalType} from "@/models/Enums";
import {DropdownOrderBy} from "@/components/Form/Inputs/Dropdown/Dropdown";
import EnumProvider from "@/providers/EnumProvider";
import Localizer from "@/localization/Localizer";

interface ISignatureProps {
}

interface ISignatureState {
    approvalType: CustomerApprovalType
}

export default class Signature extends RentaTasksWizardPage<ISignatureProps, ISignatureState> {
    
    state: ISignatureState = {
        approvalType: this.wizard.approvalType
    };
    
    private readonly SignatureId = "Signature";
    
    private get signatureWidget(): SignatureWidget | null {
        return this.findWidget(this.SignatureId);
    }
    
    private async setApprovalTypeAsync(approvalType: CustomerApprovalType): Promise<void> {
        if (approvalType !== this.approvalType) {

            this.wizard.approvalType = approvalType;
            this.saveContext();

            await this.setState({ approvalType });
            
            if ((this.signature) && (this.signatureWidget)) {
                await this.signatureWidget!.showContentAsync();
            }
            
            await this.validateAsync();
        }
    }

    protected getNoToggle(): boolean {
        return true;
    }
    
    protected get canNext(): boolean {
        return ((!this.signature) || (this.hasSignature));
    }
    
    public get approvalType(): CustomerApprovalType {
        return this.state.approvalType;
    }

    public get signature(): boolean {
        return (this.approvalType === CustomerApprovalType.Signature);
    }
    
    public get hasSignature(): boolean {
        return (this.signature) && (this.signatureWidget != null) && (this.signatureWidget!.canvasData != null);
    }
    
    public get signatureSrc(): string | null {
        return (this.hasSignature) ? this.signatureWidget!.canvasData : null;
    }

    public async nextAsync(): Promise<void> {
        this.wizard.signatureSrc = this.signatureSrc;
        this.saveContext();
        await super.nextAsync();
    }
    
    public getManual(): string {
        return Localizer.signatureGetManual;
    }

    public renderContent(): React.ReactNode {
        return (
            <React.Fragment>

                <TitleWidget model={this.title} wide />

                <DropdownWidget wide required autoCollapse
                                icon={{ name: "fas tools" }}
                                orderBy={DropdownOrderBy.None}
                                label={Localizer.signatureApprovalType} description={Localizer.signatureApprovalTypeDescription}
                                selectedItem={EnumProvider.getCustomerApprovalTypeItem(this.approvalType)}
                                items={EnumProvider.getCustomerApprovalTypeItems()}
                                onChange={async (_, item) => await this.setApprovalTypeAsync(parseInt(item!.value))} />

                { (this.signature) && <SignatureWidget id={this.SignatureId} wide label={Localizer.signatureSignature} description={Localizer.signatureSignatureDescription} onSign={async () => await this.nextAsync()} /> }

            </React.Fragment>
        );
    }
}