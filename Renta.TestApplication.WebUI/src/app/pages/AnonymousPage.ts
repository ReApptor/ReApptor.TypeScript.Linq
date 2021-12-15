import {ApplicationContext, BasePage} from "@weare/athenaeum-react-common";


export default abstract class AnonymousPage<TParams = {}, TState = {}>
    extends BasePage<TParams, TState, ApplicationContext> {

    protected get typedParameters(): TParams {
        return this.parameters as TParams;
    }

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();
    }

    public get automaticUrlChange(): boolean {
        return true;
    }
}