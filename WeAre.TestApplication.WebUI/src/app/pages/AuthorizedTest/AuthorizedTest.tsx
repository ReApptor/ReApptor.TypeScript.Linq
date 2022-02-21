import React from "react";
import { PageContainer, PageHeader } from "@weare/reapptor-react-components";
import {BasePageParameters, IBasePageProps} from "@weare/reapptor-react-common";
import AuthorizedPage from "../AuthorizedPage";


export interface IRentParameters extends BasePageParameters {
    ignoreGeneratedUrl: true
}

export default class AuthorizedTest extends AuthorizedPage<IRentParameters> {

    public getTitle(): string {
        return nameof(AuthorizedTest);
    }

    constructor(props: IBasePageProps<IRentParameters>) {
        super(props);
    }

    public render(): React.ReactNode {

        console.log([this.getTitle(), nameof(this.render)].join("."));

        return (
            <PageContainer  className="tests-page">
                <PageHeader title={this.getTitle()} />

            </PageContainer>
        );
    }
}