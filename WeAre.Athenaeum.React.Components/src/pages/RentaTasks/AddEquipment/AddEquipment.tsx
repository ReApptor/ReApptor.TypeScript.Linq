import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import DropdownWidget from "../../../components/WidgetContainer/DropdownWidget/DropdownWidget";
import TitleWidget from "../../../components/WizardContainer/TitleWidget/TitleWidget";
import Product from "../../../models/server/Product";
import RentaTasksWizardPage from "../RentaTasksWizardPage";
import {AmountListItem} from "@/components/Form/Inputs/Dropdown/Dropdown";
import WorkOrderEquipment from "../../../models/server/WorkOrderEquipment";
import WorkOrderEquipmentData from "../../../models/server/WorkOrderEquipmentData";
import {SelectListItem} from "@/components/Form/Inputs/Dropdown/SelectListItem";
import WorkOrderModel from "@/models/server/WorkOrderModel";
import TransformProvider from "../../../providers/TransformProvider";
import Localizer from "@/localization/Localizer";

export interface IAddEquipmentProps {
}

interface IAddEquipmentState {
    products: SelectListItem[];
    equipment: AmountListItem[];
}

export default class AddEquipment extends RentaTasksWizardPage<IAddEquipmentProps, IAddEquipmentState> {

    state: IAddEquipmentState = {
        products: [],
        equipment: []
    };

    private async fetchProductsAsync(): Promise<void> {
        
        const products: Product[] = await this.postAsync("api/rentaTasks/getAllProductsData");
        const equipment: WorkOrderEquipmentData[] = this.workOrder.equipments || [];
        
        const equipmentItems: AmountListItem[] = equipment.map(item => this.createEquipmentItem(item, products));
        const productItems: SelectListItem[] = products.map(product => this.transformProduct(product, equipmentItems));

        await this.setState({ products: productItems, equipment: equipmentItems });
    }
    
    private transformProduct(product: Product, equipment: AmountListItem[]): SelectListItem {
        const listItem: SelectListItem = TransformProvider.toSelectListItem(product);
        const index: number = equipment.findIndex(item => product.id === item.value);
        listItem.selected = (index !== -1);
        return listItem;
    }

    private createEquipmentItemFromProduct(product: Product): AmountListItem {
        const item = new AmountListItem();
        item.step = Product.getStep(product);
        item.amount = 1.0;
        item.value = product.id;
        item.text = product.name;
        item.subtext = (product.customUnit) ? product.customUnit : product.unit.toString();
        return item;
    }

    private createEquipmentItem(equipmentData: WorkOrderEquipmentData, products: Product[]): AmountListItem {
        const product: Product | null = equipmentData.product || products.find(item => item.id == equipmentData.productId) || null;
        const item: AmountListItem = this.createEquipmentItemFromProduct(product!);
        item.amount = equipmentData.amount;
        return item;
    }

    private async onChangeAmount(item: AmountListItem, amount: number): Promise<void> {
        if (amount === 0) {
            const productId: string = item.value;
            const equipment: AmountListItem[] = [...this.state.equipment];
            const products: SelectListItem[] = this.state.products;
            let index: number = equipment.findIndex(e => e.value === productId);
            if (index !== -1) {
                equipment.splice(index, 1);
            }
            index = products.findIndex(e => e.value === productId);
            if (index !== -1) {
                products[index].selected = false;
            }
            
            await this.setState({products, equipment});
        }
    }

    private async onChangeProduct(sender: DropdownWidget<SelectListItem>): Promise<void> {
        const products: Product[] = sender.selectedListItems.map(item => item.ref);
        const equipment: AmountListItem[] = this.state.equipment;
        
        const newEquipment: AmountListItem[] = [];
        products.forEach(product => {
            const productId: string = product.id;
            const index: number = equipment.findIndex(item => item.value === productId);
            if (index === -1) {
                const item: AmountListItem = this.createEquipmentItemFromProduct(product);
                newEquipment.push(item);
            } else {
                newEquipment.push(equipment[index]);
            }
        });
        
        await this.setState({equipment: newEquipment});
    }

    private get description(): string {
        return (this.state.equipment.length > 0)
            ? Utility.format(Localizer.rentaTasksAddEquipmentDropdownWidgetSpecifyAmount, this.state.equipment.length)
            : Localizer.rentaTasksAddEquipmentDropdownWidgetNoEquipment;        
    }

    private get workOrder(): WorkOrderModel {
        return this.wizard.workOrder!;
    }
    
    private get equipment(): WorkOrderEquipment[] {
        return this
            .state
            .equipment
            .map((item: AmountListItem) => (
                {
                    productId: item.value,
                    amount: item.amount
                } as WorkOrderEquipment));
    }
    
    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();
        
        await this.fetchProductsAsync();
    }

    public async nextAsync(): Promise<void> {
        
        this.wizard.equipment = this.equipment;
        this.saveContext();
        
        await super.nextAsync();
    }

    protected getNoToggle(): boolean {
        return false;
    }

    public getManual(): string {
        return Localizer.rentaTasksAddEquipmentManual;
    }

    public renderContent(): React.ReactNode {
        return (
            <React.Fragment>
                
                <TitleWidget model={this.title} wide />
                
                <DropdownWidget id="Equipment" wide
                                icon={{name: "fas tools"}}
                                label={Localizer.addEquipmentEquipmentList}
                                description={this.description}
                                items={this.state.equipment}
                                onChangeAmount={async (_, item: AmountListItem, amount: number) => await this.onChangeAmount(item, amount)}
                />

                <DropdownWidget id="AllProducts" wide multiple groupSelected
                                icon={{name: "fas rocket"}}
                                label={Localizer.addEquipmentProducts}
                                description={Localizer.addEquipmentProductsDescription}
                                items={this.state.products}
                                onChange={async (sender) => await this.onChangeProduct(sender)}
                />

            </React.Fragment>
        );
    }
}