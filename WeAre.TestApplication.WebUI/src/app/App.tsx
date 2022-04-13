import React from "react";
import {BaseComponent, ch, UserInteractionDataStorage} from "@weare/reapptor-react-common";
import {AddressHelper, BannerPosition, ICookieConsentProps, Layout} from "@weare/reapptor-react-components";
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
                    profile={TestApplicationController.profile}
                    onShoppingCartClick={(sender) => Promise.resolve(alert("Shoppingcar clicked"))}
                    onSearchClick={searchTerm => Promise.resolve(alert(searchTerm))}
                    fetchShoppingCartAsync={() => TestApplicationController.fetchShoppingCartAsync()}
                    cookieConsent={() => this.cookieContent}
                    leftNav={() => TestApplicationController.leftNav}
                    notifications={() => TestApplicationController.getNotifications()}
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