import React from "react";
import {Utility, TFormat, FileModel} from "@weare/athenaeum-toolkit";
import {BaseComponent, IBaseComponent, IGlobalClick, RenderCallback, InputValidationRule, BaseInputType, ReactUtility} from "@weare/athenaeum-react-common";
import LiveValidator, { ValidationRow } from "../PasswordInput/LiveValidator/LiveValidator";
import AthenaeumComponentsConstants from "../../AthenaeumComponentsConstants";
import BaseInputLocalizer from "./BaseInputLocalizer";

import styles from "../Form/Form.module.scss";

export type NullableCheckboxType = boolean | null;

export type BaseInputValue = string | number | boolean | string[] | number[] | FileModel | FileModel[] | Date | null | NullableCheckboxType | [Date | null, Date | null];

export type ValidatorCallback<TInputValue extends BaseInputValue> = (value: TInputValue) => string | null;

export interface IInputModel<TInputValue extends BaseInputValue> {
    value: TInputValue;
}

export type IImageInputInputType = FileModel[] | FileModel | null;

export interface IImageInputModel extends IInputModel<IImageInputInputType> {
}

export interface IStringInputModel extends IInputModel<string> {
}

export interface IDateInputModel extends IInputModel<Date> {
}

export interface INumberInputModel extends IInputModel<number> {
}

export interface IBooleanInputModel extends IInputModel<boolean> {
}

export interface IBaseInputProps<TInputValue extends BaseInputValue> {
    id?: string;
    title?: string;
    name?: string;
    label?: string;
    value?: TInputValue;
    model?: IInputModel<TInputValue>;
    required?: boolean;
    noValidate?: boolean;
    validators?: ValidatorCallback<TInputValue>[];
    className?: string;
    prepend?: boolean| string | React.ReactNode | RenderCallback;
    append?: boolean| string | React.ReactNode | RenderCallback;
    hidden?: boolean;
    clickToEdit?: boolean;
    format?: TFormat;
    inline?: boolean;
    liveValidator?: ValidationRow[];
    validLength?: number;
    onValidationError?(validator: ValidatorCallback<TInputValue>, value: TInputValue): string | null;
}

export interface IBaseInputState<TInputValue extends BaseInputValue> {
    model: IInputModel<TInputValue>;
    edit: boolean;
    readonly: boolean;
    validationError: string | null;
}

export interface IValidator {
    validate(label: string, value: BaseInputValue): string | null;
}

export interface IValidatable<TInputValue extends BaseInputValue> {
    getValidators(): ValidatorCallback<TInputValue>[];
    isValid(): boolean;
}

export abstract class BaseValidator implements IValidator {

    abstract validate(value: BaseInputValue): string | null;

    public static toString(value: BaseInputValue, format: TFormat | null = null): string | null {
        if (value != null) {
            if (typeof value === "string") {
                return value as string;
            }
            if ((value instanceof FileModel) || ((value as any).isFileModel)) {
                return (value as FileModel).src;
            }
            if (typeof value === "number") {
                //return (value as number).toString();
                return Utility.formatValue(value, format);
            }
            if (typeof value === "boolean") {
                //return (value as boolean).toString();
                return Utility.formatValue(value, format);
            }
            if (value instanceof Date) {
                //return (value as Date).toDateString();
                return Utility.formatValue(value, format || "D");
            }
        }
        return null;
    }
}

export abstract class BaseFileValidator implements IValidator {

    abstract validate(value: BaseInputValue): string | null;

    public static getSize(file: FileModel | FileModel[] | null): number | null {
        return (file != null)
            ? (file instanceof Array)
                ? Utility.sum(file, item => this.getSize(item))
                : file.size
            : null;
    }

    public static getType(file: FileModel | null): string | null {
        return (file != null)
            ? file.type.toLowerCase()
            : null;
    }
}

