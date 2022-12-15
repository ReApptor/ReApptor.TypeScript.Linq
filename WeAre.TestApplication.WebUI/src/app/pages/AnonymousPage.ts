import {ApplicationContext, BasePage, TBasePageParameters} from "@weare/reapptor-react-common";

export default abstract class AnonymousPage<TParams extends TBasePageParameters = {}, TState = {}>
    extends BasePage<TParams, TState, ApplicationContext> {

    protected get typedParameters(): TParams | null {
        return this.parameters as TParams;
    }

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();
    }

    public get automaticUrlChange(): boolean {
        return true;
    }
}