import React from "react";
import { PageContainer, PageHeader, PageRow, Tab, TabContainer, TabRenderType } from "@weare/athenaeum-react-components";

import CarouselTests from "./CarouselTests/CarouselTests";
import AnonymousPage from "../AnonymousPage/AnonymousPage";
import NumberWidgetTests from "./NumberWidgetTests/NumberWidgetTests";
import ButtonContainerTests from "./ButtonContainerTests/ButtonContainerTests";
import ButtonTests from "./ButtonTests/ButtonTests";
import MessageBoxTests from "./MessageBoxTests/MessageBoxTests";
import DateRangeInputTests from "./DateRangeInputTests/DateRangeInputTests";
import DropdownPerformanceTests from "./DropdownPerformanceTests/DropdownPerformanceTests";
import NumberInputTests from "./NumberInputTests/NumberInputTests";
import FileInputTests from "./FileInputTests/FileInputTests";
import ListTests from "./ListTests/ListTests";
import ModalTests from "./ModalTests/ModalTests";
import DropdownWidgetTests from "./DropdownWidgetTests/DropdownWidgetTests";
import AccordionTests from "./AccordionTests/AccordionTests";
import ImageInputTests from "./ImageInputTests/ImageInputTests";
import AlertTests from "./AlertTests/AlertTests";
import LinkWidgetTests from "./LinkWidgetTests/LinkWidgetTests";
import NullableSwitchTests from "./NullableSwitchTests/NullableSwitchTests";
import ButtonActionTests from "./ButtonActionTests/ButtonActionTests";
import DropdownTests from "./DropdownTests/DropdownTests";
import CheckboxTests from "./CheckboxTests/CheckboxTests";
import FormTests from "./FormTests/FormTests";
import DropdownSelectItemsTests from "./DropdownSelectItemsTests/DropdownSelectItemsTests";
import LocationPickerTests from "./LocationPickerTests/LocationPickerTests";
import SliderTests from "./SliderTests/SliderTests";
import GridTests from "./GridTests/GridTests";
import DateInputTests from "./DateInputTests/DateInputTests";
import PaginationTests from "./PaginationTests/PaginationTests";
import SignatureWidgetTests from "./SignatureWidgetTests/SignatureWidgetTests";
import QrWidgetTests from "./QrWidgetTests/QrWidgetTests";

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

                        <Tab id="messageBoxTests" title="MessageBox">
                            <MessageBoxTests />
                        </Tab>

                        <Tab id="gridTest" title="Grids">
                            <GridTests />
                        </Tab>


                        <Tab id="paginationTests" title="Pagination">
                            <PaginationTests />
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

                        <Tab id="CarouselTests" title="Carousel">
                            <CarouselTests/>
                        </Tab>

                        <Tab id="SliderTests" title="Slider">
                            <SliderTests/>
                        </Tab>

                        <Tab id="SignatureWidgetTests" title="Signature Widget">
                            <SignatureWidgetTests />
                        </Tab>

                        <Tab id="QrWidgetTest" title="Qr Widget">
                            <QrWidgetTests />
                        </Tab>

                    </TabContainer>

                </PageRow>

            </PageContainer>
        );
    }
}
