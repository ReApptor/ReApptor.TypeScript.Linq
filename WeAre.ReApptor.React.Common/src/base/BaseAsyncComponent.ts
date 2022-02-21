import BaseComponent, {IBaseComponent} from "./BaseComponent";
import PageRouteProvider from "../providers/PageRouteProvider";


/**
 * An {@link IBaseComponent} which loads data asynchronously.
 */
export interface IAsyncComponent extends IBaseComponent {

    /**
     * @return Is the {@link IAsyncComponent} asynchronous.
     */
    isAsync(): boolean;

    /**
     * Reload the {@link IAsyncComponent}'s data.
     */
    reloadAsync(): Promise<void>;

    /**
     * Is the {@link IAsyncComponent} loading data.
     */
    isLoading: boolean;
}

export interface IBaseAsyncComponentState<TData> {

    /**
     * Is the component currently loading data.
     */
    isLoading: boolean;

    /**
     * Asynchronously loaded data of the component.
     */
    data: TData | null;
}

/**
 * Base class for all asynchronous components.
 */
export default abstract class BaseAsyncComponent<TProps, TState
    extends IBaseAsyncComponentState<TData>, TData = {}>
    extends BaseComponent<TProps, TState>
    implements IAsyncComponent {

    private readonly _isAsync: boolean;

    protected constructor(props: TProps) {
        super(props);

        this._isAsync = ((props)
                ? ((props as any).isAsync as boolean | null)
                : null)
            ?? true;
    }

    /**
     * Fetch data via HTTP GET from the endpoint specified in {@link getEndpoint}.
     * @return Data returned by the endpoint.
     */
    protected async fetchDataAsync(): Promise<TData> {
        const endpoint: string = this.getEndpoint();
        return await this.getAsync<TData>(endpoint);
    }

    /**
     * Reload the {@link BaseAsyncComponent}'s data if it is not already loaded or loading.
     * @param reload Should reload be forced if the data is already loaded.
     */
    protected async invokeReloadDataAsync(reload: boolean = false): Promise<void> {
        if ((this.isMounted) && (this.isAsync()) && (!this.isLoading) && (this.canReload())) {
            try {
                let state: TState = this.state;

                if ((reload) || (state.data == null)) {
                    state.isLoading = true;

                    await this.setState(state);

                    const data: TData = await this.fetchDataAsync();

                    state = this.state;

                    state.data = data;

                    await this.processDataAsync(state, data);

                    state.isLoading = false;

                    if (this.isMounted) {
                        await this.setState(state);
                    }
                }
            } catch (e) {
                if (this.isMounted) {
                    await this.setState({isLoading: false});
                }

                // @ts-ignore
                await PageRouteProvider.exception(e);
            }
        }
    }

    /**
     * Does nothing.
     */
    protected async processDataAsync(state: TState, data: TData | null): Promise<void> {
    }

    /**
     * Endpoint the {@link BaseAsyncComponent}'s data is loaded from.
     */
    protected abstract getEndpoint(): string;

    /**
     * Does the {@link BaseAsyncComponent} have asynchronously loaded data.
     */
    public get hasData(): boolean {
        return (this.state.data != null);
    }

    /**
     * Can the {@link BaseAsyncComponent} be reloaded.
     * @return true
     */
    public canReload(): boolean {
        return true;
    }

    /**
     * Call {@link reloadAsync} without awaiting.
     */
    public reload(): void {
        // reload without await
        // noinspection JSIgnoredPromiseFromCall
        this.invokeReloadDataAsync(true);
    }


    // BaseComponent

    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        await this.invokeReloadDataAsync();
    }

    /**
     * @inheritDoc
     *
     * NOTE: Can return true only if {@link hasSpinner} is overridden to return true.
     */
    public isSpinning(): boolean {
        return (this.hasSpinner()) && (this.isLoading || super.isSpinning());
    }


    // IAsyncComponent
    
    public isAsync(): boolean {
        return (this._isAsync) && (this.getEndpoint().length > 0);
    }

    public async reloadAsync(): Promise<void> {
        await this.invokeReloadDataAsync(true);
    }

    public get isLoading(): boolean {
        return this.state.isLoading;
    }
}