import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {CookieConsent, Button, Form} from "@weare/athenaeum-react-components";


export default class CookieConsentTests extends BaseComponent {

    private async clearCookiesAsync() {
        document.cookie.split(";").forEach(function (c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Form className="pt-4">
                    <Button label={"Clear cokies"}
                            onClick={async (sender) => await this.clearCookiesAsync()}
                    />
                    <CookieConsent title={"aaa"}
                                   acceptButtonText={"ok"}
                    />
                </Form>
            </React.Fragment>
        );
    }


}