export enum BaseRegexValidatorErrorMessage {
    validatorsEmailLanguageItemName = "Validators.Email",
    validatorsUrlLanguageItemName = "Validators.Url",
    validatorsPasswordLanguageItemName = "Validators.Password",
    validatorsPhoneLanguageItemName = "Validators.Phone"
}

export abstract class BaseRegexValidator extends BaseValidator {

    protected regex: RegExp;
    protected errorMessage: string;

    constructor(regex: string, errorMessage: string) {
        super();
        this.regex = new RegExp(regex);
        this.errorMessage = BaseInputLocalizer.get(errorMessage);
    }

    public validate(value: BaseInputValue): string | null {
        if (value) {
            const str: string | null = value as string | null;
            if (str != null) {
                if (!str.match(this.regex)) {
                    return this.errorMessage;
                }
            }
        }
        return null;
    }
}

export class RegexValidator extends BaseRegexValidator {
    public static validator(regex: string, errorMessage: string): ValidatorCallback<BaseInputValue> {
        const instance: RegexValidator = new RegexValidator(regex, errorMessage);
        return (value: BaseInputValue) => instance.validate(value);
    }
}

export class EmailValidator extends BaseRegexValidator {
    constructor() {
        super(InputValidationRule.Email, BaseRegexValidatorErrorMessage.validatorsEmailLanguageItemName);
    }

    public static readonly instance: EmailValidator = new EmailValidator();

    public static readonly validator: ValidatorCallback<string> = (value: string | null) => EmailValidator.instance.validate(value);
}

export class UrlValidator extends BaseRegexValidator {
    constructor() {
        super(InputValidationRule.Url, BaseRegexValidatorErrorMessage.validatorsUrlLanguageItemName);
    }

    public static readonly instance: UrlValidator = new UrlValidator();

    public static readonly validator: ValidatorCallback<string> = (value: string | null) => UrlValidator.instance.validate(value);
}

export class PasswordValidator extends BaseRegexValidator {
    constructor() {
        super(InputValidationRule.Password, BaseRegexValidatorErrorMessage.validatorsPasswordLanguageItemName);
    }

    public static readonly instance: PasswordValidator = new PasswordValidator();

    public static readonly validator: ValidatorCallback<string> = (value: string | null) => PasswordValidator.instance.validate(value);
}

export class PhoneValidator extends BaseRegexValidator {
    constructor() {
        super(InputValidationRule.Phone, BaseRegexValidatorErrorMessage.validatorsPhoneLanguageItemName);
    }

    public static readonly instance: PhoneValidator = new PhoneValidator();

    public static readonly validator: ValidatorCallback<string> = (value: string | null) => PhoneValidator.instance.validate(value);
}

export class RequiredValidator extends BaseValidator {

    public validate(value: BaseInputValue): string | null {
        if ((value != null) && (Array.isArray(value))) {
            return (value.length === 0) ? BaseInputLocalizer.validatorsRequired : null;
        }
        const str: string | null = BaseValidator.toString(value);
        if ((str == null) || (str.length === 0)) {
            return BaseInputLocalizer.validatorsRequired;
        }
        return null;
    }

    public static readonly instance: RequiredValidator = new RequiredValidator();

    public static readonly validator: ValidatorCallback<BaseInputValue> = (value: BaseInputValue) => RequiredValidator.instance.validate(value);
}

export class LengthValidator extends BaseValidator {
    public minLength: number;

    constructor(minLength: number = 0) {
        super();
        this.minLength = minLength;
    }

    public validate(value: BaseInputValue): string | null {
        const str: string | null = BaseValidator.toString(value);
        if ((this.minLength > 0) && ((str == null) || (str.length < this.minLength))) {
            return BaseInputLocalizer.validatorsLength;
        }
        return null;
    }

    public static readonly instance: LengthValidator = new LengthValidator();

    public static validator(minLength: number = 0): ValidatorCallback<BaseInputValue> {
        return (value: BaseInputValue) => new LengthValidator(minLength).validate(value);
    }
}

