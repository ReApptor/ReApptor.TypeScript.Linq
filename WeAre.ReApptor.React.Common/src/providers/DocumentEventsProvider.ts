import React from "react";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import ApiProvider from "./ApiProvider";

export enum DocumentEventType {
    Mousedown,

    Keydown,

    Resize,

    Scroll,

    IsLoading
}

export type DocumentEventCallback = (e: React.SyntheticEvent) => Promise<void>;

class DocumentEventsProvider {

    private readonly _mousedownEvents: Dictionary<string, DocumentEventCallback> = new Dictionary<string, DocumentEventCallback>();
    private readonly _keydownEvents: Dictionary<string, DocumentEventCallback> = new Dictionary<string, DocumentEventCallback>();
    private readonly _resizeEvents: Dictionary<string, DocumentEventCallback> = new Dictionary<string, DocumentEventCallback>();
    private readonly _scrollEvents: Dictionary<string, DocumentEventCallback> = new Dictionary<string, DocumentEventCallback>();
    private readonly _isLoadingEvents: Dictionary<string, DocumentEventCallback> = new Dictionary<string, DocumentEventCallback>();

    private getContainer(event: DocumentEventType): Dictionary<string, any> {
        switch (event) {
            case DocumentEventType.Mousedown: return this._mousedownEvents;
            case DocumentEventType.Keydown: return this._keydownEvents;
            case DocumentEventType.Resize: return this._resizeEvents;
            case DocumentEventType.Scroll: return this._scrollEvents;
            case DocumentEventType.IsLoading: return this._isLoadingEvents;
            default: throw Error(`DocumentEventsProvider. Unknown document event type "${event}". Container cannot be found.`);
        }
    }

    private async callAsync(event: DocumentEventType, e: any): Promise<void> {
        const container: Dictionary<string, any> = this.getContainer(event);
        const callbacks: DocumentEventCallback[] = container.values();
        const length: number = callbacks.length;
        for (let i = 0; i < length; i++) {
            try {
                await callbacks[i](e);
            }
            catch {
            }
        }
    }

    public constructor() {
        document.addEventListener("mousedown", async (e) => await this.callAsync(DocumentEventType.Mousedown, e), false);
        document.addEventListener("keydown", async (e) => await this.callAsync(DocumentEventType.Keydown, e), false);
        window.addEventListener("resize", async (e) => await this.callAsync(DocumentEventType.Resize, e), false);
        window.addEventListener("scroll", async (e) => await this.callAsync(DocumentEventType.Scroll, e), false);
        //window.addEventListener("offline", async (e) => await ch.alertErrorAsync("You are offline", false, true), false);
        //window.addEventListener("online", async (e) => await ch.flyoutMessageAsync("You are back online"), false);
        ApiProvider.registerIsLoadingCallback(async () => await this.callAsync(DocumentEventType.IsLoading, null));
    }

    public register(id: string, event: DocumentEventType, callback: DocumentEventCallback): void {
        const container: Dictionary<string, any> = this.getContainer(event);
        container.setValue(id, callback);
    }

    public unregister(id: string, event: DocumentEventType): void {
        const container: Dictionary<string, any> = this.getContainer(event);
        container.remove(id);
    }
}

export default new DocumentEventsProvider();