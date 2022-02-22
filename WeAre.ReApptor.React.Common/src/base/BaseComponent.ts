import React, {RefObject} from "react";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import { Utility } from "@weare/reapptor-toolkit";
import ReactUtility from "../ReactUtility";
import ApiProvider from "../providers/ApiProvider";
import PageCacheProvider from "../providers/PageCacheProvider";
import {IBasePage} from "./BasePage";
import ch from "../providers/ComponentHelper";
import JQueryUtility from "../JQueryUtility";
import DocumentEventsProvider, {DocumentEventType} from "../providers/DocumentEventsProvider";


export type RenderCallback = (sender: IBaseComponent) => string | React.ReactNode;

export interface IChildrenProps {
    children?: React.ReactNode;
}

/**
 * A {@link React} component.
 */
export interface IReactComponent {

    /**
     * Is the {@link IReactComponent} currently mounted to the DOM.
     */
    isMounted: boolean;

    /**
     * @see React.Component.render
     */
    render(): React.ReactNode;

    /**
     * @see React.Component.componentWillMount
     */
    componentWillMount?(): Promise<void>;

    /**
     * @see React.Component.componentDidMount
     */
    componentDidMount?(): Promise<void>;

    /**
     * @see React.Component.componentWillReceiveProps
     */
    componentWillReceiveProps?(props: any): Promise<void>;

    /**
     * @see React.Component.componentWillUnmount
     */
    componentWillUnmount?(): Promise<void>;
}

/**
 * A component which can have a spinner.
 */
export interface ISpinner {

    /**
     * @return Can the {@link ISpinner} have a spinner.
     */
    hasSpinner(): boolean;

    /**
     * @return Does the {@link ISpinner} currently have a spinner.
     */
    isSpinning(): boolean;

    /**
     * Set {@link isSpinning} to the given value.
     *
     * @param isSpinning Does the {@link ISpinner} have a spinner.
     */
    setSpinnerAsync(isSpinning: boolean): Promise<void>;
}

export interface IBaseClassNames {
    [key: string]: string | undefined;
}

/**
 * An UI component.
 */
export interface IBaseComponent extends IReactComponent, ISpinner {

    /**
     * All {@link IBaseComponent} children of the {@link IBaseComponent}.
     */
    readonly childComponents: IBaseComponent[];

    /**
     * Is the current user agent a desktop computer.
     */
    readonly desktop: boolean;

    /**
     * Id of the {@link IBaseComponent}.
     */
    readonly id: string;

    /**
     * Is the current user agent a mobile device.
     */
    readonly mobile: boolean;

    /**
     * Name of the {@link IBaseComponent}'s constructor.
     */
    readonly typeName: string;

    /**
     * @see React.Component.props
     */
    readonly props: object;

    /**
     * @return The currently active {@link IBasePage}.
     */
    getPage(): IBasePage;

    /**
     * @return Is the {@link IBaseComponent} a component.
     */
    isComponent(): boolean;

    /**
     * @param includeMargin Should margin be included in the calculation.
     * @return The outer height of the {@link IBaseComponent}'s element in DOM.
     */
    outerHeight(includeMargin?: boolean): number;

    /**
     * @param includeMargin Should margin be included in the calculation.
     * @return The outer width of the {@link IBaseComponent}'s element in DOM.
     */
    outerWidth(includeMargin?: boolean): number;

    /**
     * Make an HTTP GET request to the given endpoint, setting a spinner to the {@link IBaseComponent}.
     * @param endpoint Endpoint to send the HTTP GET request to.
     */
    getAsync<TResponse>(endpoint: string): Promise<TResponse>;

    /**
     * Make an HTTP POST request to the given endpoint, setting a spinner to the {@link IBaseComponent}.
     * @param endpoint Endpoint to send the HTTP GET request to.
     * @param request Body of the HTTP POST request.
     */
    postAsync<TResponse>(endpoint: string, request: any | null): Promise<TResponse>;

