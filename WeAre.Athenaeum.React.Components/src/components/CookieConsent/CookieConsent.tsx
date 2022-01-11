import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import styles from "./CookieConsent.module.scss"
import {Button, ButtonType} from "@weare/athenaeum-react-components";

/**
 * Position of a cookie-consent banner.
 */
export enum BannerPosition {

    /**
     * Banner is on the top of the window.
     */
    Top,

    /**
     * Banner is on the bottom of the window.
     */
    Bottom
}

// TODO: is this used at all?
interface ICookie {
    cname: string;
    expiresInDays?: number;
}

export interface ICookieConsentProps {

    /**
     * Text shown in the {@link CookieConsent}'s "Accept cookies" button.
     */
    acceptButtonText: string;

    /**
     *  Text shown in the {@link CookieConsent}'s title.
     */
    title: string;

    /**
     * In how many days from today should the cookie expire.
     * If not defined or smaller than one, the cookie expiration date will be set to {@link CookieConsent.defaultExpirationDate}.
     */
    cookieExpirationInDays?: number;

    /**
     * Name of the consent cookie.
     * @default {@link CookieConsent.defaultCookieName}
     */
    cookieName?: string;

    /**
     * Text shown in the {@link CookieConsent}'s description.
     */
    description?: string

    /**
     * Position of the {@link CookieConsent}.
     * @default {@link BannerPosition.Top}
     */
    position?: BannerPosition;
}

/**
 * A cookie-consent banner.
 */
export default class CookieConsent extends BaseComponent<ICookieConsentProps> {

    /**
     * Default value of {@link ICookieConsentProps.cookieName}.
     */
    public static readonly defaultCookieName: "consent" = "consent";

    /**
     * Default value of {@link ICookieConsentProps.cookieExpirationInDays}.
     */
    public static readonly defaultExpirationDate: "Fri, 31 Dec 9999 23:59:59 GMT" = "Fri, 31 Dec 9999 23:59:59 GMT";

    private get bannerPosition(): BannerPosition {
        return this.props.position ?? BannerPosition.Top;
    }

    private get cookieExpirationDate(): string {
        const propExpirationInDays: number | undefined = this.props.cookieExpirationInDays;

        if (typeof propExpirationInDays === "number" && propExpirationInDays > 0) {
            const expirationTimeInMilliseconds: number = propExpirationInDays * 24 * 60 * 60 * 1000;

            const expirationDate = new Date();

            expirationDate.setTime(expirationDate.getTime() + expirationTimeInMilliseconds);

            return  expirationDate.toUTCString();
        }

        return CookieConsent.defaultExpirationDate;
    }

    private get cookieName(): string {
        return this.props.cookieName ?? CookieConsent.defaultCookieName;
    }

    private async saveCookieAsync() {

        document.cookie = this.cookieName + "=yes;expires=" + this.cookieExpirationDate + ";path=/";

        await this.reRenderAsync();
    }

    /**
     * Does the consent-cookie exist, meaning that the user has clicked "Accept cookies".
     */
    public get cookieExists(): boolean {
        const cookieName: string = this.cookieName + "=";

        const ca = document.cookie.split(';');

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cookieName) == 0) {
                return true;
            }
        }
        return false;
    }

    public render(): React.ReactNode {
        const bannerStyle: string = (this.bannerPosition === BannerPosition.Bottom)
            ? styles.bottom
            : styles.top;

        return (
            (!this.cookieExists) &&
            (
                <div className={this.css(styles.cookieConsentBanner, bannerStyle)}>
                    <div className={styles.cookieConsentBannerInner}>
                        <div className={styles.cookieConsentBannerCopy}>
                            <div className={styles.cookieConsentBannerHeader}>
                                {this.props.title}
                            </div>

                            {
                                (this.props.description) &&
                                (
                                    <div className={styles.cookieConsentBannerDescription}>
                                        {this.props.description}
                                    </div>
                                )
                            }
                        </div>

                        <div>
                            <Button label={this.props.acceptButtonText}
                                    type={ButtonType.Orange}
                                    onClick={async (sender, data) => await this.saveCookieAsync()}
                            />
                        </div>
                    </div>
                </div>
            )
        )
    }
}