import React from "react";
import {BaseComponent} from "@weare/reapptor-react-common";
import {CookieConsent, Button, Form, TextInput, NumberInput} from "@weare/reapptor-react-components";


export default class CookieConsentTests extends BaseComponent {

    public state: any = {
        title: "Title",
        description: "Description",
        button: "Button",
        expiration: 0,
        name: "Name",
    };

    private async clearCookiesAsync() {
        document.cookie
            .split(";")
            .forEach(function (cookie) {
                document.cookie = cookie
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        await this.reRenderAsync();
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Form className="pt-4">
                    <Button label={"Clear cokies"}
                            onClick={async (sender) => await this.clearCookiesAsync()}
                    />

                    <h2>
                        Visual settings
                    </h2>

                    <TextInput label={"Title"}
                               value={this.state.title}
                               onChange={async (_, title) => {await this.setState({title})}}
                    />

                    <TextInput label={"Description"}
                               value={this.state.description}
                               onChange={async (_, description) => {await this.setState({description})}}
                    />

                    <TextInput label={"Button"}
                               value={this.state.button}
                               onChange={async (_, button) => {await this.setState({button})}}
                    />

                    <h2>
                        Cookie settings
                    </h2>

                    <TextInput label={"Cookie name"}
                               value={this.state.name}
                               onChange={async (_, name) => {await this.setState({name})}}
                    />

                    <NumberInput label={"Cookie expiration days"}
                                 value={this.state.expiration}
                                 onChange={async (_, expiration) => {await this.setState({expiration})}}
                    />

                    <CookieConsent title={this.state.title}
                                   description={this.state.description}
                                   acceptButtonText={this.state.button}
                                   cookieExpirationInDays={this.state.expiration}
                                   cookieName={this.state.name}
                    />
                </Form>
            </React.Fragment>
        );
    }


}