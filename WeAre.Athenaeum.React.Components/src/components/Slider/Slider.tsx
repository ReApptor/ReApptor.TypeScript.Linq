import React from "react";
import SliderComponent, { createSliderWithTooltip, SliderProps, WithTooltipProps } from "rc-slider";
import { BaseComponent } from "@weare/athenaeum-react-common";

import styles from "../Form/Form.module.scss";
import "rc-slider/assets/index.css";
import "./BootstrapOverride.scss";

interface ISliderProps {
    id?: string;
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number;
    maximumAllowed?: number;
    minimumAllowed?: number;
    disabled?: boolean;
    onChange?(sender: Slider): Promise<void>;
}

interface ISliderState {
    defaultValue: number;
    value: number;
}

export default class Slider extends BaseComponent<ISliderProps, ISliderState> {
    static defaultProps = {
        maximumAllowed: 100,
        minimumAllowed: 0
    };

    private _sliderWithTooltip: new () => React.Component<WithTooltipProps & SliderProps>;

    state: ISliderState = {
        defaultValue: this.props.defaultValue || 0,
        value: this.props.defaultValue || 0
    };

    constructor(props: ISliderProps) {
        super(props);

        this._sliderWithTooltip = createSliderWithTooltip(SliderComponent);
    }

    private async handleChangeAsync(value: number) {
        if (this.isMounted) {

            const newSliderValue: number = (this.props.minimumAllowed! <= value && value <= this.props.maximumAllowed!)
                ? value
                : this.state.defaultValue;

            await this.setState({value: newSliderValue});
        }

        if (this.props.onChange) {
            await this.props.onChange(this);
        }
    }

    public get sliderId(): string {
        return this.props.id || this.id;
    }

    public async callbackAsync(): Promise<void> {
        // if(this.props.onChange) {
        //     await this.props.onChange(this);
        // }
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

    public async componentWillReceiveProps(nextProps: ISliderProps): Promise<void> {
        await super.UNSAFE_componentWillReceiveProps(nextProps);

        if(nextProps.defaultValue !== undefined && this.state.defaultValue !== nextProps.defaultValue) {
            this.setState({ defaultValue: nextProps.defaultValue, value: nextProps.defaultValue });
        }
    }

    render(): React.ReactNode {
        return (
            <div className={styles.slider} id={this.sliderId}>
                <this._sliderWithTooltip
                    min={this.min}
                    max={this.max}
                    step={this.step}
                    onChange={(values: any) => this.handleChangeAsync(values)}
                    trackStyle={[{backgroundColor: "#fe5000"}]}
                    handleStyle={{borderColor: "#fe5000"}}
                    onAfterChange={() => this.callbackAsync()}
                    value={this.state.value}
                    disabled={this.props.disabled}
                />
            </div>
        );
    }
}