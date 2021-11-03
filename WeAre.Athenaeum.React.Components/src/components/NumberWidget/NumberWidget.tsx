import React from "react";
import {INumberFormat, NumberParsingResult, NumberUtility, Utility, TFormat} from "@weare/athenaeum-toolkit";
import {IGlobalClick} from "@weare/athenaeum-react-common";
import BaseWidget, { IBaseWidgetProps } from "../WidgetContainer/BaseWidget";
import Icon, { IconSize, IconStyle } from "../Icon/Icon";

import styles from "../WidgetContainer/WidgetContainer.module.scss";

export interface INumberWidgetProps extends IBaseWidgetProps {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    strict?: boolean;
    format?: TFormat;
    canMinimize?: boolean;
    readonly?: boolean;
    reverse?: boolean;
    onChange?(sender: NumberWidget, value: number): Promise<void>;
}

interface INumberWidgetData {
    edit: boolean;
}

export default class NumberWidget extends BaseWidget<INumberWidgetProps, INumberWidgetData> implements IGlobalClick {

    private readonly _inputRef: React.RefObject<HTMLInputElement> = React.createRef();
    private _acceptableStr: string | null = null;

    private async onInputChangeHandlerAsync(e: React.SyntheticEvent<HTMLInputElement>): Promise<void> {
        const str: string = e.currentTarget.value;

        const parsingResult: NumberParsingResult = NumberUtility.parse(str, this.allowFloat);

        const acceptableStr: string | null = (parsingResult.acceptableStr !== null) ? parsingResult.acceptableStr : this._acceptableStr;
        const needToRender: boolean = (acceptableStr !== this._acceptableStr);
        this._acceptableStr = acceptableStr;

        if (needToRender) {
            await this.reRenderAsync();
        }
    }

    private async onInputKeyUpHandlerAsync(e: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
        const enter: boolean = (e.keyCode === 13);
        const esc: boolean = (e.keyCode === 27);
        if ((enter) || (esc)) {
            await this.stopEditAsync(enter);
        }
    }

    private async onWheelHandlerAsync(e: React.WheelEvent<HTMLInputElement>): Promise<void> {
        const step: number = (e.deltaY < 0) ? this.step : -this.step;
        await this.setAsync(this.value + step);
    }

    private async saveChangesAsync(): Promise<void> {
        if (this._acceptableStr != null) {
            const parsingResult: NumberParsingResult = NumberUtility.parse(this._acceptableStr, this.allowFloat);

            this._acceptableStr = null;

            if (parsingResult.parsed) {
                await this.setAsync(parsingResult.value);
            }
        }
    }

    private getStr(): string {
        return (this._acceptableStr != null)
            ? this._acceptableStr
            : (this.state.number != null)
                ? this.state.number.toString()
                : "";
    }

    protected getInnerClassName(): string {
        if (this.readonly) {
            return styles.readonly;
        }

        return super.getInnerClassName();
    }

    public async setAsync(value: number): Promise<boolean> {
        value = Utility.roundE(value);
        if ((value !== this.value) && (this.canSet(value))) {

            if (this.props.onChange) {
                await this.props.onChange(this, value);
            }

            await this.setState({number: value});

            return true;
        }

        return false;
    }

    public async increaseAsync(): Promise<void> {
        let nextValue: number = this.value + this.step;
        if (nextValue > this.max) {
            nextValue = this.max;
        }

        await this.setAsync(nextValue);
    }

    public async decreaseAsync(): Promise<void> {
        let nextValue: number = this.value - this.step;
        if (nextValue < this.min) {
            nextValue = this.min;
        }

        await this.setAsync(nextValue);
    }

    public async componentWillReceiveProps(nextProps: Readonly<INumberWidgetProps>): Promise<void> {

        this._acceptableStr = null;

        if (nextProps.value !== this.props.value) {
            this.state.number = (nextProps.value != null) ? nextProps.value : this.min;
        }

        await super.componentWillReceiveProps(nextProps);
    }

    public async initializeAsync(): Promise<void> {
        this._acceptableStr = null;

        const state = this.state;
        state.number = (this.props.value || this.min);
        state.data = {edit: false};
    }

    public get edit(): boolean {
        return (!this.readonly) && (this.props.strict !== true) && (this.state.data != null) && (this.state.data!.edit);
    }

    public async setEditAsync(edit: boolean): Promise<void> {
        edit = (edit) && (!this.readonly);
        if (this.edit !== edit) {
            this._acceptableStr = null;

            const data: INumberWidgetData = {edit: edit};

            await this.setState({data});

            if ((edit) && (this._inputRef.current != null)) {
                this._inputRef.current.focus();
            }
        }
    }

    public async startEditAsync(): Promise<void> {
        await this.setEditAsync(true);
    }

