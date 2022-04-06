import React from "react";
import {INumberFormat, NumberParsingResult, NumberUtility, TFormat, Utility} from "@weare/reapptor-toolkit";
import BaseInput, {IBaseInputProps, IBaseInputState, NumberRangeValidator, ValidatorCallback} from "../BaseInput/BaseInput";
import Icon, {IconSize, IIconProps} from "../Icon/Icon";

import styles from "./NumberInput.module.scss";

export enum NumberInputBehaviour {
    /*
    * Validate on input change,
    */
    ValidationOnChange,

    ValidationOnSave,

    Restricted
}

export interface INumberInputProps extends IBaseInputProps<number> {
    behaviour?: NumberInputBehaviour;
    title?: string;
    placeholder?: string;
    readonly?: boolean;
    min?: number;
    max?: number;
    step?: number;
    forwardedRef?: React.RefObject<HTMLInputElement>;
    hideInput?: boolean;
    hideArrows?: boolean;
    increaseIcon?: string | IIconProps;
    decreaseIcon?: string | IIconProps;
    hideZero?: boolean;
    onChange?(sender: NumberInput, value: number, userInteraction: boolean, done: boolean): Promise<void>;
    onFocus?(sender: NumberInput): Promise<void>;
    onBlur?(sender: NumberInput): Promise<void>;
}

export interface INumberInputState extends IBaseInputState<number> {
}

export default class NumberInput extends BaseInput<number, INumberInputProps, INumberInputState> {

    private _ref: React.RefObject<HTMLInputElement> | null = null;
    private _acceptableStr: string | null = null;
    private _focused: boolean = false;

    private async onChangeAsync(e: React.FormEvent<HTMLInputElement>): Promise<void> {
        const str: string = e.currentTarget.value;
        const caretPosition: number = (e.currentTarget.selectionEnd !== null)
            ? e.currentTarget.selectionEnd
            : -1;

        const parsingResult: NumberParsingResult = NumberUtility.parse(str, this.allowFloat);

        const acceptableStr: string | null = (parsingResult.acceptableStr !== null) ? parsingResult.acceptableStr : this._acceptableStr;
        const needToRender: boolean = (acceptableStr !== this._acceptableStr);

        const isNewStr: boolean = (parsingResult.parsed) && (acceptableStr !== this.getStr());

        this._acceptableStr = acceptableStr;

        if (this.behaviour === NumberInputBehaviour.ValidationOnChange) {
            await this.saveChangesAsync(false);
        } else if (needToRender) {
            await this.reRenderAsync();
        }

        if (this.ref.current) {
            const newStr: string = this.getStr();


            let index: number;
            if (isNewStr) {
                const prefix = str.substr(0, caretPosition);
                index = newStr.indexOf(prefix);
                if (index !== -1) {
                    index += caretPosition;
                } else {
                    index = caretPosition;
                }
            } else {
                const isReplace: boolean = (parsingResult.parsed) && (str !== acceptableStr);
                index = (isReplace)
                    ? caretPosition
                    : caretPosition - 1;
            }

            if (index !== -1) {
                this.ref.current.selectionStart = index;
                this.ref.current.selectionEnd = index;
            }
        }
    }

    private async onInputKeyDownHandlerAsync(e: React.KeyboardEvent<any>): Promise<void> {
        const enter: boolean = (e.keyCode === 13);
        const esc: boolean = (e.keyCode === 27);

        if (this.props.clickToEdit) {
            if ((enter) || (esc)) {
                e.preventDefault();
                await this.hideEditAsync();
            }
        }
        else {
            if (enter) {
                await this.saveChangesAsync();
            }
        }
    }

    private async invokeOnChange(value: number, userInteraction: boolean, done: boolean): Promise<void> {
        if (this.props.onChange) {
            await this.props.onChange(this, value, userInteraction, done);
        }
    }

    private async saveChangesAsync(clearAcceptableStr: boolean = true): Promise<void> {

        if (this._acceptableStr !== null) {
            const parsingResult: NumberParsingResult = NumberUtility.parse(this._acceptableStr, this.allowFloat);

            if (clearAcceptableStr) {
                this._acceptableStr = null;
            }

            let updated: boolean = false;

            if (parsingResult.parsed) {
                updated = await this.invokeSetAsync(parsingResult.value, true);
            }

            if (!updated) {
                await this.reRenderAsync();
            }
        }
    }

    private async invokeSetAsync(value: number, userInteraction: boolean): Promise<boolean> {
        if (!this.readonly) {
            value = Utility.roundE(value);
            const acceptInvalidNumbers: boolean = (this.behaviour !== NumberInputBehaviour.Restricted) && (userInteraction);
            if ((value !== this.value) && ((acceptInvalidNumbers) || (this.canSet(value)))) {
                await this.invokeOnChange(value, userInteraction, true);
                await this.updateValueAsync(value);
                return true;
            }
        }

        return false;
    }

