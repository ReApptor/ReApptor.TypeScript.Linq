import React, {CSSProperties, ReactElement} from "react";
import {BaseComponent, ch} from "@weare/reapptor-react-common";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {Navigation, Pagination} from "swiper";
import {assert, IBaseAsserter} from "@weare/reapptor-toolkit";
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

    children: React.ReactElement[];

    /**
     * Index of the slide initially displayed/centered in the {@link Carousel}.
     *
     * @default 0
     */
    initialSlideIndex?: number;

    /**
     * Added to the {@link Carousel}'s containers classname.
     */
    className?: string;

    /**
     * Should the {@link Carousel} loop.
     *
     * @default false
     */
    loop?: boolean;

    /**
     * Enable or disable navigation.
     *
     * @default {@link CarouselNavigation.None}
     */
    navigation?: CarouselNavigation;

    /**
     * Enable or disable pagination.
     *
     * @default {@link CarouselPagination.None}
     */
    pagination?: CarouselPagination;

    /**
     * How many slides should be visible at the same time.
     *
     * @default 1
     */
    slidesPerView?: "auto" | number;

    /**
     * How many pixels of space should be between slides.
     *
     * WARNING: Manually adding margins between the slides will mess up the {@link Carousel}'s snapping grid.
     *
     * @default 0
     */
    spaceBetweenSlides?: number;

    /**
     * Amount of milliseconds the slide transitions take.
     *
     * @default 300
     */
    speed?: number;

    /**
     * Called when the currently active slide changes.
     *
     * @param newActiveIndex Index of the new active slide.
     */
    onSlideChange?(newActiveIndex: number): Promise<void>

    /**
     * Called when the Carousel is clicked.
     */
    onClick?(event: React.MouseEvent): Promise<void>
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
        return this.props.children;
    }

    // Fields

    private readonly _navigationNextId: string = "carousel_next" + ch.getId().toString();
    private readonly _navigationPreviousId: string = "carousel_previous" + ch.getId().toString();

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

    private get initialSlideIndex(): number {
        return (typeof this.props.initialSlideIndex === "number")
            ? this.props.initialSlideIndex
            : 0;
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
                 nextEl: `#${this._navigationNextId}`,
                 prevEl: `#${this._navigationPreviousId}`,
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
        return (typeof this.props.spaceBetweenSlides === "number")
            ? this.props.spaceBetweenSlides
            : 0;
    }

    private get speed(): number {
        return (typeof this.props.speed === "number")
            ? this.props.speed
            : 300;
    }

    private get swiper(): SwiperCore {
        return this.state.swiper!;
    }

    // Sync-methods

    private getSwiperSlideStyle(child: ReactElement): CSSProperties {

        // If slidesPerView has first been set to a number and then to "auto", the swiper-slide elements widths remain unchanged, and must be reset manually.

        return (this.slidesPerView === "auto")
            ? (child.props?.style?.width)
                ? {width: child.props.style.width}
                : {width: "auto"}
            : {};
    }

    // Async-methods

    private async onSwiperInitAsync(swiper: SwiperCore): Promise<void> {
        await this.setState({swiper});
        swiper.slideTo(this.initialSlideIndex, 0);
    }

    // Public

    /**
     * Index of the currently active slide.
     */
    public get currentSlideIndex(): number {
        return this.swiper.realIndex;
    }

    /**
     * Slide to a slide in the given index with the given speed.
     *
     * @param index Index of the slide to slide to.
     * @param speed Speed to slide with. Default is 300.
     */
    public async slideToAsync(index: number, speed: number = 300): Promise<void> {
        this.swiper.slideTo(index, speed);
    }

    /**
     * Convert any value to a {@link CarouselNavigation} value.
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
     * Convert any value to a {@link CarouselPagination} value.
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
        return (
            <div className={this.className}
                 onClick={async (event) => await this.props.onClick?.(event)}
            >

                <Swiper loop={this.loop}
                        speed={this.speed}
                        navigation={this.navigationOptions}
                        pagination={this.paginationOptions}
                        slidesPerView={this.slidesPerView}
                        spaceBetween={this.spaceBetweenSlides}
                        onInit={async (swiper: SwiperCore) => await this.onSwiperInitAsync(swiper)}
                        onRealIndexChange={async (swiper: SwiperCore) => {await this.props.onSlideChange?.(swiper.realIndex)}}
                >
                    {
                        this.children.map((child, index) => {
                            return (
                                <SwiperSlide key={(child.key?.toString?.() ?? "") + index}
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

                            <i id={this._navigationPreviousId}
                               className={this.css("fa fa-angle-left fa-3x", styles.navigation, styles.previous)}
                            />

                            <i id={this._navigationNextId}
                               className={this.css("fa fa-angle-right fa-3x", styles.navigation, styles.next)}
                            />

                        </React.Fragment>
                    )
                }

            </div>
        );
    }
}