    /**
     * Re-render the {@link IBaseComponent}.
     */
    reRenderAsync(): Promise<void>;

    hasSpinner(): boolean; // Duplicated from ISpinner
}

export interface IGlobalResize {
    onGlobalResize(e: React.SyntheticEvent): Promise<void>;
}

export interface IGlobalClick {
    onGlobalClick(e: React.SyntheticEvent): Promise<void>;
}

export interface IGlobalKeydown {
    onGlobalKeydown(e: React.SyntheticEvent): Promise<void>;
}

export interface IContainer {
    height(): number;
}

/**
 * Base class for all components.
 */
export default abstract class BaseComponent<TProps = {}, TState = {}>
    extends React.Component<TProps, TState>
    implements IBaseComponent {

    private readonly _asGlobalClick: IGlobalClick | null;
    private readonly _asGlobalKeydown: IGlobalKeydown | null;
    private readonly _asGlobalResize: IGlobalResize | null;
    private _childComponentIds: Dictionary<string, React.RefObject<IBaseComponent>>;
    private _childComponentRefs: React.RefObject<IBaseComponent>[];
    private _isMounted: boolean;
    private _isSpinning: boolean;

    protected constructor(props: TProps) {
        super(props);

        this._asGlobalClick = this.asGlobalClick();
        this._asGlobalKeydown = this.asGlobalKeydown();
        this._asGlobalResize = this.asGlobalResize();
        this._childComponentIds = new Dictionary<string, React.RefObject<IBaseComponent>>();
        this._childComponentRefs = [];
        this._isMounted = false;
        this._isSpinning = false;

        const id: string | null = (props)
            ? (props as any).id
            : ch.getComponentId();

        this.id = (id != null)
            ? id
            : ch.getComponentId();

        this.typeName = this.constructor.name;

        ch.register(this);
    }

    private asGlobalClick(): IGlobalClick | null {
        const instance = (this as any) as (IGlobalClick | null);
        if ((instance != null) && (typeof instance.onGlobalClick === "function")) {
            return instance;
        }
        return null;
    }

    private asGlobalKeydown(): IGlobalKeydown | null {
        const instance = (this as any) as (IGlobalKeydown | null);
        if ((instance != null) && (typeof instance.onGlobalKeydown === "function")) {
            return instance;
        }
        return null;
    }

    private asGlobalResize(): IGlobalResize | null {
        const instance = (this as any) as (IGlobalResize | null);
        if ((instance != null) && (typeof instance.onGlobalResize === "function")) {
            return instance;
        }
        return null;
    }

    private clone(element: React.ReactElement): React.ReactElement {
        if (BaseComponent.isComponent(element)) {
            const expandedProps: any | null = this.extendChildProps(element);
            const id: string = (element.props.id || ch.getComponentId());
            let ref: RefObject<IBaseComponent> | null = (element as any).ref;
            if (ref == null) {
                ref = this._childComponentIds.getValue(id) || null;
                if (ref == null) {
                    ref = React.createRef<IBaseComponent>();
                    this._childComponentIds.setValue(id, ref);
                }
            }
            this._childComponentRefs.push(ref);
            const newProps: any = { ...element.props, ref: ref, id: id, ...expandedProps };
            return React.cloneElement(element, newProps);
        }
        return element;
    }

    /**
     * @return null
     */
    protected extendChildProps(element: React.ReactElement): any | null {
        return null;
    }

    /**
     * @param element Value to check for componentness.
     * @return Is the value a component.
     */
    public static isComponent(element: any | null): boolean {

        if (element != null) {
            if ((element.isComponent !== undefined) && (typeof element.isComponent === "function") && (element.isComponent())) {
                return true;
            }
            let prototype: any = element.type;
            while ((prototype) && (prototype.name) && (prototype.name !== Object.name)) {
                if (prototype.name === BaseComponent.name) {
                    return true;
                }
                prototype = Object.getPrototypeOf(prototype);
            }
        }

        return false;
    }

    /**
     * @return {@link JQueryUtility.$}
     */
    protected get JQuery(): JQueryStatic {
        return JQueryUtility.$;
    }

    /**
     * @return The {@link BaseComponent}'s node in DOM as {@link jQuery}.
     */
    protected getNode(): JQuery {
        return this.JQuery(`#${this.id}`);
    }

    /**
     * @see ILayoutPage.useRouting
     */
    protected get useRouting(): boolean {
        // noinspection PointlessBooleanExpressionJS - useRouting can be undefined.
        return (ch.getLayout().useRouting === true);
    }

    public get children(): React.ReactElement[] {
        this._childComponentRefs = [];

        let children: any = this.props.children as any;
        if (children && children.type && children.type.toString && children.type.toString() === "Symbol(react.fragment)") {
            children = children.props.children;
        }

        const clone: React.ReactElement[] | null | undefined = React.Children.map(children, (child) => {
            const element = child as React.ReactElement;
            return this.clone(element);
        });

        return clone || [];
    }

    /**
     * @see ch.mobileApp
     */
    public get mobileApp(): boolean {
        return ch.mobileApp;
    }

    /**
     * @see ch.isAuthenticated
     */
    public get isAuthenticated(): boolean {
        return ch.isAuthenticated;
    }

    /**
     * @see ApiProvider.postFileAsync
     */
    public async postFileAsync<TResponse>(endpoint: string, file: any | null = null): Promise<TResponse> {
        return await ApiProvider.postFileAsync<TResponse>(endpoint, file, this);
    }

    public async postCacheAsync<TResponse>(endpoint: string, ttl: number = 0): Promise<TResponse> {
        return await PageCacheProvider.getAsync(endpoint, async () => await this.postAsync(endpoint), ttl);
    }

    /**
     * Call {@link reRenderAsync} without awaiting.
     */
    public reRender(): void {
        // noinspection JSIgnoredPromiseFromCall
        this.reRenderAsync();
    }

    /**
     * @param id Id of the child {@link IBaseComponent} to find.
     * @return A child {@link IBaseComponent} with the given id, or null if not found.
     */
    public findComponent(id: string): IBaseComponent | null {
        return this.childComponents.find(component => component.id === id) as IBaseComponent | null;
    }

    /**
     * @see Utility.copyTo
     */
    public copyTo(from: Dictionary<string, any> | any, ...to: any[]): void {
        Utility.copyTo(from, ...to);
    }

    /**
     * @see Utility.css
     */
    public css(...params: (readonly string[] | string | null | undefined | false | (() => (readonly string[] | string | null | undefined | false)))[]): string {
        return Utility.css(...params);
    }

    public cssIf(className: string | null | undefined, add: boolean, css: string): string {
        const items: string[] = (className) ? className.split(" ") : [];
        const index: number = items.indexOf(css);
        if (add) {
            if (index === -1) {
                items.push(css);
                return items.join(" ");
            }
        } else {
            if (index !== -1) {
                items.splice(index, 1);
                return items.join(" ");
            }
        }

        return className || "";
    }

    /**
     * @see ReactUtility.toSingleLine
     */
    public toSingleLine(text: string | null | undefined): string {
        return ReactUtility.toSingleLine(text);
    };

    /**
     * @see ReactUtility.toMultiLines
     */
    public toMultiLines(text: string | null | undefined): any[] {
        return ReactUtility.toMultiLines(text);
    }

    /**
     * Called by {@link componentWillMount}.
     */
    public async initializeAsync(): Promise<void> {
    }

    // IReactComponent

    public get isMounted(): boolean {
        return this._isMounted;
    }

    public async componentWillMount(): Promise<void> {
        await this.initializeAsync();
    }

    public async componentDidMount(): Promise<void> {
        this._isMounted = true;

        if (this._asGlobalClick) {
            DocumentEventsProvider.register(this.id, DocumentEventType.Mousedown, (e: React.SyntheticEvent) => this._asGlobalClick!.onGlobalClick(e));
        }

        if (this._asGlobalKeydown) {
            DocumentEventsProvider.register(this.id, DocumentEventType.Keydown,  (e: React.SyntheticEvent) => this._asGlobalKeydown!.onGlobalKeydown(e));
        }

        if (this._asGlobalResize) {
            DocumentEventsProvider.register(this.id, DocumentEventType.Resize,  (e: React.SyntheticEvent) => this._asGlobalResize!.onGlobalResize(e));
        }
    }

    public async componentWillReceiveProps(nextProps: TProps): Promise<void> {
    }

    public async componentWillUnmount(): Promise<void> {
        this._isMounted = false;
        this._isSpinning = false;

        if (this._asGlobalClick) {
            DocumentEventsProvider.unregister(this.id, DocumentEventType.Mousedown);
        }

        if (this._asGlobalKeydown) {
            DocumentEventsProvider.unregister(this.id, DocumentEventType.Keydown);
        }

        if (this._asGlobalResize) {
            DocumentEventsProvider.unregister(this.id, DocumentEventType.Resize);
        }
    }


    // ISpinner

    /**
     * @inheritDoc
     *
     * NOTE: Must be overridden to return true in order to enable spinner-related functionalities {@link isSpinning} and {@link setSpinnerAsync} of the {@link BaseComponent}.
     *
     * @return false
     */
    public hasSpinner(): boolean {
        return false;
    }

    /**
     * @inheritDoc
     *
     * NOTE: Can return true only if {@link hasSpinner} is overridden to return true.
     */
    public isSpinning(): boolean {
        return (this.hasSpinner()) && (this._isSpinning);
    }

    /**
     * @inheritDoc
     *
     * NOTE: Works only if {@link hasSpinner} is overridden to return true.
     */
    public async setSpinnerAsync(isSpinning: boolean): Promise<void> {
        if ((this.hasSpinner()) && (isSpinning !== this._isSpinning)) {
            this._isSpinning = isSpinning;
            await this.reRenderAsync();
        }
    }


    // IBaseComponent

    public get childComponents(): IBaseComponent[] {

        const childComponents: IBaseComponent[] = [];

        childComponents.push(...
            this
                ._childComponentRefs
                .filter(ref => BaseComponent.isComponent(ref.current))
                .map(ref => ref.current!)
        );

        return childComponents;
    }

    /**
     * @inheritDoc
     * @see ch.desktop
     */
    public get desktop(): boolean {
        return ch.desktop;
    }

    public readonly id: string;

    /**
     * @inheritDoc
     * @see ch.mobile
     */
    public get mobile(): boolean {
        return ch.mobile;
    }

    public readonly typeName: string;

    /**
     * @inheritDoc
     * @see ch.getPage
     */
    public getPage(): IBasePage {
        return ch.getPage();
    }

    /**
     * @inheritDoc
     * @return true
     */
    public isComponent(): boolean { return true; }

    public outerHeight(includeMargin: boolean = true): number {
        const node: JQuery = this.getNode();
        return node.outerHeight(includeMargin) || 0;
    }

    public outerWidth(includeMargin: boolean = true): number {
        const node: JQuery = this.getNode();
        return node.outerWidth(includeMargin) || 0;
    }

    /**
     * @inheritDoc
     * @see ApiProvider.getAsync
     */
    public async getAsync<TResponse>(endpoint: string): Promise<TResponse> {
        return await ApiProvider.getAsync<TResponse>(endpoint, this);
    }

    /**
     * @inheritDoc
     * @see ApiProvider.postAsync
     */
    public async postAsync<TResponse>(endpoint: string, request: any | null = null): Promise<TResponse> {
        return await ApiProvider.postAsync<TResponse>(endpoint, request, this);
    }

    /**
     * @inheritDoc
     * @see React.Component.forceUpdate
     *
     * NOTE: effective only if the {@link BaseComponent} is mounted.
     */
    public async reRenderAsync(): Promise<void> {
        if (this.isMounted) {
            await this.forceUpdate();
        }
    }
}