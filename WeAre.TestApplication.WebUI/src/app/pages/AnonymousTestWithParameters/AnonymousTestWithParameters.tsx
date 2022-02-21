import React from "react";
import {Button, PageContainer, PageHeader} from "@weare/reapptor-react-components";
import {BasePageParameters, ch, PageRouteProvider} from "@weare/reapptor-react-common";
import AnonymousPage from "../AnonymousPage";
import Localizer from "../../../localization/Localizer";


export interface IAnonymousParameters extends BasePageParameters {
    hello: string;
    world: object;
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
        const params: IAnonymousParameters | null = this.typedParameters ?? {} as IAnonymousParameters;

        params.hello = ch.getId().toString();
        params.world = {
            key: params.hello,
        }

        const route = this.route;
        route.parameters = params;

        await PageRouteProvider.changeUrlWithRouteWithoutReloadAsync(route);
    }

    public render(): React.ReactNode {

        const localizerKey: string = `PageRoutes.${nameof(AnonymousTestWithParameters)}`;

        console.log(
            [this.getTitle(), nameof(this.render)].join("."),
            this.route,
            "nb",
            Localizer.contains(localizerKey),
            Localizer.contains(localizerKey, "nb"),
            Localizer.get(localizerKey)
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