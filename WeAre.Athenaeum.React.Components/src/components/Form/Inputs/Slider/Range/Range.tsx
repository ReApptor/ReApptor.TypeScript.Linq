import React from "react";
import { Range as RangeComponent, createSliderWithTooltip, WithTooltipProps, RangeProps } from 'rc-slider';
import BaseInput, { IBaseInputProps, IBaseInputState } from "../../BaseInput";

import styles from "../../../Form.module.scss";
import "rc-slider/assets/index.css";
import "../BootstrapOverride.scss";

interface IRangeProps extends IBaseInputProps<number[]> {
    min?: number;
    max?: number;
    step?: number;
    count?: number;
    defaultValue?: number[];
    onChange?(sender: Range, values: number[]): Promise<void>; 
}

interface IRangeState extends IBaseInputState<number[]> {
    
}

export default class Range extends BaseInput<number[], IRangeProps, IRangeState> {
    private _rangeWithTooltip: new () => React.Component<WithTooltipProps & RangeProps>;
    
    constructor(props: IRangeProps) {
        super(props);
        
        this._rangeWithTooltip = createSliderWithTooltip(RangeComponent);
    }
    
    private async handleChangeAsync(values: number[]) {
        if (this.isMounted) {
            if(this.props.onChange) {
                await this.props.onChange(this, this.state.model.value);
            }

            await this.setState({ model: { value: values} });
        }
    }
    
    public get min(): number {
        return (this.props.min || 0);
    }

    public get max(): number {
        return (this.props.max || 100);
    }

    public get step(): number {
        return (this.props.step || 1);
    }
    
    public get count(): number {
        return (this.props.count) || 2;
    }
    
    public get defaultValue(): number[] {
        return (this.props.defaultValue) || [this.min, this.max]
    }
    
    renderInput(): React.ReactNode {
        return (
            <div className={styles.slider}>
                <this._rangeWithTooltip 
                    min={this.min} 
                    max={this.max} 
                    step={this.step} 
                    count={this.count} 
                    defaultValue={this.defaultValue} 
                    onChange={(values) => this.handleChangeAsync(values)}
                    allowCross={true}
                    trackStyle={[{backgroundColor: "#fe5000"}]}
                    handleStyle={{borderColor: "#fe5000"}}
                />
            </div>
        );
    }
}