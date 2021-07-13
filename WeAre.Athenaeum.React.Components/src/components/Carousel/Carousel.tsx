import React from "react";
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
    className?: string;
    loop?: boolean;
    navigation?: CarouselNavigation;
    pagination?: CarouselPagination;
    slidesPerView?: "auto" | number;
    spaceBetweenSlides?: number;
}

interface ICarouselState {
}

export default class Carousel extends BaseComponent<ICarouselProps, ICarouselState> {
    public state: ICarouselState = {
    };

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
        switch (this.props.pagination) {
            case CarouselPagination.BottomInside:
                return CarouselPagination.BottomInside;
            case CarouselPagination.BottomOutside:
                return CarouselPagination.BottomOutside;
            default:
                return CarouselPagination.None;
        }
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
        return (this.props.spaceBetweenSlides)
            ? this.props.spaceBetweenSlides
            : 0;
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
                                             className={styles.slide}
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