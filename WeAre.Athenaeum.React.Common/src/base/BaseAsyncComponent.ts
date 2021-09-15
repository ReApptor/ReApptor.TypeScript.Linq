import BaseComponent, {IBaseComponent} from "./BaseComponent";
import PageRouteProvider from "../providers/PageRouteProvider";

export interface IAsyncComponent extends IBaseComponent {
    isAsync(): boolean;
    reloadAsync(): Promise<void>;
    isLoading: boolean;
}

export interface IBaseAsyncComponentState<TData> {
    isLoading: boolean;
    data: TData | null;
}

export default abstract class BaseAsyncComponent<TProps, TState extends IBaseAsyncComponentState<TData>, TData = {}>
    extends BaseComponent<TProps, TState> implements IAsyncComponent {

    private readonly _isAsync: boolean;

    protected async fetchDataAsync(): Promise<TData> {
        const endpoint: string = this.getEndpoint();
        return await this.getAsync<TData>(endpoint);
    }

    public get isLoading(): boolean {
        return this.state.isLoading;
    }

    public isSpinning(): boolean {
        return (this.hasSpinner()) && (this.isLoading || super.isSpinning());
    }

    public isAsync(): boolean {
        return (this._isAsync) && (this.getEndpoint().length > 0);        
    }
    
    public get hasData(): boolean {
        return (this.state.data != null);
    }

    public canReload(): boolean {
        return true;
    }

    public async reloadAsync(): Promise<void> {
        await this.invokeReloadDataAsync(true);
    }

    public reload(): void {
        // reload without await
        // noinspection JSIgnoredPromiseFromCall
        this.invokeReloadDataAsync(true);
    }
    
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
                
                await PageRouteProvider.exception(e);
            }
        }
    }

    protected async processDataAsync(state: TState, data: TData | null): Promise<void> {
    }
    
    protected abstract getEndpoint(): string;

    protected constructor(props: TProps) {
        super(props);

        this._isAsync = ((props) ? ((props as any).isAsync as boolean | null) : null) ?? true;
    }

    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        await this.invokeReloadDataAsync();
    }
}