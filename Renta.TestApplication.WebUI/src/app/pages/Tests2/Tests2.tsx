import React from "react";
import { PageContainer, PageHeader } from "@weare/athenaeum-react-components";

import AnonymousPage from "../AnonymousPage/AnonymousPage";
import {BasePageParameters, IBasePageProps} from "@weare/athenaeum-react-common";
export interface IRentParameters extends BasePageParameters {
    ignoreGeneratedUrl: true
}
export default class Tests2 extends AnonymousPage {
   

    public getTitle(): string {
        return "Tests2";
    }

    get ignoreGeneratedUrl(): boolean {
        return true;
    }
    
    constructor(props: IBasePageProps<IRentParameters>) {
        super(props);

    }
    public render(): React.ReactNode {
        return (
            <PageContainer  className="tests-page">
                <PageHeader title="Tests2" />

            </PageContainer>
        );
    }
}