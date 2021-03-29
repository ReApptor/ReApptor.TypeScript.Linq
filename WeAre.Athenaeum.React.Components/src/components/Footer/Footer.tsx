import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import FooterLocalizer from "./FooterLocalizer";

import logo from "../TopNav/renta-logo.png";
import styles from "./Footer.module.scss";

export interface IFooterLink {
    href: string,
    label: string;
}

export interface IFooterProps {
    links?: IFooterLink[]
    version?: string;
    logo?: any;
    logoAlt?: string;
}

export default class Footer extends BaseComponent<IFooterProps> {

    private get links(): IFooterLink[] {
        return (this.props.links != null)
            ? this.props.links
            : [
                {
                    href: "https://renta.fi/",
                    label: FooterLocalizer.get("componentFooterFrontpage")
                },
                {
                    href: "https://www.renta.fi/fi/yhteystiedot/",
                    label: FooterLocalizer.get("componentFooterContact")
                }
            ];
    }

    private renderCopyright(): React.ReactNode {
        const currentYear: number = new Date().getFullYear();
        return <span>© Renta {currentYear}</span>;
    }

    private renderVersion(): React.ReactNode {
        return (
            <span className={styles.version}>{this.props.version}</span>
        );
    }

    private renderLink(link: IFooterLink, index: number): React.ReactNode {
        return (
            <a key={index} href={link.href} rel="noreferrer" target="_blank">
                {FooterLocalizer.get(link.label).toUpperCase()}
            </a>
        )
    }

    render(): React.ReactNode {
        return (
            <footer className={styles.footer}>
                
                <div className={styles.upperFooter}>
                    
                    <img src={this.props.logo ?? logo} alt={this.props.logoAlt ?? "Renta Oy"} />

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
                            this.renderVersion()
                        )
                    }
                </div>
                
            </footer>
        );
    }
}