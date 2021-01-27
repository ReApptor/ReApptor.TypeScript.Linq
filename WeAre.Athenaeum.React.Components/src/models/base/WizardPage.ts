import {PageRoute, SwipeDirection, PageRouteProvider, IBasePage, ch} from "@weare/athenaeum-react-common";
import AuthorizedPage from "./AuthorizedPage";

export interface IWizardPage extends IBasePage {
    prevAsync(): Promise<void>;
    nextAsync(): Promise<void>;
}

export default abstract class WizardPage<TProps = {}, TState = {}> extends AuthorizedPage<TProps, TState> implements IWizardPage {

    protected async redirectPrevAsync(route: PageRoute) {
        if (this.isMounted) {
            await ch.swipeRightAsync();
            await PageRouteProvider.redirectAsync(route);
        }
    }

    protected async redirectNextAsync(route: PageRoute): Promise<void> {
        if (this.isMounted) {
            await ch.swipeLeftAsync();
            await PageRouteProvider.redirectAsync(route);
        }
    }

    public async prevAsync(): Promise<void> {
    }

    public async nextAsync(): Promise<void> {
    }

    public async onSwipeHandlerAsync(direction: SwipeDirection): Promise<boolean> {
        switch (direction) {
            case SwipeDirection.Right:
                //prev:
                await this.prevAsync();
                return false;

            case SwipeDirection.Left:
                //next:
                await this.nextAsync();
                return false;
        }
        return true;
    }
}