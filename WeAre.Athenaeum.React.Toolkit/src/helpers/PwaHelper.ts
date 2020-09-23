
export type PwaInitializeCallback = () => Promise<void>;

interface ChoiceResult {
    outcome: "accepted" | "dismissed";
    platform: string;    
}

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 */
interface BeforeInstallPromptEvent extends Event {

    /**
     * Returns an array of DOMString items containing the platforms on which the event was dispatched.
     * This is provided for user agents that want to present a choice of versions to the user such as,
     * for example, "web" or "play" which would allow the user to chose between a web version or
     * an Android version.
     */
    readonly platforms: Array<string>;

    /**
     * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
     */
    readonly userChoice: Promise<ChoiceResult>;

    /**
     * Allows a developer to show the install prompt at a time of their own choosing.
     * This method returns a Promise.
     */
    prompt(): Promise<void>;
}

class PwaHelper {

    private _deferredPrompt: BeforeInstallPromptEvent | null = null;
    private _initializeCallback: PwaInitializeCallback | null = null;
    private _accepted: boolean = false;

    public onBeforeInstallPrompt(e: Event): void {
        // Prevent the mini info bar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        this._deferredPrompt = e as BeforeInstallPromptEvent;
        // Callback
        if (this._initializeCallback) {
            this._initializeCallback();
            this._initializeCallback = null;
        }
    };

    public async installAsync(): Promise<boolean> {
        if (this._deferredPrompt) {
            // Show the install prompt
            await this._deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            const result: ChoiceResult = await this._deferredPrompt.userChoice;
            if (result.outcome == "accepted") {
                this._accepted = true;
                return true;
            }
        }
        return false;
    }

    public get initialized(): boolean {
        return (!!this._deferredPrompt);
    }

    public get canBeInstalled(): boolean {
        return (this.initialized) && (!this._accepted);
    }

    public subscribe(initializeCallback: PwaInitializeCallback): void {
        if (this.initialized) {
            initializeCallback();
        } else {
            this._initializeCallback = initializeCallback;
        }
    }
}

export default new PwaHelper();