export class NumberRangeValidator extends BaseValidator {
    public min: number;
    public max: number;

    constructor(min: number = Number.NEGATIVE_INFINITY, max: number = Number.POSITIVE_INFINITY) {
        super();
        this.min = min;
        this.max = max;
    }

    public validate(value: BaseInputValue): string | null {
        if ((value == null) || (value < this.min) || (value > this.max)) {
            return Utility.format(BaseInputLocalizer.validatorsNumberRange, this.min, this.max);
        }
        return null;
    }

    public static readonly instance: NumberRangeValidator = new NumberRangeValidator();

    public static validator(min: number = Number.NEGATIVE_INFINITY, max: number = Number.POSITIVE_INFINITY): ValidatorCallback<BaseInputValue> {
        return (value: BaseInputValue) => new NumberRangeValidator(min, max).validate(value);
    }
}

export class FileSizeValidator extends BaseFileValidator {

    public maxSize: number;

    constructor(maxSize: number = AthenaeumComponentsConstants.maxFileUploadSizeInBytes) {
        super();
        this.maxSize = maxSize;
    }

    public validate(value: BaseInputValue): string | null {

        if ((value != null) && (this.maxSize > 0)) {
            const files: FileModel[] = (value instanceof Array)
                ? value as FileModel[]
                : [value as FileModel];

            const fileSizes: number[] = files.map(file => BaseFileValidator.getSize(file) || 0);

            if (fileSizes.some((fileSize: number) => (fileSize > this.maxSize))) {
                return BaseInputLocalizer.validatorsDocumentTooBig;
            }
        }

        return null;
    }

    public static readonly instance: FileSizeValidator = new FileSizeValidator();

    public static validator(maxSize: number = AthenaeumComponentsConstants.maxFileUploadSizeInBytes): ValidatorCallback<BaseInputValue> {
        return (value: BaseInputValue) => new FileSizeValidator(maxSize).validate(value);
    }
}

export class FilesSizeValidator extends BaseFileValidator {

    public maxSize: number;

    constructor(maxSize: number = AthenaeumComponentsConstants.maxFileUploadSizeInBytes) {
        super();
        this.maxSize = maxSize;
    }

    public validate(value: BaseInputValue): string | null {

        if ((value != null) && (this.maxSize > 0)) {

            const files: FileModel[] = (value instanceof Array)
                ? value as FileModel[]
                : [value as FileModel];

            const totalSize: number = BaseFileValidator.getSize(files) || 0;

            if (totalSize > this.maxSize) {
                return BaseInputLocalizer.validatorsTotalSizeTooBig;
            }
        }

        return null;
    }

    public static readonly instance: FilesSizeValidator = new FilesSizeValidator();

    public static validator(maxSize: number = AthenaeumComponentsConstants.maxFileUploadSizeInBytes): ValidatorCallback<BaseInputValue> {
        return (value: BaseInputValue) => new FilesSizeValidator(maxSize).validate(value);
    }
}

export class FileTypeValidator extends BaseFileValidator {

    public fileTypes: string[];

    constructor(fileTypes: string[] = AthenaeumComponentsConstants.imageFileTypes) {
        super();
        this.fileTypes = fileTypes;
    }

    public validate(value: BaseInputValue): string | null {

        if ((value != null) && (this.fileTypes.length > 0)) {
            const files: FileModel[] = (value instanceof Array)
                ? value as FileModel[]
                : [value as FileModel];

            const fileTypes: string[] = files.map(file => BaseFileValidator.getType(file) || "");

            if ((fileTypes.length !== 0) && (!fileTypes.every((fileType: string) => this.fileTypes.includes(fileType)))) {
                return Utility.format(BaseInputLocalizer.validatorsDocumentTypeNotSupported, Utility.getExtensionsFromMimeTypes(this.fileTypes))
            }
        }

        return null;
    }

    public static readonly instance: FileTypeValidator = new FileTypeValidator();

