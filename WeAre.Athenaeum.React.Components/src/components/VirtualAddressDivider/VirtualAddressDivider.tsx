import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import TwoColumns from "../TwoColumn/TwoColumns";
import TextInput from "../TextInput/TextInput";
import { IInput } from "../../models/base/BaseInput";
import OneColumn from "@/components/OneColumn/OneColumn";
import FormLocalizer from "@/components/Form/FormLocalizer";

interface IVirtualAddressDividerProps {
    id?: string;
    required?: boolean;
    readonly?: boolean;
    value?: string;
    onChange?(sender: VirtualAddressDivider, virtualAddress: string): Promise<void>;
}

interface IAddressVirtualDividerState {
    readonly: boolean;
    city: string;
    postalCode: string;
    address: string;
}

export default class VirtualAddressDivider extends BaseComponent<IVirtualAddressDividerProps, IAddressVirtualDividerState> implements IInput {
    
    state: IAddressVirtualDividerState = {
        readonly: this.props.readonly || false,
        city: "",
        postalCode: "",
        address: ""
    };
    
    private readonly _addressInputRef: React.RefObject<TextInput> = React.createRef();
    private readonly _cityInputRef: React.RefObject<TextInput> = React.createRef();
    private readonly _postalCodeInputRef: React.RefObject<TextInput> = React.createRef();

    private get virtualAddress(): string {
        return `${this.state.city}, ${this.state.postalCode}, ${this.state.address}`
    }
    
    private async setVirtualAddressAsync(value: string): Promise<void> {
        const items: string[] = value.split(",");
        if (items.length >= 3) {
            const city: string = value.split(",")[0].trim();
            const postalCode: string = value.split(",")[1].trim();
            const address: string = value.split(",")[2].trim();
            await this.setState({city, postalCode, address});
        }
    }
    
    private async onCityChange(value: string): Promise<void> {
        await this.setState({city: value})
    }

    private async onPostalCodeChange(value: string): Promise<void> {
        await this.setState({postalCode: value})
    }

    private async onAddressChange(value: string): Promise<void> {
        await this.setState({address: value})
    }
    
    public isInput(): boolean { return true };

    public isValid(): boolean {
        return !!(this.state.address && this.state.city && this.state.postalCode);
    }

    public getName(): string {
        return this.id;
    }
    
    public getValue(): any {
        return this.virtualAddress;
    }

    public get readonly(): boolean {
        return this.state.readonly;
    }

    public async setReadonlyAsync(value: boolean): Promise<void> {
        if (value != this.state.readonly) {
            await this.setState({ readonly: value });
            await this._addressInputRef.current!.setReadonlyAsync(value);
        }
    }

    public async validateAsync(): Promise<void> {
        await this._addressInputRef.current!.validateAsync();
        await this._cityInputRef.current!.validateAsync();
        await this._postalCodeInputRef.current!.validateAsync();
    }

    public async hideEditAsync(): Promise<void> {
    }

    public async showEditAsync(select?: boolean): Promise<void> {
    }

    public async componentDidMount(): Promise<void> {
        if (this.props.value) {
            await this.setVirtualAddressAsync(this.props.value);
        }
    }

    render() {
        return (
            <React.Fragment>
                <OneColumn>
                    <TextInput ref={this._addressInputRef}
                               id={`${this.id}_address`} required
                               label={FormLocalizer.inputStreet} 
                               value={this.state.address}
                               onChange={async (sender, value) => await this.onAddressChange(value)}
                    />
                </OneColumn>
                
                <TwoColumns>
                    <TextInput ref={this._cityInputRef}
                               id={`${this.id}_city`} required
                               label={FormLocalizer.inputCity} 
                               value={this.state.city}
                               onChange={async (sender, value) => await this.onCityChange(value)}
                    />
                               
                    <TextInput ref={this._postalCodeInputRef}
                               id={`${this.id}_postalCode`} required
                               label={FormLocalizer.inputPostalcode} 
                               value={this.state.postalCode}
                               onChange={async (sender, value) => await this.onPostalCodeChange(value)}
                    />
                </TwoColumns>
            </React.Fragment>
        )
    }
}
