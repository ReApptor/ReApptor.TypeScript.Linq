import React from "react";
import {BaseComponent, ch, IBaseComponent, WebApplicationType, UserInteractionDataStorage} from "@weare/athenaeum-react-common";
import {Layout} from "@weare/athenaeum-react-components/src";
import AddressHelper from "@weare/athenaeum-react-components/src/helpers/AddressHelper";
import TestApplicationController from "@/pages/TestApplicationController";

class App extends BaseComponent {

    render(): React.ReactNode {
        return (
            <Layout fetchContext={(sender: IBaseComponent, timezoneOffset: number, applicationType: WebApplicationType) => TestApplicationController.fetchApplicationContextAsync(timezoneOffset, applicationType)}
                    tokenLogin={(sender: IBaseComponent, token: string) => TestApplicationController.tokenLoginAsync(token)}
            />
        );
    }
    
}

//Register initialize events
ch.registerInitializeCallback(async () => await AddressHelper.loadGoogleLibraryAsync());
ch.registerInitializeCallback(async () => await TestApplicationController.initializeAsync());
//Register authorize events
ch.registerAuthorizeCallback(async () => await UserInteractionDataStorage.onAuthorize());
ch.registerAuthorizeCallback(async () => await TestApplicationController.authorizeAsync());

export default App;
