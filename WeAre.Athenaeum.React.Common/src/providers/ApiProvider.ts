/**
 * API provider
 */
import {AthenaeumConstants, Utility} from "@weare/athenaeum-toolkit";
import {IBaseComponent} from "../base/BaseComponent";
import {IBasePage, ILayoutPage} from "../base/BasePage";
import ServerError from "../models/ServerError";
import IUser from "../models/IUser";
import IResponseContainer from "../models/IResponseContainer";
import PageRouteProvider from "./PageRouteProvider";
import ch from "./ComponentHelper";

export default class ApiProvider {

    private static _isSpinning: number = 0;
    private static _manualSpinning: boolean = false;
    private static readonly _loadingCallbacks: ((isLoading: boolean) => Promise<void>)[] = [];
    
    private static async invokeLoadingCallbacksAsync(obsolete: boolean): Promise<void> {
        const isLoading: boolean = this.isLoading;
        if (isLoading != obsolete) {
            await Utility.forEachAsync(this._loadingCallbacks, async (callback) => await callback(isLoading));
        }
    }

    private static get offline(): boolean {
        return (navigator) && (!navigator.onLine);
    }
    
    private static async setAutoIsSpinningAsync(isSpinning: boolean, caller: IBaseComponent | null): Promise<void> {
        if (!this._manualSpinning) {
            const isLoading: boolean = this.isLoading;
            this._isSpinning += (isSpinning) ? +1 : -1;
            if (caller) {
                if (caller.hasSpinner()) {
                    await caller.setSpinnerAsync(isSpinning);
                } else {
                    const layout: ILayoutPage = ch.getLayout();
                    await layout.setSpinnerAsync(isSpinning);
                }
            }
            await this.invokeLoadingCallbacksAsync(isLoading);
        }
    }

    private static async setManualIsSpinningAsync(isSpinning: boolean): Promise<void> {
        const isLoading: boolean = this.isLoading;
        this._manualSpinning = isSpinning;
        const layout: ILayoutPage = ch.getLayout();
        await layout.setSpinnerAsync(isSpinning);
        await this.invokeLoadingCallbacksAsync(isLoading);
    }

    private static setHeaders(httpRequest: RequestInit, setContentType: boolean = true) {
        const headers = (httpRequest.headers)
            ? new Headers(httpRequest.headers)
            : new Headers();
        
        //Content Type
        if (setContentType) {
            headers.set("Content-Type", "application/json");
        }
        
        //XSRT Token
        const xsrfToken: string | null = ch.getXsrfToken();
        if (xsrfToken != null) {
            headers.set("xsrf-token", xsrfToken);
        }
        
        httpRequest.credentials = "include";

        httpRequest.headers = headers;
    }
    
    private static ignoreException(endpoint: string): boolean {
        return (endpoint.endsWith("/OnJsError")) || (endpoint.endsWith("/OnRedirect"));
    }

    private static async fetchAsync<TResponse>(endpoint: string, httpRequest: RequestInit, caller: IBaseComponent | null): Promise<TResponse> {
        try {
            await this.setAutoIsSpinningAsync(true, caller);

            const httpResponse: Response = await fetch(endpoint, httpRequest);

            const apiResponse: any | null = await this.processServerResponseAsync(httpResponse);

            const dataResponse: TResponse = ((apiResponse != null) ? apiResponse : {}) as TResponse;

            return dataResponse;
        } catch (e) {

            if (this.offline) {
                await PageRouteProvider.offline();
            } else {
                const ignore: boolean = (ApiProvider.isApiError(e)) || (ApiProvider.ignoreException(endpoint));
                if (!ignore) {
                    await PageRouteProvider.exception(e);
                }
            }

            throw new Error(AthenaeumConstants.apiError);
            
        } finally {
            await this.setAutoIsSpinningAsync(false, caller);
        }
    }

    private static isAntiForgeryError(httpResponse: Response, jsonResponse: any | null): boolean {
        //{ "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1", "title": "Bad Request", "status": 400, "traceId": "0HLLSRLLJPHV2:00000009" }
        return ((httpResponse.status === AthenaeumConstants.badRequestStatusCode) &&
            (jsonResponse != null) &&
            (jsonResponse.title === "Bad Request") &&
            (jsonResponse.type === "https://tools.ietf.org/html/rfc7231#section-6.5.1"));
    }

