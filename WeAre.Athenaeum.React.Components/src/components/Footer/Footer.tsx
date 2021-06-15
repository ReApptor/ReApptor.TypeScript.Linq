import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import FooterLocalizer from "./FooterLocalizer";

import logo from "../TopNav/renta-logo.png";
import styles from "./Footer.module.scss";
import Comparator from "../../helpers/Comparator";

export interface IFooterLink {
    href: string,
    label: string;
}

export interface IFooterProps {
    version?: string;
    links?: IFooterLink[]
    logo?: any;
    name?: string;
}

export default class Footer extends BaseComponent<IFooterProps> {

    private get links(): IFooterLink[] {
        return (this.props.links != null)
            ? this.props.links
            : [
                {
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
        return this.props.name || "Renta";
    }

    private renderCopyright(): React.ReactNode {
        const currentYear: number = new Date().getFullYear();
        return <span>© {this.name} {currentYear}</span>;
    }

    private renderVersion(): React.ReactNode {
        return (
            <span className={styles.version}>{this.props.version}</span>
        );
    }
    
    public async componentWillReceiveProps(nextProps: IFooterProps): Promise<void> {

        const linksChanged: boolean = (!Comparator.isEqual(nextProps.links, this.props.links));

        await super.componentWillReceiveProps(nextProps);

        console.log("Footer.componentWillReceiveProps: linksChanged=", linksChanged, " links=", nextProps.links);

        if (linksChanged) {
            
            await this.reRenderAsync();
        }
    }

    public renderLink(link: IFooterLink, index: number): React.ReactNode {
        return (
            <a key={index} href={link.href} rel="noreferrer" target="_blank">
                {FooterLocalizer.get(link.label).toUpperCase()}
            </a>
        )
    }

    public render(): React.ReactNode {
        console.log("Footer.render: footerLinks=", this.links);
        return (
            <footer className={styles.footer}>
                
                <div className={styles.upperFooter}>
                    
                    <img src={this.props.logo ?? logo} alt={this.name} />

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