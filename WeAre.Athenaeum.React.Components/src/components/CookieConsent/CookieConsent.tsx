import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import styles from "./CookieConsent.module.scss"
import {Button, ButtonType} from "@weare/athenaeum-react-components";

enum BannerPosition {
    Top,
    Bottom
}

interface ICookie {
    cname: string;
    expiresInDays?: number;
}

export interface ICookieConsentProps {
    /**
     * Description text that is show in the cookie consent banner
     */
    description: string
    
    /**
     *  Title text shown in cookie consent banner
     */
    title: string;

    /**
     * Accept cookies button text
     */
    acceptButtonText: string;

    /**
     * Position of the cookie banner. Optional.
     * Default to top of the page.
     */
    position?: BannerPosition;

    /**
     * Name of the consent cookie
     */
    cookieName:string;

    /**
     * Expiration of the consent cookie in days. Defaults to "9999-12-31T23:59:59.000Z"
     */
    cookieExpirationInDays?:number;
}

export default class CookieConsent extends BaseComponent<ICookieConsentProps> {

    public get cookieExists(): boolean {
        const name = this.props.cookieName + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return true;
            }
        }
        return false;
    }

    private async saveCookieAsync() {
        const d = new Date();

        let expiresInDays: number = this.props.cookieExpirationInDays ?? 99999;
        d.setTime(d.getTime() + (expiresInDays * 24 * 60 * 60 * 1000));

        let expiresValue = this.props.cookieExpirationInDays
            ? d.toUTCString()
            : "Fri, 31 Dec 9999 23:59:59 GMT"

        let expires: string = "expires=" + expiresValue;
        document.cookie = this.props.cookieName + "=yes;" + expires + ";path=/";

        await this.reRenderAsync();
    }


    render(): React.ReactNode {
        const position: BannerPosition = this.props.position ?? BannerPosition.Top;

        return (

            (!this.cookieExists) && (
                <div className={this.css(styles.cookieConsentBanner, position === BannerPosition.Bottom ? styles.bottom : styles.top)}>
                    <div className={styles.cookieConsentBannerInner}>
                        <div className={styles.cookieConsentBannerCopy}>
                            <div className={styles.cookieConsentBannerHeader}>
                                {this.props.title}
                            </div>
                            <div className={styles.cookieConsentBannerDescription}>
                                {this.props.description}
                            </div>
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
