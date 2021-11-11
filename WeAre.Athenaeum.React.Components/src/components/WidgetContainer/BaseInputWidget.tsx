import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {IGlobalClick} from "@weare/athenaeum-react-common";
import { IconSize, IconStyle, IIconProps } from "../Icon/Icon";
import BaseWidget, { IBaseWidgetProps } from "./BaseWidget";

import styles from "./WidgetContainer.module.scss";

export interface IInputRefType<T> {
    _inputRef: React.RefObject<T>;
}

export interface IBaseInputWidgetProps extends IBaseWidgetProps {
    value?: string;
    rows?: number;
    maxLength?: number;
    onChange?(sender: BaseInputWidget, value: string): Promise<void>;
}

interface IBaseInputWidgetData {
    visible: boolean;
}

export default abstract class BaseInputWidget<TProps extends IBaseInputWidgetProps = {}>
    extends BaseWidget<TProps, IBaseInputWidgetData> implements IGlobalClick {

    protected abstract refObject: IInputRefType<any> = {
        _inputRef: React.createRef()
    };

    protected async onInputChangeHandlerAsync(e: React.FormEvent<any>): Promise<void> {
        let value: string = e.currentTarget.value;

        const caretPosition: number = Number(e.currentTarget.selectionEnd);

        await this.setAsync(value);

        let input = this.refObject._inputRef.current;

        if (input) {
            const prefix = value.substr(0, caretPosition);

            const index = value.indexOf(prefix) + caretPosition;

            input.selectionStart = index;

            input.selectionEnd = index;
        }
    }

    protected async onInputKeyUpHandlerAsync(e: React.KeyboardEvent<any>): Promise<void> {
        if ((e.keyCode === 13) || (e.keyCode === 27)) {
            await this.setInputVisibleAsync(false);
        }
    }

    public async setAsync(value: string): Promise<void> {
        if (value !== this.value) {

            if (this.props.onChange) {
                await this.props.onChange(this, value);
            }

            await this.setState({ text: value });
        }
    }

    public async setInputVisibleAsync(visible: boolean): Promise<void> {
        if(visible !== this.inputVisible) {
            let data: IBaseInputWidgetData = {
                visible: visible
            };

            await this.setState({ data });

            if ((this.inputVisible) && (this.refObject._inputRef.current != null)) {
                this.refObject._inputRef.current!.focus();
            }
        }
    }

    public async initializeAsync(): Promise<void> {
        const value: string | undefined = this.props.value;
        const state = this.state;
        state.text = value || "";
        state.data = { visible: false };
    }

    public get value(): string {
        return this.state.text || "";
    }

    public isWidget(): boolean { return true; }

    public hasSpinner(): boolean { return true; }

    public get inputId(): string {
        return `input${this.id}`;
    }

    protected async onClickAsync(e: React.MouseEvent): Promise<void> {
        let target: Element = e.target as Element;

        if(target.parentElement !== null) {
            if(target.parentElement.className === styles.inputContainer) {
                if(this.refObject._inputRef.current) {
                    this.refObject._inputRef.current!.focus();
                }
                return;
            }
        }

        await this.toggleInputAsync();
    }

    public async toggleInputAsync(): Promise<void> {
        await this.setInputVisibleAsync(!this.inputVisible);
    }

    public async showInputAsync(): Promise<void> {
        await this.setInputVisibleAsync(true);
    }

    public async hideInputAsync(): Promise<void> {
        await this.setInputVisibleAsync(false);
    }

    public get inputVisible(): boolean {
        return (this.state.data != null) && (this.state.data!.visible);
    }

    public async onGlobalClick(e: React.SyntheticEvent): Promise<void> {
        let target = e.target as Node;

        const outside = Utility.clickedOutside(target, this.id);

        if (outside) {
            await this.hideInputAsync();
        }
    }

    protected get icon(): IIconProps | null {
        const icon: IIconProps | null = { name: "keyboard", style: IconStyle.Regular };

        icon.size = (this.state.minimized) ? IconSize.X2 : IconSize.X3;

        return icon;
    }
};