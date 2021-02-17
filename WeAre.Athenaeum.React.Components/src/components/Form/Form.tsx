import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseComponent, IBaseComponent} from "@weare/athenaeum-react-common";
import {IInput} from "./Inputs/BaseInput";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import Inline from "../Layout/Inline/Inline";

import styles from "./Form.module.scss";

interface IFormProps {
    id?: string;
    inline?: boolean;
    className?: string;
    noValidate?: boolean;
    readonly?: boolean;
    submitOnEnter?: boolean;
    onSubmit?(sender: Form, data: Dictionary<string, any>): Promise<void>;
}

interface IFormState {
    validationErrors: string[];
}

export default class Form extends BaseComponent<IFormProps, IFormState> {
    static defaultProps: IFormProps = {
        submitOnEnter: true
    };
    
    state: IFormState = {
        validationErrors: []
    };
    
    private async handleKeydownAsync(event: React.KeyboardEvent): Promise<void> {
        const target: Element = event.target as Element;
        
        const preventSubmit: boolean = (event.keyCode === 13)
            && (!this.props.submitOnEnter)
            && (target.tagName != 'TEXTAREA');
        
        if (preventSubmit) {
            event.preventDefault();
        }
    }

    private async handleSubmitAsync(event: React.FormEvent<HTMLFormElement>): Promise<boolean> {
        event.preventDefault();

        const inputs: IInput[] = this.inputs;
        let isValid: boolean = true;
        
        const data = new Dictionary<string, any>();
        await Utility.forEachAsync(inputs, async (input) => {
            await input.validateAsync();
            isValid = isValid && input.isValid();
            data.setValue(input.getName(), input.getValue());
        });
        
        if (this.props.noValidate) {
            if (this.props.onSubmit) {
                await this.props.onSubmit(this, data);
                
                return false;
            }
        }

        if ((isValid) && (this.props.onSubmit)) {
            await this.props.onSubmit(this, data);
        }

        return false;
    }
    
    private async setReadonlyAsync(value: boolean): Promise<void> {
        const inputs: IInput[] = this.inputs;
        inputs.forEach(input => input.setReadonlyAsync(value));
    }

    private getInputs(component: IBaseComponent): IInput[] {
        let inputs: IInput[] = [];

        let input: IInput = component as IInput;
        if (input.isInput && input.isInput()) {
            inputs.push(input);
        }

        component.childComponents.forEach(childComponent => {
            const childInputs: IInput[] = this.getInputs(childComponent);
            inputs.push(...childInputs);
        });

        return inputs;
    }

    private get inputs(): IInput[] {
        return this.getInputs(this);
    }
    
    public async validateAsync(): Promise<boolean> {
        let isValid: boolean = true;
        
        await Utility.forEachAsync(this.inputs, async (input) => {
            await input.validateAsync();
            isValid = isValid && input.isValid();
        });
        
        return isValid;
    }
    
    public async setValidationErrorsAsync(...validationErrors: string[]): Promise<void> {
        await this.setState({validationErrors: validationErrors});
    }
    
    public async initializeAsync(): Promise<void> {
        
        await super.initializeAsync();
        
        if (this.props.readonly) {
            await this.setReadonlyAsync(true);
        }
    }

    public async componentWillReceiveProps(nextProps: IFormProps): Promise<void> {
        const newReadonly: boolean = (nextProps.readonly != null) && (nextProps.readonly !== this.props.readonly);

        if (newReadonly) {
            const readonly: boolean = nextProps.readonly || false;
            await this.setReadonlyAsync(readonly);
        }

        await super.componentWillReceiveProps(nextProps);
    }

    render(): React.ReactNode {
        
        const inlineStyle: any = (this.props.inline) && (styles.inline);
        
        return (
            <form className={this.css(styles.form, inlineStyle, this.props.className)}
                  onKeyDown={async (e: React.KeyboardEvent) => await this.handleKeydownAsync(e)}
                  onSubmit={async (e: React.FormEvent<HTMLFormElement>) => await this.handleSubmitAsync(e)}
            >
                
                {this.state.validationErrors.length > 0 && 
                    <ul className={styles.errorList}>
                        {this.state.validationErrors.map((error, index) => (
                            <li key={index}>
                                <span>{this.localizer.get(error)}</span>
                            </li>
                        ))}
                    </ul>
                }
                
                {
                    (this.props.inline)
                        ? <Inline>{this.children}</Inline>
                        : <React.Fragment>{this.children}</React.Fragment>
                }
                
            </form>
        );
    }
}