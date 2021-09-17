import React, {CSSProperties, Fragment, ReactElement, ReactNode} from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {Button, Carousel, CarouselNavigation, CarouselPagination, Checkbox, Dropdown, DropdownOrderBy, Form, FourColumns, InlineType, NumberInput, SelectListItem, ThreeColumns} from "@weare/athenaeum-react-components";
import { assert } from '@weare/athenaeum-toolkit';

interface ICarouselTestsState {
    background: boolean;
    initiallyActiveSlide: number;
    loop: boolean;
    navigation: CarouselNavigation;
    pagination: CarouselPagination;
    renderCarousel: boolean;
    slideToIndex: number;
    slideToSpeed: number;
    slideCount: number;
    slideHeigth: number | "random" | "auto";
    slideWidth: number | "random" | "auto";
    slidesPerView: "auto" | number;
    spaceBetweenSlides: number;
}

export default class CarouselTests extends BaseComponent {

    public state: ICarouselTestsState = {
        background: false,
        initiallyActiveSlide: 3,
        loop: false,
        navigation: CarouselNavigation.None,
        pagination: CarouselPagination.None,
        renderCarousel: true,
        slideToIndex: 0,
        slideToSpeed: 300,
        slideHeigth: "auto",
        slideWidth: "auto",
        slideCount: 5,
        slidesPerView: "auto",
        spaceBetweenSlides: 0,
    }

    private readonly _carouselRef: React.RefObject<Carousel> = React.createRef();

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

