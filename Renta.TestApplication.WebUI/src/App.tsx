import React from "react";
import {BaseComponent, ch, UserInteractionDataStorage} from "@weare/athenaeum-react-common";
import TestApplicationController from "@/pages/TestApplicationController";
import { Layout } from "@weare/athenaeum-react-components";

class App extends BaseComponent {

    render(): React.ReactNode {
        return (
            <Layout fetchContext={(sender, timezoneOffset, applicationType) => TestApplicationController.fetchApplicationContextAsync(timezoneOffset, applicationType)}
                    tokenLogin={(sender, token) => TestApplicationController.tokenLoginAsync(token)}
                    fetchTopNavItems={() => TestApplicationController.fetchTopNavItems()}
            />
        );
    }
    
}

//Register initialize events
//ch.registerInitializeCallback(async () => await AddressHelper.loadGoogleLibraryAsync());
ch.registerInitializeCallback(async () => await TestApplicationController.initializeAsync());
//Register authorize events
ch.registerAuthorizeCallback(async () => await UserInteractionDataStorage.onAuthorize());
ch.registerAuthorizeCallback(async () => await TestApplicationController.authorizeAsync());

export default App;