    private static parseJsonError(jsonResponse: any | null): ServerError {
        let requestId: string = "";
        let debugDetails: string = "";

        if (jsonResponse != null) {
            if (jsonResponse.traceId) {
                requestId = jsonResponse.traceId;
            }
            if (jsonResponse.title) {
                debugDetails = jsonResponse.title + "\n";
            }
            if ((jsonResponse.errors) && (typeof jsonResponse.errors === "object")) {
                let errors: any = jsonResponse.errors;
                for (var propertyName in errors) {
                    if (errors.hasOwnProperty(propertyName)) {
                        let property: any | null = errors[propertyName];
                        if ((property != null) && (property.length != null)) {
                            if (typeof property === "string") {
                                debugDetails += property + "\n";
                            } else {
                                debugDetails += property.join("\n");
                            }
                        }
                    }
                }
            }
        }

        const serverError: ServerError = {
            requestId: requestId,
            debugDetails: debugDetails
        };

        return serverError;
    }

    private static async processServerResponseAsync(httpResponse: Response): Promise<any | null> {

        const textResponse: string = await httpResponse.text();
        const endpoint: string = httpResponse.url;
        
        if (ApiProvider.ignoreException(endpoint)) {
            throw new Error(AthenaeumConstants.apiError);
        }

        if (httpResponse.status === AthenaeumConstants.notFoundStatusCode) {
            const serverError: ServerError = {
                requestId: "",
                debugDetails: `Requested api action not found (404): "${endpoint}".\nServer response:\n${textResponse.trim()}`
            };
            await PageRouteProvider.error(serverError);            
            throw new Error(AthenaeumConstants.apiError);
        }

        const hasResponse = (textResponse.length > 0);
        const isHtml = (hasResponse) && ((textResponse.startsWith("<!DOCTYPE html>") || (textResponse.startsWith("<!doctype html>"))));
        if (isHtml) {
            const isMaintenanceOrBlocked: boolean = (textResponse.indexOf("Renta Task Support") > 0) || (textResponse.indexOf("Site Maintenance") > 0);
            if (isMaintenanceOrBlocked) {
                ch.refresh();
            } else if (!this.offline) {
                const offlineOrRequestIsTooBif: boolean = (endpoint.endsWith("offline.html")) && (httpResponse.status == 200);
                const debugDetails: string = (offlineOrRequestIsTooBif)
                    ? `Server returned HTML instead of JSON response, probably server is offline or request body is too big.`
                    : `Server returned HTML instead of JSON response, probably requested api action not found.`;
                
                const serverError: ServerError = {
                    requestId: "",
                    debugDetails: debugDetails + `\nEndpoint: "${endpoint}"\nServer response code: "${httpResponse.status}".\nServer response:\n${textResponse.trim()}}`
                };
                
                await PageRouteProvider.error(serverError);
            }
            
            throw new Error(AthenaeumConstants.apiError);
        }
        
        const jsonResponse: any | null = (hasResponse) ? JSON.parse(textResponse) : null;

        if ((httpResponse.status === AthenaeumConstants.unauthorizedStatusCode) ||
            (ApiProvider.isAntiForgeryError(httpResponse, jsonResponse))) {
            await ch.reinitializeContextAsync();
            throw new Error(AthenaeumConstants.apiError);
        }

        if (httpResponse.status === AthenaeumConstants.forbiddenStatusCode) {
            const page: IBasePage | null = ch.findPage();
            const user: IUser | null = ch.findUser();
            const username: string = (user) ? user.username : "unauthorized";
            const source: string = (page) ? page.routeName : "unknown";
            const serverError: ServerError = {
                requestId: "",
                debugDetails: `Access denied.\nSource: "${source}"\nUser: "${username}".\nEndpoint: "${endpoint}".`
            };
            await PageRouteProvider.error(serverError);
            throw new Error(AthenaeumConstants.apiError);
        }

        if (httpResponse.status === AthenaeumConstants.badRequestStatusCode) {            
            const serverError: ServerError = ApiProvider.parseJsonError(jsonResponse);
            await PageRouteProvider.error(serverError);            
            throw new Error(AthenaeumConstants.apiError);
        }

        if (httpResponse.status !== AthenaeumConstants.okStatusCode) {
            const serverError: ServerError = {
                requestId: "",
                debugDetails: `Endpoint: "${endpoint}"\nServer response status code: "${httpResponse.status}".`
            };
            await PageRouteProvider.error(serverError);
            throw new Error(AthenaeumConstants.apiError);
        }

        if (jsonResponse != null) {
            
            const responseContainer = jsonResponse as IResponseContainer;
            
            if ((responseContainer) && (responseContainer.isResponseContainer)) {
                const value = responseContainer.value;

                if (responseContainer.unauthorized) {
                    await ch.reinitializeContextAsync();
                    throw new Error(AthenaeumConstants.apiError);
                }

                if (responseContainer.context) {
                    await ch.setContextAsync(responseContainer.context);
                }

                if (responseContainer.error != null) {
                    await PageRouteProvider.error(responseContainer.error);
                    throw new Error(AthenaeumConstants.apiError);
                }

                if (responseContainer.redirect) {
                    await PageRouteProvider.redirectAsync(responseContainer.redirect, true);
                }

                if (responseContainer.alert) {
                    await ch.alertAsync(responseContainer.alert);
                }

                if (value != null) {
                    Utility.restoreDate(value);
                }

                return value;
            }
        }

        return jsonResponse;
    }