    public async stopEditAsync(save: boolean = true): Promise<void> {
        if (save) {
            await this.saveChangesAsync();
        }

        this._acceptableStr = null;

        await this.setEditAsync(false);
    }

    public async onGlobalClick(e: React.SyntheticEvent): Promise<void> {
        const target = e.target as Node;
        const outsideInput = Utility.clickedOutside(target, this.inputId);

        if (outsideInput) {
            await this.stopEditAsync();
        }

        if (this.canMinimize) {
            const outsideWidget = Utility.clickedOutside(target, this.id);

            if (outsideWidget && !this.minimized) {
                await this.minimizeAsync();
            }
        }
    }

    public get reverse(): boolean {
        return !!this.props.reverse;
    }

    public get readonly(): boolean {
        return !!this.props.readonly;
    }

    public get value(): number {
        return (this.state.number || 0);
    }

    public get min(): number {
        return (this.props.min || 0);
    }

    public get max(): number {
        return (this.props.max || Number.POSITIVE_INFINITY);
    }

    public get step(): number {
        const numberFormat: INumberFormat = NumberUtility.resolveFormat(this.props.step, this.props.format);
        return numberFormat.step;
    }

    public get canDecrease(): boolean {
        return this.value > this.min;
    }

    public get canIncrease(): boolean {
        return this.value < this.max;
    }

    public canSet(value: number): boolean {
        value = Utility.roundE(value);
        return (!this.readonly) && (this.min <= value) && (value <= this.max);
    }

    public isWidget(): boolean {
        return true;
    }

    public hasSpinner(): boolean {
        return true;
    }

    public getIconName(iconPosition: number): string {
        if (this.reverse) {
            return (iconPosition == 1) ? "plus-circle" : "minus-circle";
        } else {
            return (iconPosition == 1) ? "minus-circle" : "plus-circle";
        }
    }

    public getIconStyle(iconPosition: number): string {
        if (this.reverse) {
            return (iconPosition == 1)
                ? this.css(!this.canIncrease && styles.disabled)
                : this.css(!this.canDecrease && styles.disabled);
        } else {
            return (iconPosition == 1)
                ? this.css(!this.canDecrease && styles.disabled)
                : this.css(!this.canIncrease && styles.disabled);
        }
    }

    public getIconOnClick(iconPosition: number): any {
        if (this.reverse) {
            return (iconPosition == 1)
                ? async () => await this.increaseAsync()
                : async () => await this.decreaseAsync();
        } else {
            return (iconPosition == 1)
                ? async () => await this.decreaseAsync()
                : async () => await this.increaseAsync();
        }
    }

    private get inputId(): string {
        return `input${this.id}`;
    }

    protected get numberFormat(): TFormat {
        const numberFormat: INumberFormat = NumberUtility.resolveFormat(this.props.step, this.props.format);
        return numberFormat.format;
    }

    protected get allowFloat(): boolean {
        return (this.step < 1.0);
    }

    protected get canMinimize(): boolean {
        return !!this.props.canMinimize;
    }

    protected async onClickAsync(e: React.MouseEvent): Promise<void> {
        if (this.canMinimize) {
            if (this.minimized) {
                await this.maximizeAsync();
            } else {
                const target = e.target as Node;

                const outsideWidgetBody: boolean = Utility.clickedOutside(target, `number-widget-body_${this.id}`);

                if (outsideWidgetBody) {
                    await this.toggleMinimized();
                }
            }
        }
    }

    protected renderContent(renderHidden: boolean = false): React.ReactNode {
        return (
            <div id={`number-widget-body_${this.id}`} className={this.css(styles.numberWidget, this.edit && styles.edit, this.readonly && styles.readonly)}>

                <div onClick={this.getIconOnClick(1)} className={this.getIconStyle(1)}>
                    <Icon name={this.getIconName(1)} size={IconSize.X2} style={IconStyle.Regular}/>
                </div>
                
                {
                    (this.edit)
                        ?
                        (
                            <input id={this.inputId} ref={this._inputRef}
                                   type="text" className="form-control"
                                   readOnly={this.readonly}
                                   value={this.getStr()}
                                   onChange={async (e: React.SyntheticEvent<HTMLInputElement>) => await this.onInputChangeHandlerAsync(e)}
                                   onKeyUp={async (e: React.KeyboardEvent<HTMLInputElement>) => await this.onInputKeyUpHandlerAsync(e)}
                                   onWheel={async (e: React.WheelEvent<HTMLInputElement>) => await this.onWheelHandlerAsync(e)}
                            />
                        )
                        :
                        (
                            <div onClick={async () => await this.startEditAsync()}>
                                {super.renderContent(renderHidden)}
                            </div>
                        )
                }
                
                <div onClick={this.getIconOnClick(2)} className={this.getIconStyle(2)}>
                    <Icon name={this.getIconName(2)} size={IconSize.X2} style={IconStyle.Regular}/>
                </div>
                
            </div>
        );
    }
};