    public static validator(fileTypes: string[] = AthenaeumComponentsConstants.imageFileTypes): ValidatorCallback<BaseInputValue> {
        return (value: BaseInputValue) => new FileTypeValidator(fileTypes).validate(value);
    }
}

export interface IInput extends IBaseComponent {
    isInput(): boolean;
    isValid(): boolean;
    validateAsync(): Promise<void>;
    getName(): string;
    getValue(): any;
    hideEditAsync(): Promise<void>;
    showEditAsync(select?: boolean): Promise<void>;
    setReadonlyAsync(value: boolean): Promise<void>;
    readonly: boolean;
}

export default abstract class BaseInput<TInputValue extends BaseInputValue, TProps extends IBaseInputProps<TInputValue>, TState extends IBaseInputState<TInputValue>>
    extends BaseComponent<TProps, TState> implements IInput, IValidatable<TInputValue>, IGlobalClick {

    private _inputContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    private _liveValidatorRef: React.RefObject<LiveValidator> = React.createRef();

    private async onInputContainerClickAsync(): Promise<void> {
        if (this.props.clickToEdit) {
            await this.showEditAsync();
        }
    }

    protected async setEditAsync(edit: boolean): Promise<void> {
        if ((this.props.clickToEdit) && (this.state.edit !== edit)) {

            await this.setState({edit: edit});

            if (edit) {
                await this.onShowEditAsync();
            } else {
                await this.onHideEditAsync();
            }
        }
    }

    protected async onLabelClick(e: React.MouseEvent): Promise<void> {
    }

    protected async onShowEditAsync(): Promise<void> {
    }

    protected async onHideEditAsync(): Promise<void> {
    }

    protected onValuePropsChanged(): void {
    }

    protected parse(str: string): TInputValue {
        return (str as any) as TInputValue
    }

    protected getFormattedStr(): string {
        return Utility.formatValue(this.value, this.format);
    }

    protected ignoreValueProps(): boolean {
        return (this.props.model != null);
    }

    protected get format(): TFormat {
        return (this.props.format || "") as TFormat;
    }

    protected get inputElement(): HTMLInputElement | HTMLTextAreaElement | null {
        if (this._inputContainerRef.current) {
            return this._inputContainerRef.current.querySelector("input")
                || this._inputContainerRef.current.querySelector("textarea") || null;
        }
        return null;
    }

    constructor(props: TProps) {
        super(props);

        const varProps = props as any;
        const model: IInputModel<TInputValue> = (props.model ?? { value: (null as TInputValue) }) as IInputModel<TInputValue>;

        if (props.value != null) {
            model.value = props.value as TInputValue;
        }

        const readonly: boolean = varProps.readonly || varProps.disabled || false;

        this.state = {
            model: model,
            edit: !this.props.clickToEdit,
            validationError: null,
            generation: 0,
            readonly: readonly
        } as any as TState;
    }

    public getName(): string {
        return (this.props.name as string | null || this.id);
    }

    public getValue(): any {
        return this.value;
    }

    public get inline(): boolean {
        return (!!this.props.inline);
    }

    public get value(): TInputValue {
        return this.state.model.value;
    }

    public get str(): string {
        return BaseValidator.toString(this.value) || "";
    }

    public isValid(): boolean {
        if (this.props.liveValidator) {
            return (!this.state.validationError) && this._liveValidatorRef.current!.isValid;
        }
        return (!this.state.validationError);
    }

    public focus(): void {
        if (this.inputElement) {
            this.inputElement.focus();
        }
    }

    public get noValidate(): boolean {
        return (!!this.props.noValidate || this.readonly);
    }

    public get readonly(): boolean {
        return this.state.readonly;
    }

    public async setReadonlyAsync(value: boolean): Promise<void> {
        if (value != this.state.readonly) {
            await this.setState({ readonly: value })
        }
    }

    public async hideEditAsync(): Promise<void> {
        await this.setEditAsync(false);
    }

    public async showEditAsync(select?: boolean): Promise<void> {
        await this.setEditAsync(true);

        if (this.inputElement) {

            this.inputElement.focus();

            if (select) {
                this.inputElement.select();
            }
        }
    }

    public async onGlobalClick(e: React.SyntheticEvent<Element, Event>): Promise<void> {
        if (this.props.clickToEdit) {
            const target = e.target as Node;

            const outside: boolean = Utility.clickedOutside(target, this.id);

            if (outside) {
                await this.hideEditAsync();
            }
        }
    }

    public async componentWillReceiveProps(nextProps: TProps): Promise<void> {

        const varProps = this.props as any;
        const varNewProps = nextProps as any;

        await super.componentWillReceiveProps(nextProps);

        if (this.isMounted) {
            const model: IInputModel<TInputValue> = this.state.model;
            const nextModel: IInputModel<TInputValue> | undefined = nextProps.model;
            const value: TInputValue | undefined = model.value;
            const nextValue: TInputValue | undefined = nextProps.value;
            //Id check is for the case when localizer language changes
            const resetValidator: boolean = (!nextProps.required) && (!this.isValid()) || (varProps.id !== varNewProps.id);
            const newReadonly: boolean = (varProps.disabled != varNewProps.disabled) || (varProps.readonly != varNewProps.readonly);

            if ((nextModel) && (nextModel.value !== model.value)) {

                this.onValuePropsChanged();

                const value: TInputValue = (nextModel.value != null)
                    ? nextModel.value as TInputValue
                    : (null as TInputValue);

                await this.updateValueAsync(value, false);

            } else if ((!this.ignoreValueProps()) && (value !== nextValue)) {

                this.onValuePropsChanged();

                const value: TInputValue = (nextValue != null)
                    ? nextValue as TInputValue
                    : (null as TInputValue);

                await this.updateValueAsync(value, false);

            } else if (resetValidator) {
                await this.validateAsync();
            }

            if (newReadonly) {
                const readonly: boolean = varNewProps.readonly || varNewProps.disabled || false;

                await this.setReadonlyAsync(readonly);
            }
        }
    }

    protected async valueChangeHandlerAsync(event: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>): Promise<void> {

        const str: string = event.currentTarget.value;

        let value: TInputValue = this.parse(str);

        await this.updateValueAsync(value);
    }

    protected async updateValueAsync(value: TInputValue, validate: boolean = true): Promise<void> {
        const state: IBaseInputState<TInputValue> = this.state;

        const model: IInputModel<TInputValue> = state.model;

        if (model.value !== value) {

            model.value = value;

            if (validate) {
                this.validate();
            } else {
                state.validationError = null;
            }

            if (this.isMounted) {
                await this.setState(state);
            }
        }
    }

    protected async valueBlurHandlerAsync(): Promise<void> {
        await this.validateAsync();
    }

    protected validate(): void {

        if (this.noValidate) {
            return;
        }

        const value: TInputValue = this.value;

        const validators: ValidatorCallback<TInputValue>[] = [];

        if (this.props.required) {
            validators.push(RequiredValidator.validator as ValidatorCallback<TInputValue>);
        }

        validators.push(...this.getValidators());

        if (this.props.validators != null) {
            validators.push(...(this.props.validators as ValidatorCallback<TInputValue>[]));
        }

        let error: string | null = null;

        validators.forEach(validator => {
            if (!error) {
                let validationError: string | null = validator(value);
                if (validationError) {
                    if (this.props.onValidationError) {
                        validationError = this.props.onValidationError(validator, value);
                    }
                    error = validationError;
                }
            }
        });

        error = (error) ? error : null;

        const state: IBaseInputState<TInputValue> = this.state;

        state.validationError = error;
    }

    public isInput(): boolean { return true; }

    public getValidators(): ValidatorCallback<TInputValue>[] {
        return [];
    }

    public async validateAsync(): Promise<void> {
        const error: string | null = this.state.validationError;

        this.validate();

        if (this.state.validationError !== error) {
            await this.setState(this.state);
        }
    }

    protected getInputId(): string {
        return `input_${this.id}`;
    }

    protected getType(): string {
        return BaseInputType.Text;
    }

    protected getContainerClassname(): string {
        return "";
    }

    public abstract renderInput(): React.ReactNode;

    public renderValue(): React.ReactNode {
        const formattedStr: string = this.getFormattedStr();
        return (
            <span className={styles.value} title={this.props.title || formattedStr}>{formattedStr}</span>
        );
    }

    public renderPrepend(): React.ReactNode {
        const prepend: string | React.ReactNode = (typeof this.props.prepend === "function")
            ? this.props.prepend(this)
            : (typeof this.props.prepend === "boolean")
                ? ""
                : this.props.prepend;
        const icon: boolean = (typeof prepend === "string") && ((prepend.startsWith("fa-") || (prepend.includes(" fa-"))));
        return (
            <div className="input-group-prepend">
                {
                    (icon)
                        ? (<i className={prepend as string} />)
                        : (<span className={this.css("input-group-text", styles.prepend)}>{prepend}</span>)
                }
            </div>
        );
    }

    public renderAppend(): React.ReactNode {
        const append: string | React.ReactNode = (typeof this.props.append === "function")
            ? this.props.append(this)
            : (typeof this.props.append === "boolean")
                ? ""
                : this.props.append;
        const icon: boolean = (typeof append === "string") && ((append.startsWith("fa-") || (append.includes(" fa-"))));
        return (
            <div className="input-group-append">
                {
                    (icon)
                        ? (<i className={append as string}/>)
                        : (<span className={this.css("input-group-text", styles.append)}>{append}</span>)
                }
            </div>
        );
    }

    public render(): React.ReactNode {
        let inputBorderRadius: string = "";

        if (this.props.prepend) {
            inputBorderRadius = styles.prepend;
        }

        if (this.props.append) {
            inputBorderRadius = styles.append;
        }

        if (this.props.prepend && this.props.append) {
            inputBorderRadius = this.css(styles.append, styles.prepend)
        }

        const inlineStyle: any = (this.inline) && ("d-flex flex-row align-items-center " + styles.inlineInputGroup);

        return (
            <div id={this.id} className={this.css(styles.inputGroup, inlineStyle, this.getContainerClassname(), this.props.className)} hidden={this.props.hidden}>
                {
                    (this.props.label) &&
                    (
                        <div className={this.css(styles.label, "d-flex", "base-input-label", this.state.validationError && styles.validationError)}>

                            <label className={this.state.validationError && "validation-error"} htmlFor={this.getInputId()}
                                   onClick={async (e: React.MouseEvent) => await this.onLabelClick(e)}>
                                {
                                    (this.state.validationError)
                                        ? BaseInputLocalizer.get(this.state.validationError, this.props.label)
                                        : ReactUtility.toMultiLines(this.props.label)
                                }
                            </label>

                            {
                                (this.props.required && !this.noValidate && !this.state.validationError) &&
                                (
                                    <span className={styles.required}>*</span>
                                )
                            }

                        </div>
                    )
                }

                <div className="d-flex h-100">

                    {
                        (this.props.prepend) && this.renderPrepend()
                    }

                    <div ref={this._inputContainerRef} className={this.css(styles.inputContainer, inputBorderRadius, this.state.validationError && styles.validationError)} onClick={async () => await this.onInputContainerClickAsync()}>
                        { (this.state.edit) ? this.renderInput() : this.renderValue() }
                    </div>

                    {
                        (this.props.append) && this.renderAppend()
                    }

                </div>

                {
                    (this.props.liveValidator && this.value) &&
                    (
                        <LiveValidator ref={this._liveValidatorRef}
                                       validationRows={this.props.liveValidator as ValidationRow[]}
                                       value={this.value || ""}
                                       validLength={this.props.validLength}
                        />
                    )
                }

            </div>
        );
    }
}