import React from "react";
import {Button, PageContainer, PageHeader} from "@weare/athenaeum-react-components";
import {BasePageParameters, ch, IBasePageProps, PageRouteProvider} from "@weare/athenaeum-react-common";
import AnonymousPage from "../AnonymousPage";


export interface IAnonymousParameters extends BasePageParameters {
    hello: string;
}

export default class AnonymousTestWithParameters extends AnonymousPage<IAnonymousParameters> {

    public getTitle(): string {
        return nameof(AnonymousTestWithParameters);
    }

    private async updateIdAsync(): Promise<void> {
        const route = this.route;

        route.id = ch.getId().toString();

        await PageRouteProvider.changeUrlWithRouteWithoutReloadAsync(route);
    }

    private async updateParametersAsync(): Promise<void> {
        const route = this.route;

        (route.parameters as IAnonymousParameters).hello = ch.getId().toString();

        await PageRouteProvider.changeUrlWithRouteWithoutReloadAsync(route);
    }

    public render(): React.ReactNode {

        console.log(
            [this.getTitle(), nameof(this.render)].join("."),
            this.route
        );

        return (
            <PageContainer  className="tests-page">
                <PageHeader title={this.getTitle()} />

                <Button label="Update Id"
                        onClick={async () => await this.updateIdAsync()}
                />

                <Button label={"Update parameter"}
                        onClick={async () => await this.updateParametersAsync()}
                />

            </PageContainer>
        );
    }
}