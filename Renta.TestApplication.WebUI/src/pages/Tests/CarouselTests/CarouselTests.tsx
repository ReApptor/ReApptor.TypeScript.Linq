import React, {ReactNode, Fragment, CSSProperties} from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {Checkbox, Dropdown, DropdownOrderBy, Form, NumberInput, SelectListItem} from "@/@weare/athenaeum-react-components";
import Carousel, {CarouselNavigation, CarouselPagination} from "@/@weare/athenaeum-react-components/components/Carousel/Carousel";

interface ICarouselTestsState {
    background: boolean;
    loop: boolean;
    maxPaginationBullets: number;
    navigation: CarouselNavigation;
    pagination: CarouselPagination;
    slideCount: number;
    slideHeigth: number | "random" | "auto";
    slideWidth: number | "random" | "auto";
    slidesPerView: "auto" | number;
    spaceBetweenSlides: number;
}

export default class CarouselTests extends BaseComponent {

    public state: ICarouselTestsState = {
        background: false,
        loop: false,
        maxPaginationBullets: 10,
        navigation: CarouselNavigation.None,
        pagination: CarouselPagination.None,
        slideHeigth: "auto",
        slideWidth: "auto",
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
                width: (this.state.slideWidth === "random")
                    ? 100 + Math.random() * 500
                    : this.state.slideWidth,
                height: (this.state.slideHeigth === "random")
                    ? 100 + Math.random() * 500
                    : this.state.slideHeigth,
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

                    <Checkbox inline
                              className="pt-1 pb-1"
                              label="Background"
                              value={this.state.background}
                              onChange={async (_, background) => {await this.setState({background})}}
                    />

                    <NumberInput inline required noValidate
                                 className="w-25 pt-1 pb-1"
                                 label="Slides"
                                 value={this.state.slideCount}
                                 onChange={async (_, slideCount) => {await this.setState({slideCount})}}
                    />

                    <div className="row">

                        <div className="col-2">
                            <Checkbox inline
                                      className="pt-1 pb-1"
                                      label="Slide width Auto"
                                      value={this.state.slideWidth === "auto"}
                                      onChange={async () => {await this.setState({slideWidth: "auto"})}}
                            />
                        </div>

                        <div className="col-3">
                            <Checkbox inline
                                      className="pt-1 pb-1"
                                      label="Slide width Random"
                                      value={this.state.slideWidth === "random"}
                                      onChange={async () => {await this.setState({slideWidth: "random"})}}
                            />
                        </div>

                        <div className="col-2">
                            <NumberInput inline required noValidate
                                         className="pt-1 pb-1"
                                         label="Slide width"
                                         step={10}
                                         value={(typeof this.state.slideWidth === "number") ? this.state.slideWidth : 0}
                                         onChange={async (_, slideWidth) => {await this.setState({slideWidth})}}
                            />
                        </div>

                    </div>

                    <div className="row">

                        <div className="col-2">
                            <Checkbox inline
                                      className="pt-1 pb-1"
                                      label="Slide heigth Auto"
                                      value={this.state.slideHeigth === "auto"}
                                      onChange={async () => {await this.setState({slideHeigth: "auto"})}}
                            />
                        </div>

                        <div className="col-3">
                            <Checkbox inline
                                      className="pt-1 pb-1"
                                      label="Slide heigth Random"
                                      value={this.state.slideHeigth === "random"}
                                      onChange={async () => {await this.setState({slideHeigth: "random"})}}
                            />
                        </div>

                        <div className="col-2">
                            <NumberInput inline required noValidate
                                         className="pt-1 pb-1"
                                         label="Slide heigth"
                                         step={10}
                                         value={(typeof this.state.slideHeigth === "number") ? this.state.slideHeigth : 0}
                                         onChange={async (_, slideHeigth) => {await this.setState({slideHeigth})}}
                            />
                        </div>

                    </div>

                    <hr/>

                    <h3>
                        Carousel props
                    </h3>

                    <Checkbox inline
                              className="pt-1 pb-1"
                              label="Loop"
                              value={this.state.loop}
                              onChange={async (_, loop) => {await this.setState({loop})}}
                    />

                    <NumberInput inline required noValidate
                                 className="pt-1 pb-1"
                                 label="Max pagination bullets"
                                 value={this.state.maxPaginationBullets}
                                 onChange={async (_, maxPaginationBullets) => {await this.setState({maxPaginationBullets})}}
                    />

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

                    <div className="row">

                        <div className="col-3">
                            <Checkbox inline
                                      className="pt-1 pb-1"
                                      label="Slides per view Auto"
                                      value={this.state.slidesPerView === "auto"}
                                      onChange={async (_, auto) => {await this.setState({slidesPerView: (auto) ? "auto" : 1}); console.log(auto, this.state.slidesPerView)}}
                            />
                        </div>

                        {
                            (this.state.slidesPerView !== "auto") &&
                            (
                                <div className="col-3">
                                    <NumberInput inline required noValidate
                                                 className="pt-1 pb-1"
                                                 label="Slides per view"
                                                 value={this.state.slidesPerView as number}
                                                 onChange={async (_, slidesPerView) => {await this.setState({slidesPerView})}}
                                    />
                                </div>
                            )
                        }

                    </div>

                    <NumberInput inline required noValidate
                                 className="pt-1 pb-1"
                                 label="Space between slides"
                                 value={this.state.spaceBetweenSlides}
                                 onChange={async (_, spaceBetweenSlides) => {await this.setState({spaceBetweenSlides})}}
                    />

                    <hr/>

                    <div style={{backgroundColor: (this.state.background) ? "pink" : "initial"}}>
                        <Carousel loop={this.state.loop}
                                  maxPaginationBullets={this.state.maxPaginationBullets}
                                  navigation={this.state.navigation}
                                  pagination={this.state.pagination}
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