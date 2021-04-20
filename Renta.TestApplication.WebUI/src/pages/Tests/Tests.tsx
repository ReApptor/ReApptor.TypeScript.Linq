import React from "react";
import AnonymousPage from "@/pages/AnonymousPage/AnonymousPage";
import ButtonTests from "@/pages/Tests/ButtonTests/ButtonTests";
import AlertTests from "@/pages/Tests/AlertTests/AlertTests";
import NumberInputTests from "@/pages/Tests/NumberInputTests/NumberInputTests";
import NumberWidgetTests from "@/pages/Tests/NumberWidgetTests/NumberWidgetTests";
import DropdownTests from "@/pages/Tests/DropdownTests/DropdownTests";
import DropdownSelectItemsTests from "@/pages/Tests/DropdownSelectItemsTests/DropdownSelectItemsTests";
import DropdownWidgetTests from "@/pages/Tests/DropdownWidgetTests/DropdownWidgetTests";
import DropdownPerformanceTests from "@/pages/Tests/DropdownPerformanceTests/DropdownPerformanceTests";
import NullableSwitchTests from "@/pages/Tests/NullableSwitchTests/NullableSwitchTests";
import ListTests from "@/pages/Tests/ListTests/ListTests";
import ModalTests from "@/pages/Tests/ModalTests/ModalTests";
import GridTests from "@/pages/Tests/GridTests/GridTests";
import FormTests from "@/pages/Tests/FormTests/FormTests";
import ButtonContainerTests from "@/pages/Tests/ButtonContainerTests/ButtonContainerTests";
import { PageContainer, PageHeader, PageRow, Tab, TabContainer, TabRenderType } from "@weare/athenaeum-react-components";
import LocationPickerTests from "@/pages/Tests/LocationPickerTests/LocationPickerTests";
import AccordionTests from "@/pages/Tests/AccordionTests/AccordionTests";

export default class Tests extends AnonymousPage {
    
    public getTitle(): string {
        return "Tests";
    }

    public render(): React.ReactNode {
        return (
            <PageContainer>
                <PageHeader title="Tests" />

                <PageRow>

                    <TabContainer id="TestsTabs" renderType={TabRenderType.ActiveOnly}>
                    
                        <Tab id="buttonTests" title="Button">
                            <ButtonTests />
                        </Tab>
                    
                        <Tab id="buttonContainerTests" title="Button Container">
                            <ButtonContainerTests />
                        </Tab>
                        
                        <Tab id="alertTests" title="Alerts">
                            <AlertTests />
                        </Tab>
                    
                        <Tab id="gridTest" title="Grids">
                            <GridTests />
                        </Tab>
                        
                        <Tab id="formTests" title="Form">
                            <FormTests />
                        </Tab>
                        
                        <Tab id="numberInputTests" title="Number Input">
                            <NumberInputTests />
                        </Tab>
                        
                        <Tab id="numberWidgetTests" title="Number Widget">
                            <NumberWidgetTests />
                        </Tab>
                        
                        <Tab id="dropdownTests" title="Dropdown">
                            <DropdownTests />
                        </Tab>
                        
                        <Tab id="dropdownPerformanceTests" title="DD Performance">
                            <DropdownPerformanceTests />
                        </Tab>
                        
                        <Tab id="dropdownSelectItemsTests" title="Dropdown (SelectItems)">
                            <DropdownSelectItemsTests />
                        </Tab>
                        
                        <Tab id="dropdownWidgetTests" title="DropdownWidget">
                            <DropdownWidgetTests />
                        </Tab>
                        
                        <Tab id="listTests" title="List">
                            <ListTests />
                        </Tab>
                        
                        <Tab id="nullableSwitchTests" title="Nullable switch">
                            <NullableSwitchTests />
                        </Tab>
                        
                        <Tab id="modalTests" title="Modal">
                            <ModalTests />
                        </Tab>
                        
                        <Tab id="locationPickerTests" title="Location picker">
                            <LocationPickerTests />
                        </Tab>
                        
                        <Tab id="AccordionTests" title="Accordion">
                            <AccordionTests />
                        </Tab>
                    
                    </TabContainer>

                </PageRow>

            </PageContainer>
        );
    }
}