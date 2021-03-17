import React from "react";
import {GeoLocation} from "@weare/athenaeum-toolkit";
import {BaseComponent, IBaseComponent} from "@weare/athenaeum-react-common";

import styles from "./LocationPickerModal.module.scss";
import LocationPicker from "../LocationPicker/LocationPicker";
import Modal from "../Modal/Modal";
import LocationPickerModalLocalizer from "./LocationPickerModalLocalizer";
import AddressHelper from "../../helpers/AddressHelper";
import Button, { ButtonType } from "../Button/Button";
import ButtonContainer from '../ButtonContainer/ButtonContainer';

interface ILocationPickerModalProps {
    id?: string;
    className?: string;
    title?: string;
    subtitle?: string;
    location?: GeoLocation;
    infoWindow?: boolean;
    readonly?: boolean;
    onSubmit?(sender: IBaseComponent, location: GeoLocation): Promise<void>
}

interface ILocationPickerModalState {
    location: GeoLocation | null;
}

export default class LocationPickerModal extends BaseComponent<ILocationPickerModalProps, ILocationPickerModalState> {

    state: ILocationPickerModalState = {
        location: this.props.location || null
    };

    private readonly _locationPickerRef: React.RefObject<LocationPicker> = React.createRef();
    private readonly _modalRef: React.RefObject<Modal> = React.createRef();
    
    private async onSubmitAsync(): Promise<void> {
        if (this.props.onSubmit && this.locationPicker && this.location && !this.readonly) {
            await this.props.onSubmit(this, this.location);
        }
        
        if (this.modal) {
            await this.modal.closeAsync();
        }
    }

    private async onChangeAsync(location: GeoLocation): Promise<void> {
        if (this.locationPicker) {
            await this.setState({ location } );
        }
    }
    
    private get locationPicker(): LocationPicker | null {
        return this._locationPickerRef.current;
    }

    private get modal(): Modal | null {
        return this._modalRef.current;
    }
    
    private get location(): GeoLocation | null {
        return this.state.location;
    }

    private get formattedAddress(): string {
        if (this.locationPicker) {
            return this.locationPicker.formattedAddress;
        }
        return "";
    }
    
    public async openAsync(): Promise<void> {
        if (this.modal) {
            await this.modal.openAsync();
        }
    }

    public async componentWillReceiveProps(nextProps: ILocationPickerModalProps): Promise<void> {
        if (nextProps.location && (nextProps.location != this.state.location)) {
            await this.setState({ location: nextProps.location });
        }
    }

    public get readonly(): boolean {
        return (this.props.readonly == true);
    }

    render(): React.ReactNode {
        return (
            <Modal id={this.id}
                   ref={this._modalRef}
                   title={this.props.title || LocationPickerModalLocalizer.title}
                   subtitle={this.props.subtitle || LocationPickerModalLocalizer.subtitle}
                   className={styles.locationPickerModal}
            >
                <div className={styles.map}>
                    <LocationPicker ref={this._locationPickerRef} 
                                    location={this.location || undefined}
                                    infoWindow={this.props.infoWindow}
                                    readonly={this.readonly}
                                    onChange={async (sender, location) => await this.onChangeAsync(location)}
                    />
                </div>
                
                <ButtonContainer>
                    
                    <div className={styles.address}>

                        <span>{AddressHelper.removeLatLon(this.formattedAddress)}</span>
                        
                        {
                            (this.location) && (AddressHelper.hasCoordinates(this.location)) &&
                            (
                                <span className={styles.dms}>{AddressHelper.toDMS(this.location)}</span>
                            )
                        }
                        
                    </div>

                    {
                        (!this.readonly)
                            ? (<Button type={ButtonType.Orange} label={LocationPickerModalLocalizer.setLocation} onClick={async () => await this.onSubmitAsync()}/>)
                            : <div/>
                    }
                    
                </ButtonContainer>
                
            </Modal>
        )
    }
}