    public static async invokeWithForcedSpinnerAsync<T>(action: () => Promise<T>, eternal: boolean = false): Promise<T> {
        try {
            await this.setManualIsSpinningAsync(true);
            const result: T = await action();
            if (!eternal) {
                await this.setManualIsSpinningAsync(false);
            }
            return result;
        } catch (e) {
            await this.setManualIsSpinningAsync(false);
            throw e;
        }
    }

    public static registerIsLoadingCallback(callback: () => Promise<void>): void {
        this._loadingCallbacks.push(callback);
    }

    public static unRegisterIsLoadingCallback(callback: () => Promise<void>): void {
        const index: number = this._loadingCallbacks.indexOf(callback);
        if (index !== -1) {
            this._loadingCallbacks.splice(index, 1);
        }
    }

    public static get isLoading(): boolean {
      return (this._manualSpinning) || (this._isSpinning > 0);
    }

    public static async getAsync<TResponse>(endpoint: string, caller: IBaseComponent | null): Promise<TResponse> {
        const httpRequest = {
            url: endpoint, 
            method: "GET"
        } as RequestInit;
        
        this.setHeaders(httpRequest);

        const response: TResponse = await this.fetchAsync<TResponse>(endpoint, httpRequest, caller);
        
        return response;
    }

    public static async postFileAsync<TResponse>(endpoint: string, request: any | null = null, caller: IBaseComponent | null = null): Promise<TResponse> {

        const formData = new FormData();
        
        formData.append("file", request);
        
        const httpRequest = {
            url: endpoint,
            body: formData,
            method: "POST"
        } as RequestInit;
        
        this.setHeaders(httpRequest, false);

        const response: TResponse = await this.fetchAsync<TResponse>(endpoint, httpRequest, caller);
        
        return response;
    }

    public static async postAsync<TResponse>(endpoint: string, request: any | null = null, caller: IBaseComponent | null = null): Promise<TResponse> {
        request = (request != null) ? request : {};
        
        const json: string = JSON.stringify(request);
        
        const httpRequest = {
            url: endpoint,
            body: json,
            method: "POST"
        } as RequestInit;
        
        this.setHeaders(httpRequest);

        const response: TResponse = await this.fetchAsync<TResponse>(endpoint, httpRequest, caller);
        
        return response;
    }

    public static isApiError(error: Error): boolean {
        return ((error.name == AthenaeumConstants.apiError) || (error.message == AthenaeumConstants.apiError));
    }
}