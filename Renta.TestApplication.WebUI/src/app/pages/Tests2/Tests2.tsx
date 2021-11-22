import React from "react";
import { PageContainer, PageHeader } from "@weare/athenaeum-react-components";

import AnonymousPage from "../AnonymousPage/AnonymousPage";

export default class Tests2 extends AnonymousPage {

    public getTitle(): string {
        return "Tests2";
    }

    public render(): React.ReactNode {
        return (
            <PageContainer  className="tests-page">
                <PageHeader title="Tests2" />

            </PageContainer>
        );
    }
}