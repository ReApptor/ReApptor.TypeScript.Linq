import React, {CSSProperties, ReactElement} from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {Navigation, Pagination} from "swiper";
import {assert, IBaseAsserter} from "@weare/athenaeum-toolkit";
import {NavigationOptions, PaginationOptions} from "swiper/types";


import "./SwiperStyles.scss";
import styles from "./Carousel.module.scss";

// Swiper modules need to be explicitly loaded
SwiperCore.use([Navigation, Pagination]);


// TODO: If a child-elements width changes, Swipers slide width/snapping grid won't be updated.
//       Using Swipers in-built observer functionality does not help, as it does not notice changes in childrens width.


export enum CarouselNavigation {
    None = 0,
    Inside = 1,
    Outside = 2,
}

export enum CarouselPagination {
    None = 0,
    BottomInside = 1,
    BottomOutside = 2,
}

export interface ICarouselProps {

    children: React.ReactNode[];

    /**
     * Appended to the {@link Carousel}s containers classname.
     */
    className?: string;

    /**
     * Should the {@link Carousel} loop.
     * @default false
     */
    loop?: boolean;

    /**
     * Enable or disable navigation.
     * @default {@link CarouselNavigation.None}
     */
    navigation?: CarouselNavigation;

    /**
     * Enable or disable pagination.
     * @default {@link CarouselPagination.None}
     */
    pagination?: CarouselPagination;

    /**
     * How many slides should be visible at the same time.
     * @default 1
     */
    slidesPerView?: "auto" | number;

    /**
     * How many pixels of space should be between slides.
     *
     * Do not manually add margins between the slides, as that will mess up the {@link Carousel}s snapping grid.
     * @default 0
     */
    spaceBetweenSlides?: number;

    /**
     * Transition between slide-changes in milliseconds.
     * @default 300
     */
    speed?: number;

    /**
     * Called when the currently active slide changes.
     * @param newActiveIndex Index of the new active slide.
     */
    onSlideChange?(newActiveIndex: number): void
}

interface ICarouselState {
    swiper: SwiperCore | null;
}


export default class Carousel extends BaseComponent<ICarouselProps, ICarouselState> {

    // Inherited

    public state: ICarouselState = {
        swiper: null,
    }

    public get children(): React.ReactElement[] {
        // BaseComponents "children" clones the children, which messes up updates.
        return (this.props as any)?.children ?? [];
    }

    // Getters

    private get className(): string {
        const navigationClass: string | null = (this.navigation === CarouselNavigation.Outside)
            ? styles.navigationOutside
            : null;

        const paginationClass: string | null = (this.pagination === CarouselPagination.BottomOutside)
            ? styles.paginationBottomOutside
            : null

        return this.css(this.props.className, styles.carousel, navigationClass, paginationClass);
    }

    private get hasChildren(): boolean {
        return (this.children?.length > 0);
    }

    private get loop(): boolean {
        return (this.props.loop === true);
    }

    private get navigation(): CarouselNavigation {
        return Carousel.toNavigation(this.props.navigation);
    }

    private get navigationOptions(): NavigationOptions | false {
         return (this.navigation)
             ? {
                 nextEl: `.${styles.next}`,
                 prevEl: `.${styles.previous}`
             }
             : false;
    }

    private get pagination(): CarouselPagination {
        return Carousel.toPagination(this.props.pagination);
    }

    private get paginationOptions(): PaginationOptions | false {
        return (this.pagination)
            ? {clickable: true}
            : false;
    }

    private get slidesPerView(): "auto" | number {
        const slidesPerView: "auto" | number | undefined = this.props.slidesPerView;
        return ((slidesPerView === "auto") || ((typeof slidesPerView === "number") && (slidesPerView > 0)))
            ? slidesPerView
            : 1;
    }

    private get spaceBetweenSlides(): number {
        const assertion: IBaseAsserter<number> = assert(this.props.spaceBetweenSlides).isNumber;

        return (assertion.getIsSuccess)
            ? assertion.getValue
            : 0;
    }

    private get speed(): number {
        const assertion: IBaseAsserter<number> = assert(this.props.speed).isNumber;

        return (assertion.getIsSuccess)
            ? assertion.getValue
            : 300;
    }

    // Getter-Setter pairs

    private get swiper(): SwiperCore {
        return assert(this.state.swiper, "swiper").isObject.isNotNull.getValue as SwiperCore;
    }

    private set swiper(newSwiper: SwiperCore) {
        this.setState({
            swiper: assert(newSwiper, "newSwiper").isObject.isNotNull.getValue as SwiperCore,
        });
    }

    // Synchronous methods

    private getSwiperSlideStyle(child: ReactElement): CSSProperties {
        // If slidesPerView has first been set to a number and then to "auto", the swiper-slide elements widths remain unchanged, and must be reset manually.
        return (this.slidesPerView === "auto")
            ? (child?.props?.style?.width)
                ? {width: child.props.style.width}
                : {width: "auto"}
            : {};
    }

    // Public

    /**
     * Index of the currently active slide.
     */
    public get activeIndex(): number {
        return assert(this.swiper.realIndex, "activeIndex").isNumber.getValue;
    }

    /**
     * Slide to a slide in the given index with the given speed.
     * @param index Index of the slide to slide to.
     * @param speed Speed to slide with. Default is 300.
     */
    public slideTo(index: number, speed: number = 300) {
        this.swiper.slideTo(
            assert(index, "index").isNumber.getValue,
            assert(speed, "speed").isNumber.getValue);
    }

    /**
     * Convert a value to a {@link CarouselNavigation} value.
     */
    public static toNavigation(value: unknown): CarouselNavigation {
        switch (value) {
            case CarouselNavigation.Inside:
                return CarouselNavigation.Inside;
            case CarouselNavigation.Outside:
                return CarouselNavigation.Outside
            default:
                return CarouselNavigation.None;
        }
    }

    /**
     * Convert a value to a {@link CarouselPagination} value.
     */
    public static toPagination(value: unknown): CarouselPagination {
        switch (value) {
            case CarouselPagination.BottomInside:
                return CarouselPagination.BottomInside;
            case CarouselPagination.BottomOutside:
                return CarouselPagination.BottomOutside;
            default:
                return CarouselPagination.None;
        }
    }

    // Renders

    public render(): React.ReactNode {
        if (!this.hasChildren) {
            return null;
        }

        return (
            <div className={this.className}>

                <Swiper loop={this.loop}
                        speed={this.speed}
                        navigation={this.navigationOptions}
                        pagination={this.paginationOptions}
                        slidesPerView={this.slidesPerView}
                        spaceBetween={this.spaceBetweenSlides}
                        onInit={(swiper: SwiperCore) => {this.swiper = swiper}}
                        onRealIndexChange={(swiper: SwiperCore) => this.props.onSlideChange?.(swiper.realIndex)}
                >
                    {
                        this.children.map((child) => {
                            return (
                                <SwiperSlide key={child.key}
                                             style={this.getSwiperSlideStyle(child)}
                                >
                                    {
                                        child
                                    }
                                </SwiperSlide>
                            );
                        })
                    }
                </Swiper>

                {
                    (this.navigationOptions) &&
                    (
                        <React.Fragment>
                            <i className={this.css("fa fa-angle-left fa-3x", styles.navigation, styles.previous)}/>
                            <i className={this.css("fa fa-angle-right fa-3x", styles.navigation, styles.next)}/>
                        </React.Fragment>
                    )
                }

            </div>
        );
    }
}