    private get slides(): ReactElement[] {
        const slides: ReactElement[] = [];
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

    private get carousel(): Carousel {
        return assert(this._carouselRef.current).isObject.isNotNull.getValue as Carousel;
    }

    public render(): ReactNode {
        return (
            <Fragment>

                <Form className="pt-4">

                    <h3>
                        Test helpers
                    </h3>

                    <FourColumns>

                        <Checkbox inline
                                  inlineType={InlineType.Right}
                                  label="Render"
                                  value={this.state.renderCarousel}
                                  onChange={async (_, renderCarousel) => {await this.setState({renderCarousel})}}
                        />

                        <Checkbox inline
                                  inlineType={InlineType.Right}
                                  label="Background"
                                  value={this.state.background}
                                  onChange={async (_, background) => {await this.setState({background})}}
                        />

                        <NumberInput inline required noValidate
                                     label="Slides"
                                     value={this.state.slideCount}
                                     onChange={async (_, slideCount) => {await this.setState({slideCount})}}
                        />

                        <NumberInput inline required noValidate
                                     label="Initial slide index"
                                     value={this.state.initiallyActiveSlide}
                                     onChange={async (_, initiallyActiveSlide) => {await this.setState({initiallyActiveSlide})}}
                        />

                    </FourColumns>

                    <FourColumns>

                            <NumberInput inline required noValidate
                                         label="Slide width"
                                         step={10}
                                         value={(typeof this.state.slideWidth === "number") ? this.state.slideWidth : 0}
                                         onChange={async (_, slideWidth) => {await this.setState({slideWidth})}}
                            />

                            <Checkbox inline
                                      inlineType={InlineType.Right}
                                      label="Auto"
                                      value={this.state.slideWidth === "auto"}
                                      onChange={async () => {await this.setState({slideWidth: "auto"})}}
                            />

                            <Checkbox inline
                                      inlineType={InlineType.Right}
                                      label="Random"
                                      value={this.state.slideWidth === "random"}
                                      onChange={async () => {await this.setState({slideWidth: "random"})}}
                            />

                    </FourColumns>

                    <FourColumns>

                            <NumberInput inline required noValidate
                                         label="Slide heigth"
                                         step={10}
                                         value={(typeof this.state.slideHeigth === "number") ? this.state.slideHeigth : 0}
                                         onChange={async (_, slideHeigth) => {await this.setState({slideHeigth})}}
                            />

                            <Checkbox inline
                                      inlineType={InlineType.Right}
                                      label="Auto"
                                      value={this.state.slideHeigth === "auto"}
                                      onChange={async () => {await this.setState({slideHeigth: "auto"})}}
                            />

                            <Checkbox inline
                                      inlineType={InlineType.Right}
                                      label="Random"
                                      value={this.state.slideHeigth === "random"}
                                      onChange={async () => {await this.setState({slideHeigth: "random"})}}
                            />

                    </FourColumns>

                    <hr/>

                    <h3>
                        Carousel props
                    </h3>

                    <FourColumns>

                        <Checkbox inline
                                  inlineType={InlineType.Right}
                                  label="Loop"
                                  value={this.state.loop}
                                  onChange={async (_, loop) => {await this.setState({loop})}}
                        />

                        <Dropdown inline required noValidate noWrap noFilter
                                  orderBy={DropdownOrderBy.Value}
                                  label="Navigation"
                                  items={[CarouselNavigation.None, CarouselNavigation.Inside, CarouselNavigation.Outside]}
                                  transform={(navigation) => new SelectListItem(navigation.toString(), CarouselTests.getCarouselNavigationEnumName(navigation), null, navigation)}
                                  value={CarouselTests.getCarouselNavigationEnumName(this.state.navigation)}
                                  onChange={async (_, navigation) => {await this.setState({navigation})}}
                        />

                        <Dropdown inline required noValidate noWrap noFilter
                                  orderBy={DropdownOrderBy.Value}
                                  label="Pagination"
                                  items={[CarouselPagination.None, CarouselPagination.BottomInside, CarouselPagination.BottomOutside]}
                                  transform={(pagination) => new SelectListItem(pagination.toString(), CarouselTests.getCarouselPaginationEnumName(pagination), null, pagination)}
                                  value={CarouselTests.getCarouselPaginationEnumName(this.state.pagination)}
                                  onChange={async (_, pagination) => {await this.setState({pagination})}}
                        />

                        <NumberInput inline required noValidate
                                     label="Space between slides"
                                     value={this.state.spaceBetweenSlides}
                                     onChange={async (_, spaceBetweenSlides) => {await this.setState({spaceBetweenSlides})}}
                        />

                    </FourColumns>

                    <FourColumns>

                        <Checkbox inline
                                  inlineType={InlineType.Right}
                                  label="Slides per view Auto"
                                  value={this.state.slidesPerView === "auto"}
                                  onChange={async (_, auto) => {await this.setState({slidesPerView: (auto) ? "auto" : 1}); console.log(auto, this.state.slidesPerView)}}
                        />

                        {
                            (this.state.slidesPerView !== "auto") &&
                            (
                                <NumberInput inline required noValidate
                                             label="Slides per view"
                                             value={this.state.slidesPerView as number}
                                             onChange={async (_, slidesPerView) => {await this.setState({slidesPerView})}}
                                />
                            )
                        }

                    </FourColumns>

                    <hr/>

                    <h3>
                        Carousel methods
                    </h3>

                    <FourColumns>

                        <NumberInput inline required noValidate
                                     label="Slide to Index"
                                     step={1}
                                     value={this.state.slideToIndex}
                                     onChange={async (_, slideToIndex) => {await this.setState({slideToIndex})}}
                        />

                        <NumberInput inline required noValidate
                                     label="Slide to Speed"
                                     step={50}
                                     value={this.state.slideToSpeed}
                                     onChange={async (_, slideToSpeed) => {await this.setState({slideToSpeed})}}
                        />

                        <Button label={"Slide to"}
                                onClick={async () => this.carousel.slideToAsync(this.state.slideToIndex, this.state.slideToSpeed)}
                        />

                    </FourColumns>

                    <hr/>

                    {
                        (this.state.renderCarousel) &&
                        (
                            <div style={{backgroundColor: (this.state.background) ? "pink" : "initial"}}>
                                <Carousel ref={this._carouselRef}
                                          loop={this.state.loop}
                                          navigation={this.state.navigation}
                                          pagination={this.state.pagination}
                                          slidesPerView={this.state.slidesPerView}
                                          spaceBetweenSlides={this.state.spaceBetweenSlides}
                                          initialSlideIndex={this.state.initiallyActiveSlide}
                                          onClick={async (event) => console.log("onClick", event)}
                                          onSlideChange={async (activeIndex) => {console.log("onSlideChange", activeIndex)}}
                                >
                                    {
                                        this.slides
                                    }
                                </Carousel>
                            </div>
                        )
                    }

                    <hr/>

                    <h3>
                        Duplicates
                    </h3>

                    <Carousel loop={this.state.loop}
                              navigation={this.state.navigation}
                              pagination={this.state.pagination}
                              slidesPerView={this.state.slidesPerView}
                              spaceBetweenSlides={this.state.spaceBetweenSlides}
                              initialSlideIndex={this.state.initiallyActiveSlide}
                              onClick={async (event) => console.log("onClick", event)}
                              onSlideChange={async (activeIndex) => {console.log("onSlideChange", activeIndex)}}
                    >
                        {
                            this.slides
                        }
                    </Carousel>

                    <br/>

                    <Carousel loop={this.state.loop}
                              navigation={this.state.navigation}
                              pagination={this.state.pagination}
                              slidesPerView={this.state.slidesPerView}
                              spaceBetweenSlides={this.state.spaceBetweenSlides}
                              initialSlideIndex={this.state.initiallyActiveSlide}
                              onClick={async (event) => console.log("onClick", event)}
                              onSlideChange={async (activeIndex) => {console.log("onSlideChange", activeIndex)}}
                    >
                        {
                            this.slides
                        }
                    </Carousel>

                </Form>

            </Fragment>
        );
    }
}