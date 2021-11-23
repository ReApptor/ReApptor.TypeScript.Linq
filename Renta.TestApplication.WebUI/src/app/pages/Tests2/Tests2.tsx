import React from "react";
import { PageContainer, PageHeader } from "@weare/athenaeum-react-components";

import AnonymousPage from "../AnonymousPage/AnonymousPage";
import {BasePageParameters, IBasePageProps} from "@weare/athenaeum-react-common";
import Localizer from "../../../localization/Localizer";
export interface IRentParameters extends BasePageParameters {
    ignoreGeneratedUrl: true
}
export default class Tests2 extends AnonymousPage {
   

    public getTitle(): string {
        return "Tests2";
    }
    
    constructor(props: IBasePageProps<IRentParameters>) {
        super(props);
    }
    public render(): React.ReactNode {
        return (
            <PageContainer  className="tests-page">
                <PageHeader title={Localizer.topNavFrontpage} />

            </PageContainer>
        );
    }
}