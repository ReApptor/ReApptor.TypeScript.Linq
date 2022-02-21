import React from "react";
import { PageContainer, PageHeader } from "@weare/reapptor-react-components";
import {BasePageParameters, IBasePageProps} from "@weare/reapptor-react-common";
import AuthorizedPage from "../AuthorizedPage";


export interface IAuthorizedParameters extends BasePageParameters {
    object: object;
}

export default class AuthorizedTestWithParameters extends AuthorizedPage<IAuthorizedParameters> {

    public getTitle(): string {
        return nameof(AuthorizedTestWithParameters);
    }

    constructor(props: IBasePageProps<IAuthorizedParameters>) {
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