import React from "react";
import { PageContainer, PageHeader } from "@weare/athenaeum-react-components";
import {BasePageParameters, IBasePageProps} from "@weare/athenaeum-react-common";
import AnonymousPage from "../AnonymousPage";


export interface IRentParameters extends BasePageParameters {
    ignoreGeneratedUrl: true
}

export default class AnonymousTestWithParameters extends AnonymousPage<IRentParameters> {

    public getTitle(): string {
        return nameof(AnonymousTestWithParameters);
    }

    constructor(props: IBasePageProps<IRentParameters>) {
        super(props);
    }

    public render(): React.ReactNode {

        console.log(
            [this.getTitle(), nameof(this.render)].join("."),
            this.parameters
        );

        return (
            <PageContainer  className="tests-page">
                <PageHeader title={this.getTitle()} />

            </PageContainer>
        );
    }
}