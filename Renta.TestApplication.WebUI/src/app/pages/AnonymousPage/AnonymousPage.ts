import {ApplicationContext, BasePage, PageRouteProvider} from "@weare/athenaeum-react-common";

export default abstract class AnonymousPage<TProps = {}, TState = {}>
    extends BasePage<TProps, TState, ApplicationContext> {
    
    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();
    }
}