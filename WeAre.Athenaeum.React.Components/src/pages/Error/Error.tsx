import React from "react";
import {PageRoute, ServerError, BasePageParameters, PageRouteProvider} from "@weare/athenaeum-react-common";
import PageRow from "../../components/PageContainer/PageRow/PageRow";
import PageHeader from "../../components/PageContainer/PageHeader/PageHeader";
import AnonymousPage from "../../models/base/AnonymousPage";
import PageContainer from "../../components/PageContainer/PageContainer";
import PageDefinitions from "../../providers/PageDefinitions";
import {IContactSupportParameters} from "../ContactSupport/ContactSupport";
import Localizer from "../../localization/Localizer";

import styles from "./Error.module.scss";

export interface IErrorPageParameters extends BasePageParameters {
    error: ServerError | null;
}

export default class ErrorPage extends AnonymousPage<IErrorPageParameters> {

    private get error(): ServerError | null {
        return (this.props.parameters != null) && (this.props.parameters.error != null)
            ? this.props.parameters.error
            : null;
    }

    private async redirectToContactPage(): Promise<void> {
        const route = new PageRoute(PageDefinitions.contactSupportRouteName);
        if (this.error) {
            const parameters = {} as IContactSupportParameters;
            parameters.requestId = this.error!.requestId;
            route.parameters = parameters;
        }
        await PageRouteProvider.redirectAsync(route);
    }

    public render(): React.ReactNode {

        return (
            <PageContainer className={styles.error}>
                <PageHeader title={Localizer.errorPageTitle} subtitle={Localizer.errorPageErrorMessage} />

                <PageRow>
                    <div className="col">
                        {
                            (this.error) &&
                            (
                                <React.Fragment>
                                    <p>
                                        {Localizer.errorPageErrorMessage}
                                        &nbsp;
                                        <a href="javascript:void(0)" rel="noreferrer" onClick={async () => await this.redirectToContactPage()}>{Localizer.errorPageContactSupport}</a>
                                    </p>

                                    {
                                        (this.error!.debugDetails) &&
                                        (
                                            <p className={styles.debugDetails}>{this.error!.debugDetails}</p>
                                        )
                                    }
                                </React.Fragment>
                            )
                        }
                    </div>
                </PageRow>
            </PageContainer>
        );
    }
}