import { BasePage, ch, PageRoute, PageRouteProvider } from "@weare/athenaeum-react-common";
import UserContext from "../server/UserContext";
import User from "../server/User";

export default abstract class AuthorizedPage<TProps = {}, TState = {}> extends BasePage<TProps, TState, UserContext> {
    public get isAcceptedRegulations(): boolean {
        const user: User | null = ch.findUser();
        return (user != null) && (user.agreementAccepted && user.registrationAccepted);
    }
    
    public getUser(): User {
        return ch.getUser();
    }
    
    public getUserId(): string {
        return ch.getUserId();
    }
    
    public async initializeAsync(): Promise<void> {

        //  Copied from providers/PageDefinitions.ts
        const loginRouteName: string = "Login";
        const loginRoute: PageRoute = new PageRoute(loginRouteName);
        
        if (!this.isAuthorized) {
            await PageRouteProvider.redirectAsync(loginRoute, true, true);
        }

        await super.initializeAsync();
        
        if (!this.isAcceptedRegulations) {
            await this.alertWarningAsync("MyAccountPage.Acceptance.Required");
        }
    }
}