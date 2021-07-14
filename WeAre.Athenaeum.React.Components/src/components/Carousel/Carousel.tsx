import React, {CSSProperties, ReactElement} from "react";
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {Navigation, Pagination} from "swiper";
import {NavigationOptions, PaginationOptions} from "swiper/types";

import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
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

interface ICarouselProps {
    /**
     * Appended to the {@link Carousel}s containers classname.
     */
    className?: string;

    /**
     * Should the {@link Carousel} loop when it reaches start or end.
     */
    loop?: boolean;

    /**
     * How many pagination bullets can be displayed at the same time.
     * Default is 10.
     *
     * TODO: Changing this won't cause the Carousel pagination to rerender.
     */
    maxPaginationBullets?: number;

    /**
     * Enable or disable navigation.
     */
    navigation?: CarouselNavigation;

    /**
     * Enable or disable pagination.
     */
    pagination?: CarouselPagination;

    /**
     * How many slides should be visible at the same time.
     */
    slidesPerView?: "auto" | number;

    /**
     * How many pixels of space should be between slides.
     */
    spaceBetweenSlides?: number;
}


export default class Carousel extends BaseComponent<ICarouselProps, {}> {

    private get hasChildren(): boolean {
        return (this.children?.length > 0);
    }

    private get className(): string {
        const navigationClass: string | null = (this.navigation === CarouselNavigation.Outside)
            ? styles.navigationOutside
            : null;

        const paginationClass: string | null = (this.pagination === CarouselPagination.BottomOutside)
            ? styles.paginationBottomOutside
            : null

        return this.css(this.props.className, styles.carousel, navigationClass, paginationClass);
    }

    private get loop(): boolean {
        return (this.props.loop === true);
    }

    private get navigation(): CarouselNavigation {
        return Carousel.getNavigation(this.props.navigation);
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
        return Carousel.getPagination(this.props.pagination);
    }

    private get paginationOptions(): PaginationOptions | false {
        return (this.pagination)
            ? {clickable: true, dynamicBullets: true, dynamicMainBullets: this.props.maxPaginationBullets || 10}
            : false;
    }

    private get slidesPerView(): "auto" | number {
        const slidesPerView: "auto" | number | undefined = this.props.slidesPerView;
        return ((slidesPerView === "auto") || ((typeof slidesPerView === "number") && (slidesPerView > 0)))
            ? slidesPerView
            : 1;
    }

    private get spaceBetweenSlides(): number {
        return (this.props.spaceBetweenSlides)
            ? this.props.spaceBetweenSlides
            : 0;
    }

    private getSwiperSlideStyle(child: ReactElement): CSSProperties {
        // If slidesPerView has first been set to a number and then to "auto", the swiper-slide elements widths remain unchanged, and must be reset manually.
        return (this.slidesPerView === "auto")
            ? (child.props.style.width)
                ? {width: child.props.style.width}
                : {width: "auto"}
            : {};
    }

    public get children(): React.ReactElement[] {
        // BaseComponents "children" clones the children, which messes up updates.
        return (this.props as any)?.children ?? [];
    }

    public static getNavigation(navigation: any): CarouselNavigation {
        switch (navigation) {
            case CarouselNavigation.Inside:
                return CarouselNavigation.Inside;
            case CarouselNavigation.Outside:
                return CarouselNavigation.Outside
            default:
                return CarouselNavigation.None;
        }
    }

    public static getPagination(pagination: any): CarouselPagination {
        switch (pagination) {
            case CarouselPagination.BottomInside:
                return CarouselPagination.BottomInside;
            case CarouselPagination.BottomOutside:
                return CarouselPagination.BottomOutside;
            default:
                return CarouselPagination.None;
        }
    }

    public render(): React.ReactNode {
        if (!this.hasChildren) {
            return null;
        }
        return (
            <div className={this.className}>

                <Swiper loop={this.loop}
                        navigation={this.navigationOptions}
                        pagination={this.paginationOptions}
                        slidesPerView={this.slidesPerView}
                        spaceBetween={this.spaceBetweenSlides}
                >
                    {
                        this.children.map((child) => {
                            return (
                                <SwiperSlide key={child.key}
                                             style={this.getSwiperSlideStyle(child)}
                                >
                                    {child}
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