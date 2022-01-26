import React from "react";
import {BaseComponent, ch, UserInteractionDataStorage} from "@weare/athenaeum-react-common";
import {AddressHelper, BannerPosition, ICookieConsentProps, Layout} from "@weare/athenaeum-react-components";
import TestApplicationController from "./pages/TestApplicationController";

class App extends BaseComponent {
    
    private get cookieContent(): ICookieConsentProps {
        return {
            acceptButtonText: "Ok",
            title: "We use cookies",
            position: BannerPosition.Top
        }
    }

    public render(): React.ReactNode {
        return (
            <Layout useRouting
                    fetchContext={(sender, timezoneOffset, applicationType) => TestApplicationController.fetchApplicationContextAsync(timezoneOffset, applicationType)}
                    tokenLogin={(sender, token) => TestApplicationController.tokenLoginAsync(token)}
                    fetchTopNavItems={() => TestApplicationController.fetchTopNavItems()}
                    topNavLogo="images/logo.svg"
                    footerLogo="images/logo.svg"
                    onShoppingCartClick={(sender) => Promise.resolve(alert("Shoppingcar clicked"))}
                    onSearchClick={searchTerm => Promise.resolve(alert(searchTerm))}
                    fetchShoppingCartAsync={() => TestApplicationController.fetchShoppingCartAsync()}
                    cookieConsent={() => this.cookieContent}
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