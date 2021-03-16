import React from "react";
import AnonymousPage from "@/pages/AnonymousPage/AnonymousPage";
import {ServerError, BasePageParameters} from "@weare/athenaeum-react-common";

import styles from "./Error.module.scss";
import PageContainer from "@/components/PageContainer/PageContainer";
import PageHeader from "@/components/PageContainer/PageHeader/PageHeader";
import PageRow from "@/components/PageContainer/PageRow/PageRow";

export interface IErrorPageParameters extends BasePageParameters {
    error: ServerError | null;
}

export default class ErrorPage extends AnonymousPage<IErrorPageParameters> {

    private get error(): ServerError | null {
        return (this.props.parameters != null) && (this.props.parameters.error != null)
            ? this.props.parameters.error
            : null;
    }

    public render(): React.ReactNode {

        return (
            <PageContainer className={styles.error}>
                <PageHeader title={"Error"} subtitle={"Unhandled exception"} />

                <PageRow>
                    <div className="col">
                        {
                            (this.error) &&
                            (
                                <React.Fragment>
                                    <p>
                                        Error occured.
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