import React, {ReactNode, Fragment, CSSProperties} from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import Carousel from "@/@weare/athenaeum-react-components/components/Carousel/Carousel";
import {CarouselNavigation, CarouselPagination} from "@/@weare/athenaeum-react-components/components/Carousel/Carousel";
import {Checkbox, Dropdown, DropdownOrderBy, Form, NumberInput, SelectListItem, TwoColumns} from "@/@weare/athenaeum-react-components";

interface ICarouselTestsState {
    loop: boolean;
    navigation: CarouselNavigation;
    pagination: CarouselPagination;
    background: boolean;
    slideCount: number;
    slidesPerView: "auto" | number;
    spaceBetweenSlides: number;
}

export default class CarouselTests extends BaseComponent {

    public state: ICarouselTestsState = {
        loop: false,
        navigation: CarouselNavigation.None,
        pagination: CarouselPagination.None,
        background: false,
        slideCount: 1,
        slidesPerView: "auto",
        spaceBetweenSlides: 0,
    }

    private static getCarouselNavigationEnumName(navigation: CarouselNavigation): string {
        switch (navigation) {
            case CarouselNavigation.Inside:
                return "Inside";
            case CarouselNavigation.Outside:
                return "Outside";
            default:
                return "None";
        }
    }

    private static getCarouselPaginationEnumName(pagination: CarouselPagination): string {
        switch (pagination) {
            case CarouselPagination.BottomInside:
                return "Bottom Inside";
            case CarouselPagination.BottomOutside:
                return "Bottom Outside";
            default:
                return "None";
        }
    }

    private get slides(): ReactNode[] {
        const slides: ReactNode[] = [];
        for (let i = 0; i < this.state.slideCount; i++) {
            const style: CSSProperties = {
                backgroundColor: (i % 2 === 0)
                    ? "white"
                    : "black",
                color: (i % 2 === 1)
                    ? "white"
                    : "black",
                padding: 25,
            }

            slides.push(
                <div key={i}
                     style={style}
                >
                    <h1>Example slide {i + 1}</h1>
                    <p>Hello world!</p>
                </div>
            );
        }
        return slides;
    }

    public render(): ReactNode {
        return (
            <Fragment>

                <Form className="pt-4">

                    <h3>
                        Test helpers
                    </h3>

                    <Checkbox inline className="pt-1 pb-1" label="Background" value={this.state.background} onChange={async (_, background) => {await this.setState({background})}} />

                    <NumberInput inline required noValidate
                                 className="w-25 pt-1 pb-1"
                                 label="Slides"
                                 value={this.state.slideCount}
                                 onChange={async (_, slideCount) => {await this.setState({slideCount})}}
                    />

                    <hr/>

                    <h3>
                        Carousel props
                    </h3>

                    <Checkbox inline className="pt-1 pb-1" label="Loop" value={this.state.loop} onChange={async (_, loop) => {await this.setState({loop})}} />

                    <Dropdown inline required noValidate noWrap noFilter
                              orderBy={DropdownOrderBy.Value}
                              className="pt-1 pb-1"
                              label="Navigation"
                              items={[CarouselNavigation.None, CarouselNavigation.Inside, CarouselNavigation.Outside]}
                              transform={(navigation) => new SelectListItem(navigation.toString(), CarouselTests.getCarouselNavigationEnumName(navigation), null, navigation)}
                              value={CarouselTests.getCarouselNavigationEnumName(this.state.navigation)}
                              onChange={async (_, navigation) => {await this.setState({navigation})}}
                    />

                    <Dropdown inline required noValidate noWrap noFilter
                              orderBy={DropdownOrderBy.Value}
                              className="pt-1 pb-1"
                              label="Pagination"
                              items={[CarouselPagination.None, CarouselPagination.BottomInside, CarouselPagination.BottomOutside]}
                              transform={(pagination) => new SelectListItem(pagination.toString(), CarouselTests.getCarouselPaginationEnumName(pagination), null, pagination)}
                              value={CarouselTests.getCarouselPaginationEnumName(this.state.pagination)}
                              onChange={async (_, pagination) => {await this.setState({pagination})}}
                    />

                    <div style={{backgroundColor: (this.state.background) ? "pink" : "initial"}}>
                        <Carousel loop={this.state.loop}
                                  pagination={this.state.pagination}
                                  navigation={this.state.navigation}
                                  slidesPerView={this.state.slidesPerView}
                                  spaceBetweenSlides={this.state.spaceBetweenSlides}
                        >
                            {this.slides}
                        </Carousel>
                    </div>

                </Form>

            </Fragment>
        );
    }
}