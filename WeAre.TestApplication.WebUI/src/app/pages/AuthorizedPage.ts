import {PageRouteProvider} from "@weare/reapptor-react-common";
import AnonymousPage from "./AnonymousPage";
import PageDefinitions from "./PageDefinitions";


export default abstract class AuthorizedPage<TParams = {}, TState = {}>
    extends AnonymousPage<TParams, TState> {

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();

        if (!this.isAuthorized) {

            console.log("Unauthorized, redirecting...");

            await PageRouteProvider.redirectAsync(PageDefinitions.anonymousWithParams({hello: "",world: this.getPage().route}));
        }
    }

    public get automaticUrlChange(): boolean {
        return true;
    }
}