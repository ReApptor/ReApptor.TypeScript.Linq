import React from "react";
import { PageContainer, PageHeader, PageRow, Tab, TabContainer, TabRenderType } from "@weare/athenaeum-react-components";
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
import LocationPickerTests from "@/pages/Tests/LocationPickerTests/LocationPickerTests";
import AccordionTests from "@/pages/Tests/AccordionTests/AccordionTests";
import ButtonActionTests from "@/pages/Tests/ButtonActionTests/ButtonActionTests";
import CheckboxTests from "@/pages/Tests/CheckboxTests/CheckboxTests";
import LinkWidgetTests from "@/pages/Tests/LinkWidgetTests/LinkWidgetTests";
import DateInputTests from "@/pages/Tests/DateInputTests/DateInputTests";
import DateRangeInputTests from "@/pages/Tests/DateRangeInputTests/DateRangeInputTests";
import FileInputTests from "@/pages/Tests/FileInputTests/FileInputTests";
import SliderTests from "@/pages/Tests/SliderTests/SliderTests";
import ImageInputTests from "@/pages/Tests/ImageInputTests/ImageInputTests";

export default class Tests extends AnonymousPage {
    
    public getTitle(): string {
        return "Tests";
    }

    public render(): React.ReactNode {
        return (
            <PageContainer  className="tests-page">
                <PageHeader title="Tests" />

                <PageRow>

                    <TabContainer id="TestsTabs" renderType={TabRenderType.ActiveOnly}>
                    
                        <Tab id="buttonTests" title="Button">
                            <ButtonTests />
                        </Tab> 
                        
                        <Tab id="checkboxTests" title="Checkbox">
                            <CheckboxTests />
                        </Tab> 
                        
                        <Tab id="buttonActionTests" title="Button Action">
                            <ButtonActionTests />
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

                        <Tab id="dateRangeInputTests" title="DateRange Input">
                            <DateRangeInputTests />
                        </Tab>

                        <Tab id="dateInputTests" title="Date Input">
                            <DateInputTests />
                        </Tab>  
  
                        <Tab id="numberInputTests" title="Number Input">
                            <NumberInputTests />
                        </Tab>
                        
                        <Tab id="numberWidgetTests" title="Number Widget">
                            <NumberWidgetTests />
                        </Tab>
                        
                        <Tab id="linkWidgetTests" title="Link Widget">
                            <LinkWidgetTests />
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

                        <Tab id="ImageInputTests" title="ImageInput">
                            <ImageInputTests />
                        </Tab>

                        <Tab id="FileInputTests" title="FileInput">
                            <FileInputTests/>
                        </Tab>


                        <Tab id="SliderTests" title="Slider">
                            <SliderTests/>
                        </Tab>

                    </TabContainer>

                </PageRow>

            </PageContainer>
        );
    }
}