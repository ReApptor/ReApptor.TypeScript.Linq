import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import FooterLocalizer from "./FooterLocalizer";

import styles from "./Footer.module.scss";

/**
 * A link displayed in a {@link Footer}.
 */
export interface IFooterLink {

    /**
     * URL of the link.
     *
     * @see HTMLAnchorElement.href
     */
    href: string,

    /**
     * Text of the link.
     */
    label: string;
}

export interface IFooterProps {

    /**
     * A function which returns the links displayed in the {@link Footer}.
     *
     * @param sender The {@link Footer} which displays the links.
     */
    links?: (sender: Footer) => IFooterLink[];

    /**
     * {@link HTMLImageElement.src} of the logo image of the {@link Footer}.
     */
    logo?: any;

    /**
     * A name used in the copyright information and as {@link HTMLImageElement.alt} of the logo image of the {@link Footer}.
     *
     * @default {@link Footer.defaultName}
     */
    name?: string;

    /**
     * A version number displayed in the bottom left corner of the {@link Footer}. Very small and hard to see to make it unnoticeable.
     */
    version?: string;
}

/**
 * A footer containing copyright-information, and optionally logo and links.
 */
export default class Footer extends BaseComponent<IFooterProps> {

    /**
     * Default value of {@link IFooterProps.name}.
     */
    public static readonly defaultName: "Renta" = "Renta";

    private get links(): IFooterLink[] {
        return (this.props.links != null)
            ? this.props.links(this)
            : [
                {
                    // TODO: hardcoded finnish adresses!!

                    href: "https://renta.fi/",
                    label: FooterLocalizer.frontpage
                },
                {
                    href: "https://www.renta.fi/fi/yhteystiedot/",
                    label: FooterLocalizer.contact
                }
            ];
    }

    private get name(): string {
        return this.props.name || Footer.defaultName;
    }

    private renderCopyright(): React.ReactNode {
        const currentYear: number = new Date().getFullYear();

        return (
            <span>© {this.name} {currentYear}</span>
        );
    }

    /**
     * Create a {@link React} {@link HTMLAnchorElement} from an {@link IFooterLink}.
     *
     * @param link The {@link IFooterLink} to create the element from.
     * @param key Used as the {@link React.Attributes.key} of the returned {@link React.ReactNode}.
     * @return A {@link React} {@link HTMLAnchorElement} created from the input {@link IFooterLink}.
     */
    public renderLink(link: IFooterLink, key: number): React.ReactNode {
        return (
            <a key={key}
               href={link.href}
               rel="noreferrer"
               target="_blank"
            >
                {
                    FooterLocalizer.get(link.label).toUpperCase()
                }
            </a>
        )
    }

    public render(): React.ReactNode {
        return (
            <footer className={styles.footer}>
                <div className={styles.upperFooter}>
                    {
                        (this.props.logo) &&
                        (
                            <img src={this.props.logo}
                                 alt={this.name}
                            />
                        )
                    }

                    <div className={styles.footerLinks}>
                        {
                            (this.links.map((link, index) => (this.renderLink(link, index))))
                        }
                    </div>
                </div>

                <div className={styles.lowerFooter}>
                    {
                        this.renderCopyright()
                    }

                    {
                        (this.props.version) &&
                        (
                            <span className={styles.version}>
                                {this.props.version}
                            </span>
                        )
                    }
                </div>
            </footer>
        );
    }
}