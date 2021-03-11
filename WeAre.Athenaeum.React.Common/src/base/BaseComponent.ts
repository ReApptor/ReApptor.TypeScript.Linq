import React, {ReactChildren} from "react";
import $ from "jquery";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import { Utility } from "@weare/athenaeum-toolkit";
import ReactUtility from "../ReactUtility";
import ApiProvider from "../providers/ApiProvider";
import PageCacheProvider from "../providers/PageCacheProvider";
import {IBasePage} from "./BasePage";
import ch from "../providers/ComponentHelper";
import DocumentEventsProvider, {DocumentEventType} from "../providers/DocumentEventsProvider";

export type RenderCallback = (sender: IBaseComponent) => string | React.ReactNode;

export interface IChildrenProps {
    children?: React.ReactNode;
}

export interface IReactComponent {
    isMounted: boolean;

    render(): React.ReactNode;

    componentWillMount?(): Promise<void>;

    componentDidMount?(): Promise<void>;

    componentWillUnmount?(): Promise<void>;

    componentWillReceiveProps?(props: any): Promise<void>;
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
    outerHeight(includeMargin: boolean): number;
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
    private _children: React.ReactElement[];
    private _childComponentIds: string[];
    private _childComponentIdToRefs: Dictionary<string, React.RefObject<IBaseComponent>>;
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
        if (BaseComponent.isComponent(element)/* && (element.props.ref == null)*/) {
            const expandedProps: any | null = this.extendChildProps(element);
            const id: string = (element.props.id || ch.getComponentId());
            let ref: any = (element as any).ref;
            console.log("CLONE: BaseComponent.clone id=", id, " ref=", ref);
            if (ref != null) {
                this._childComponentRefs.push(ref as React.RefObject<IBaseComponent>);
            } else {
                ref = this._childComponentIdToRefs.getValue(id) || null;
                if (ref != null) {
                    console.log("BaseComponent.clone restore from existing id=", id);
                }
                else {
                    ref = React.createRef<IBaseComponent>();
                    this._childComponentIdToRefs.setValue(id, ref);
                    console.log("BaseComponent.clone create new ref id=", id);
                }
                //ref = id;
                //ref = React.createRef<BaseComponent>();
                //this._childComponentRefs.push(ref as React.RefObject<IBaseComponent>);
                //this._childComponentIds.push(id);
                this._childComponentRefs.push(ref);
            }
            const newProps: any = { ...element.props, ref: ref, id: id, ...expandedProps };
            console.log("BaseComponent.clone newProps=", newProps);
            return ReactUtility.cloneElement(element, newProps);
        }
        return element;
    }
    
    protected extendChildProps(element: React.ReactElement): any | null {
        return null;
    }
    
    public readonly id: string;
    public readonly typeName: string;

    public static isComponent(element: any | null): boolean {
        
        if (element != null) {
            if ((element.isComponent !== undefined) && (typeof element.isComponent === "function") && (element.isComponent())) {
            //if ((element.isComponent !== undefined) && (typeof element.isComponent === "function") && (element.isComponent() === true)) {
                return true;
            }
            //React.Element<typeof IBaseComponent>;
            let prototype: any = element.type;
            while ((prototype) && (prototype.name) && (prototype.name !== Object.name)) {
                if (prototype.name === BaseComponent.name) {
                    return true;
                }
                prototype = Object.getPrototypeOf(prototype);
            }
        }
        
        console.log("isComponent=false element=", element);
        
        return false;
    }

    protected getNode(): JQuery {
        return $(`#${this.id}`);
    }
    
    private cloneChildren(): void {
        this._children = [];

        console.log("BaseComponent.cloneChildren: id=", this.id);

        this._childComponentIds = [];
        this._childComponentRefs = [];

        let children = this.props.children as any;
        if (children && children.type && children.type.toString && children.type.toString() === "Symbol(react.fragment)") {
            children = children.props.children;
        }

        const clone: React.ReactElement[] | null | undefined = ReactUtility.reactChildren.map(children, (child) => {
            const element = child as React.ReactElement;
            return this.clone(element);
        });

        console.log("BaseComponent.cloneChildren: clone=", clone);

        this._children = clone || [];
    }
    
    public get children(): React.ReactElement[] {
        this.cloneChildren();
        return this._children;
    }

    public get childComponents(): IBaseComponent[] {

        const childComponent: IBaseComponent[] = [];

        childComponent.push(...
            this
                ._childComponentIds
                .filter(id => BaseComponent.isComponent(this.refs[id]))
                .map(id => ((this.refs[id] as any) as IBaseComponent))
        );
        
        console.log("BaseComponent.childComponents: _childComponentRefs=", this._childComponentRefs);

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

    protected constructor(props: TProps) {
        
        const id: string | null = (props) ? (props as any).id : ch.getComponentId();

        super(props);
        
        this._asGlobalClick = this.asGlobalClick();
        this._asGlobalKeydown = this.asGlobalKeydown();
        this._asGlobalResize = this.asGlobalResize();
        this._children = [];
        this._childComponentIds = [];
        this._childComponentRefs = [];
        this._childComponentIdToRefs = new Dictionary<string, React.RefObject<IBaseComponent>>();
        this._isMounted = false;
        this._isSpinning = false;
        
        this.id = (id != null) ? id : ch.getComponentId();
        this.typeName = this.constructor.name;

        ch.register(this);
    }

    public async initializeAsync(): Promise<void> {
    }

    public async componentWillMount(): Promise<void> {

        this.cloneChildren();

        console.log("BaseComponent.componentWillMount: id=", this.id);
        
        await this.initializeAsync();
    }
    
    public async componentDidMount(): Promise<void> {
        this._isMounted = true;

        console.log("BaseComponent.componentDidMount: id=", this.id);

        if (this._asGlobalClick) {
            DocumentEventsProvider.register(this.id, DocumentEventType.Mousedown, async (e: React.SyntheticEvent) => await this._asGlobalClick!.onGlobalClick(e));
        }

        if (this._asGlobalKeydown) {
            DocumentEventsProvider.register(this.id, DocumentEventType.Keydown, async (e: React.SyntheticEvent) => await this._asGlobalKeydown!.onGlobalKeydown(e));
        }

        if (this._asGlobalResize) {
            DocumentEventsProvider.register(this.id, DocumentEventType.Resize, async (e: React.SyntheticEvent) => await this._asGlobalResize!.onGlobalResize(e));
        }
    }

    public async componentWillUnmount(): Promise<void> {
        this._isMounted = false;
        this._isSpinning = false;
        this._childComponentIdToRefs.clear();

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

    public async componentWillReceiveProps(nextProps: TProps): Promise<void> {
    }
}