import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import Localizer from "../../../../../localization/Localizer";

import styles from "./LiveValidator.module.scss";

export class ValidationRow {
    public regex: string;
    public description: string;
    public isValid: boolean;
    
    constructor(regex: string, description: string, isValid: boolean = false) {
        this.regex = regex;
        this.description = description;
        this.isValid = isValid;
    }
}

interface ILiveValidatorProps {
    validationRows: ValidationRow[];
    value: any;
    validLength?: number
}

interface ILiveValidatorState {
    validationRows: ValidationRow[],
    isLengthValid: boolean
}

export default class LiveValidator extends BaseComponent<ILiveValidatorProps, ILiveValidatorState> {
    state: ILiveValidatorState = {
        validationRows: this.validationRows,
        isLengthValid: !this.props.validLength
    };
    
    private get validationRows(): ValidationRow[] {
        return this.props.validationRows;
    }
    
    private async validateAsync(value: any): Promise<void> {
        const validationRows: ValidationRow[] = this.state.validationRows.map((row: ValidationRow) => {
            if(new RegExp(row.regex).test(value)) {
                return {...row, isValid: true};
            }
            
            return {...row, isValid: false};
        });
        
        let isLengthValid: boolean = true;
        if (this.props.validLength) {
            isLengthValid = value.length >= this.props.validLength;
        }
        
        await this.setState({validationRows, isLengthValid});
    }
    
    public get isValid(): boolean {
        return this.state.validationRows.every((row: ValidationRow) => row.isValid) && this.state.isLengthValid;
    }
    
    public async componentWillReceiveProps(nextProps: ILiveValidatorProps): Promise<void> {
        if(nextProps.value !== this.props.value) {
            await this.validateAsync(nextProps.value);
        }
        
        if(nextProps.validationRows !== this.props.validationRows) {
            await this.setState({validationRows: nextProps.validationRows});
        }
    }

    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        await this.validateAsync(this.props.value)
    }

    render() {
        return (
            <div className={styles.liveValidator}>
                <table>
                    <tbody>
                    {
                        this.state.validationRows.map((validationRow: ValidationRow, index: number) => (
                            <tr key={index} className={this.css(validationRow.isValid ? styles.valid : styles.invalid)}>
                                <td>
                                    {
                                        validationRow.isValid ? <i className="fa fa-check"/> : <i className="fa fa-times"/>
                                    }
                                </td>
                                <td>
                                    {
                                        validationRow.description
                                    }
                                </td>
                            </tr>
                        ))
                    }
                        
                    {
                        this.props.validLength && (
                            <tr className={this.css(this.state.isLengthValid ? styles.valid : styles.invalid)}>
                                <td>
                                    {
                                        this.state.isLengthValid ? <i className="fa fa-check"/> : <i className="fa fa-times"/>
                                    }
                                </td>
                                <td>
                                    {
                                        Localizer.passwordHelpTextLength
                                    }
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}