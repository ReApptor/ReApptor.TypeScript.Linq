import React, {RefObject} from "react";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import { Utility } from "@weare/athenaeum-toolkit";
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

export interface IReactComponent {
    isMounted: boolean;

    render(): React.ReactNode;

    componentDidMount?(): Promise<void>;

    componentWillUnmount?(): Promise<void>;

    /**
     * @deprecated Use {@link UNSAFE_componentWillMount} instead.
     */
    componentWillMount?(): Promise<void>;

    UNSAFE_componentWillMount?(): Promise<void>;

    /**
     * @deprecated Use {@link UNSAFE_componentWillReceiveProps} instead.
     */
    componentWillReceiveProps?(props: any): Promise<void>;

    UNSAFE_componentWillReceiveProps?(props: any): Promise<void>;
}

export interface ISpinner {
    hasSpinner(): boolean;
    isSpinning(): boolean;
    setSpinnerAsync(isSpinning: boolean): Promise<void>;
}

export interface IBaseClassNames {
    [key: string]: string | undefined;
}

export interface IBaseComponent extends IReactComponent, ISpinner {
    readonly id: string;
    readonly typeName: string;
    readonly childComponents: IBaseComponent[];
    readonly mobile: boolean;
    readonly desktop: boolean;
    readonly props: object;

    isComponent(): boolean;
    getPage(): IBasePage;
    hasSpinner(): boolean;
    outerHeight(includeMargin?: boolean): number;
    outerWidth(includeMargin?: boolean): number;
    getAsync<TResponse>(endpoint: string): Promise<TResponse>;
    postAsync<TResponse>(endpoint: string, request: any | null): Promise<TResponse>;
    reRenderAsync(): Promise<void>;
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

export default abstract class BaseComponent<TProps = {}, TState = {}> extends React.Component<TProps, TState> implements IBaseComponent {

    private readonly _asGlobalClick: IGlobalClick | null;
    private readonly _asGlobalKeydown: IGlobalKeydown | null;
    private readonly _asGlobalResize: IGlobalResize | null;
    private _childComponentIds: Dictionary<string, React.RefObject<IBaseComponent>>;
    private _childComponentRefs: React.RefObject<IBaseComponent>[];
    private _isMounted: boolean;
    private _isSpinning: boolean;

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

    // virtual or children overrides;
    // noinspection JSUnusedLocalSymbols
    protected extendChildProps(element: React.ReactElement): any | null {
        return null;
    }

    public readonly id: string;
    public readonly typeName: string;

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

    protected get JQuery(): JQueryStatic {
        return JQueryUtility.$;
    }

    protected getNode(): JQuery {
        return this.JQuery(`#${this.id}`);
    }

    public get children(): React.ReactElement[] {
        this._childComponentRefs = [];

        let children = this.props.children as any;
        if (children && children.type && children.type.toString && children.type.toString() === "Symbol(react.fragment)") {
            children = children.props.children;
        }

        const clone: React.ReactElement[] | null | undefined = React.Children.map(children, (child) => {
            const element = child as React.ReactElement;
            return this.clone(element);
        });

        return clone || [];
    }

    public get childComponents(): IBaseComponent[] {

        const childComponent: IBaseComponent[] = [];

        childComponent.push(...
            this
                ._childComponentRefs
                .filter(ref => BaseComponent.isComponent(ref.current))
                .map(ref => ref.current!)
        );

        return childComponent;
    }

    public get isMounted(): boolean {
        return this._isMounted;
    }

    public get mobile(): boolean {
        return ch.mobile;
    }

    public get desktop(): boolean {
        return ch.desktop;
    }

    public get mobileApp(): boolean {
        return ch.mobileApp;
    }

    public get isAuthenticated(): boolean {
        return ch.isAuthenticated;
    }

    public async getAsync<TResponse>(endpoint: string): Promise<TResponse> {
        return await ApiProvider.getAsync<TResponse>(endpoint, this);
    }

    public async postFileAsync<TResponse>(endpoint: string, file: any | null = null): Promise<TResponse> {
        return await ApiProvider.postFileAsync<TResponse>(endpoint, file, this);
    }

    public async postAsync<TResponse>(endpoint: string, request: any | null = null): Promise<TResponse> {
        return await ApiProvider.postAsync<TResponse>(endpoint, request, this);
    }

    public async postCacheAsync<TResponse>(endpoint: string, ttl: number = 0): Promise<TResponse> {
        return await PageCacheProvider.getAsync(endpoint, async () => await this.postAsync(endpoint), ttl);
    }

    public async reRenderAsync(): Promise<void> {
        if (this.isMounted) {
            await this.forceUpdate();
        }
    }

    public reRender(): void {
        // reload without await
        // noinspection JSIgnoredPromiseFromCall
        this.reRenderAsync();
    }

    public hasSpinner(): boolean {
        return false;
    }

    public isSpinning(): boolean {
        return (this.hasSpinner()) && (this._isSpinning);
    }

    public async setSpinnerAsync(isSpinning: boolean): Promise<void> {
        if ((this.hasSpinner()) && (isSpinning !== this._isSpinning)) {
            this._isSpinning = isSpinning;
            await this.reRenderAsync();
        }
    }

    public getPage(): IBasePage {
        return ch.getPage();
    }

    public findComponent(id: string): IBaseComponent | null {
        return this.childComponents.find(item => item.id === id) as IBaseComponent | null;
    }

    public isComponent(): boolean { return true; }

    public copyTo(from: Dictionary<string, any> | any, ...to: any[]): void {
        Utility.copyTo(from, ...to);
    }

    public css(...params: (readonly string[] | string | null | undefined | false)[]): string {
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

    public toSingleLine(text: string | null | undefined): string {
        return ReactUtility.toSingleLine(text);
    };

    public toMultiLines(text: string | null | undefined): any[] {
        return ReactUtility.toMultiLines(text);
    }

    public outerHeight(includeMargin: boolean = true): number {
        const node: JQuery = this.getNode();
        return node.outerHeight(includeMargin) || 0;
    }

    public outerWidth(includeMargin: boolean = true): number {
        const node: JQuery = this.getNode();
        return node.outerWidth(includeMargin) || 0;
    }

    protected constructor(props: TProps) {
        super(props);

        this._asGlobalClick = this.asGlobalClick();
        this._asGlobalKeydown = this.asGlobalKeydown();
        this._asGlobalResize = this.asGlobalResize();
        this._childComponentIds = new Dictionary<string, React.RefObject<IBaseComponent>>();
        this._childComponentRefs = [];
        this._isMounted = false;
        this._isSpinning = false;

        const id: string | null = (props) ? (props as any).id : ch.getComponentId();

        this.id = (id != null) ? id : ch.getComponentId();
        this.typeName = this.constructor.name;

        ch.register(this);
    }

    public async initializeAsync(): Promise<void> {
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

    /**
     * @deprecated Use {@link UNSAFE_componentWillMount} instead.
     */
    public async componentWillMount(): Promise<void> {
        await this.UNSAFE_componentWillMount();
    }

    public async UNSAFE_componentWillMount(): Promise<void>{
        await this.initializeAsync();
    }

    /**
     * @deprecated Use {@link UNSAFE_componentWillReceiveProps} instead.
     */
    public async componentWillReceiveProps(nextProps: TProps): Promise<void> {
        await this.UNSAFE_componentWillReceiveProps(nextProps);
    }

    public async UNSAFE_componentWillReceiveProps(nextProps: TProps): Promise<void> {
    }
}