    private getStr(): string {
        const hideZero: boolean = (this.hideZero) && (!this.focused) && (this.value == 0);
        return (hideZero)
            ? ""
            : (this._acceptableStr !== null)
                ? this._acceptableStr
                : this.str;
    }

    private get ref(): React.RefObject<HTMLInputElement> {
        return this._ref || (this._ref = this.props.forwardedRef || React.createRef());
    }

    protected get format(): TFormat {
        const numberFormat: INumberFormat = NumberUtility.resolveFormat(this.props.step, this.props.format);
        return numberFormat.format;
    }

    protected async valueFocusHandlerAsync(): Promise<void> {
        this._focused = true;

        if (this.props.onFocus) {
            await this.props.onFocus(this);
        }
    }

    protected async valueBlurHandlerAsync(): Promise<void> {
        this._focused = false;
        
        await this.saveChangesAsync();

        await super.valueBlurHandlerAsync();

        if (this.props.onBlur) {
            await this.props.onBlur(this);
        }
    }

    protected async onShowEditAsync(): Promise<void> {
        this._acceptableStr = null;

        if (this.ref.current) {
            this.ref.current.focus();
            this.ref.current.select();
        }
    }

    protected async onHideEditAsync(): Promise<void> {
        await this.saveChangesAsync();
    }

    protected parse(str: string): number {
        return (str)
            ? Math.abs(Number(str))
            : 0;
    }

    public getValidators(): ValidatorCallback<number>[] {
        return (this.behaviour !== NumberInputBehaviour.Restricted)
            ? [NumberRangeValidator.validator(this.min, this.max)]
            : [];
    }

    public get behaviour(): NumberInputBehaviour {
        return (this.props.clickToEdit)
            ? NumberInputBehaviour.Restricted
            : this.props.behaviour || NumberInputBehaviour.ValidationOnChange;
    }

    public get focused(): boolean {
        return this._focused;
    }

    public get value(): number {
        return this.state.model.value || 0;
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
        return this.canSet(this.value - this.step);
    }

    public get canIncrease(): boolean {
        return this.canSet(this.value + this.step);
    }

    public get increaseIconProps(): IIconProps {
        const increaseIconProp = this.props.increaseIcon || "arrow-up";

        if (typeof increaseIconProp === "string") {
            return  {
                name: increaseIconProp,
                size: IconSize.ExtraSmall
            };
        }

        return increaseIconProp;
    }

    public get decreaseIconProps(): IIconProps {
        const decreaseIconProp = this.props.decreaseIcon || "arrow-down";

        if (typeof decreaseIconProp === "string") {
            return  {
                name: decreaseIconProp,
                size: IconSize.ExtraSmall
            };
        }

        return decreaseIconProp;
    }
    
    public get hideZero(): boolean {
        return (this.props.hideZero === true);
    }

    protected get allowFloat(): boolean {
        return (this.step < 1.0);
    }

    public canSet(value: number): boolean {
        value = Utility.roundE(value);
        return (this.min <= value) && (value <= this.max);
    }

    public async setAsync(value: number): Promise<void> {
        await this.invokeSetAsync(value, false);
    }

    public async increaseAsync(): Promise<void> {
        await this.invokeSetAsync(this.value + this.step, false);
    }

    public async decreaseAsync(): Promise<void> {
        await this.invokeSetAsync(this.value - this.step, false);
    }

    public async initializeAsync(): Promise<void> {
        this._acceptableStr = null;

        await super.initializeAsync();
    }

    public async componentWillReceiveProps(nextProps: Readonly<INumberInputProps>): Promise<void> {
        this._acceptableStr = null;

        await super.componentWillReceiveProps(nextProps);
    }

    public renderInput(): React.ReactNode {
        return (
            <div className={styles.numberInput}>
                <input id={this.getInputId()}
                       ref={this.ref}
                       type={this.getType()}
                       value={this.getStr()}
                       readOnly={this.readonly}
                       className="form-control"
                       title={this.props.title}
                       placeholder={this.props.placeholder}
                       onChange={(e: React.FormEvent<HTMLInputElement>) => this.onChangeAsync(e)}
                       onFocus={() => this.valueFocusHandlerAsync()}
                       onBlur={() => this.valueBlurHandlerAsync()}
                       onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => await this.onInputKeyDownHandlerAsync(e)}
                />

                {
                    (!this.props.hideArrows) &&
                    (
                        <div className={this.css(styles.numberInputArrow, styles.increaseArrow)} onClick={() => this.increaseAsync()}>
                            <Icon {...this.increaseIconProps}/>
                        </div>
                    )
                }

                {
                    (!this.props.hideArrows) &&
                    (
                        <div className={this.css(styles.numberInputArrow, styles.decreaseArrow)} onClick={() => this.decreaseAsync()}>
                            <Icon {...this.decreaseIconProps}/>
                        </div>
                    )
                }
            </div>
        );
    }
}