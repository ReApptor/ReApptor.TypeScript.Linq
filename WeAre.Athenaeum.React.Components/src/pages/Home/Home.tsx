import React from "react";
import {PwaHelper} from "@weare/athenaeum-toolkit";
import {WebApplicationType, ApplicationContext} from "@weare/athenaeum-react-common";
import AnonymousPage from "../../models/base/AnonymousPage";
import PageContainer from "../../components/PageContainer/PageContainer";
import WidgetContainer from "../../components/WidgetContainer/WidgetContainer";
import { IconStyle } from "@/components/Icon/Icon";
import LinkWidget from "../../components/WidgetContainer/Link/LinkWidget/LinkWidget";
import RouteWidget from "../../components/WidgetContainer/Link/RouteWidget/RouteWidget";
import PageDefinitions from "../../providers/PageDefinitions";
import Localizer from "../../localization/Localizer";

import styles from "./Home.module.scss";

interface IHomeProps {
    name: string | null;
}

interface IHomeState {
    pwaInstall: boolean;
}

export default class Home extends AnonymousPage<IHomeProps, IHomeState> {

    state: IHomeState = {
        pwaInstall: false
    };

    private get pwaInstall(): boolean {
        return this.state.pwaInstall;
    }

    private async onPwaHelperInitialized(): Promise<void> {
        const context: ApplicationContext = this.getContext();
        const applicationType: WebApplicationType = context.applicationType;
        const pwaInstall: boolean = (PwaHelper.canBeInstalled) && ((applicationType == WebApplicationType.MobileBrowser) || ((context.isDevelopment) && (applicationType == WebApplicationType.DesktopBrowser)));
        await this.setState({pwaInstall});
    }

    private async installPwaAsync(): Promise<void> {
        await PwaHelper.installAsync();
        await this.reRenderAsync();
    }

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();
        await PwaHelper.subscribe(async () => await this.onPwaHelperInitialized());
    }

    public getTitle(): string {
        return Localizer.topNavFrontpage;
    }
    
    public render(): React.ReactNode {
        return (
            <PageContainer transparent className={styles.home} alertClassName={styles.alert}>
                
                <WidgetContainer>

                    {
                        (this.pwaInstall)
                            ? <RouteWidget icon={{name: "fas tablet-alt"}} label={Localizer.widgetPwaInstall} description={Localizer.widgetPwaDescription} onClick={() => this.installPwaAsync()} />
                            : <LinkWidget icon={{ name: "android", style: IconStyle.Brands }} url="https://renta.fi/" label={Localizer.widgetRentaLinkLabel} description={Localizer.widgetRentaLinkDescription} />
                    }

                    <RouteWidget icon={{ name: "sign-in" }} route={PageDefinitions.loginRoute} label={Localizer.topNavLogin} description={Localizer.widgetLoginDescription} />
                    
                </WidgetContainer>

            </PageContainer>
        );
    }
}