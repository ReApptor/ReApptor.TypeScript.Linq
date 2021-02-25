import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import FooterLocalizer from "@/components/Footer/FooterLocalizer";

import logo from "../TopNav/renta-logo.png";
import styles from "./Footer.module.scss";

interface IFooterLink {
    href: string,
    label: string;
}

interface IFooterProps {
    links?: IFooterLink[]
    version?: string;
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
    
    render(): React.ReactNode {
        return(
            <footer className={styles.footer}>
                <div className={styles.upperFooter}>
                    <img src={logo} alt="Renta" />

                    <div className={styles.footerLinks}>
                        {
                            (this.links) && this.links.map(
                                (item, index) => (<a key={index} href={item.href} rel="noreferrer" target="_blank">{item.label.toUpperCase()}</a>)
                            )
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