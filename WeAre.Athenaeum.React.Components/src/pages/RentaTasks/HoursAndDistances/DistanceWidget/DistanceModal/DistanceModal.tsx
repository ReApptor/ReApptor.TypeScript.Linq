import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseComponent, IBaseComponent} from "@weare/athenaeum-react-common";
import Modal from "@/components/Modal/Modal";
import Form from "@/components/Form/Form";
import Button, {ButtonType} from "@/components/Button/Button";
import WorkOrderDistance from "@/models/server/WorkOrderDistance";
import {IDateInputModel, INumberInputModel} from "@/components/Form/Inputs/BaseInput";
import DateInput from "@/components/Form/Inputs/DateInput/DateInput";
import NumberInput from "@/components/Form/Inputs/NumberInput/NumberInput";
import Localizer from "@/localization/Localizer";

import styles from "./DistanceModal.module.scss";

interface IDistanceModalProps {
    onChange(sender: IBaseComponent, distance: WorkOrderDistance): Promise<void>;
}

interface IDistanceModalState {
}

export default class DistanceModal extends BaseComponent<IDistanceModalProps, IDistanceModalState> {
    private readonly _modalRef: React.RefObject<Modal<WorkOrderDistance>> = React.createRef();
    private readonly _formRef: React.RefObject<Form> = React.createRef();

    private day: IDateInputModel = {value: new Date()};
    private value: INumberInputModel = {value: 0};
    private vehicles: INumberInputModel = {value: 0};

    private async onSubmitAsync(): Promise<void> {
        this.distance.day = this.day.value;
        this.distance.value = this.value.value;
        this.distance.vehicles = this.vehicles.value || 1;
        
        await this.props.onChange(this, this.distance);
        
        await this.modal.closeAsync();
    }

    private get distance(): WorkOrderDistance {
        return this._modalRef.current!.data!;
    }
    
    private get isToday(): boolean {
        return this.distance.day.isToday();
    }
    
    private get title(): string {
        return (this.isOpen)
            ? "{0:dd.MM.yyyy}".format(this.day.value)
            : "...";
    }

    private get modal(): Modal {
        return this._modalRef.current!;
    }

    public async openAsync(distance: WorkOrderDistance): Promise<void> {
        this.day.value = distance.day;
        this.value.value = distance.value;
        this.vehicles.value = distance.vehicles;
        await this.modal.openAsync(distance);
        await this.reRenderAsync();
    }

    public async closeAsync(): Promise<void> {
        await this.modal.closeAsync();
        await this.reRenderAsync();
    }

    public get isOpen(): boolean {
        return (this._modalRef.current != null) && (this._modalRef.current.isOpen);
    }

    public render(): React.ReactNode {
        return (
            <Modal id={"distanceModal"} ref={this._modalRef}
                   className={styles.distanceModal}
                   title={this.title}
                   subtitle={Localizer.distanceModalSubtitle}
            >
                
                {
                    (this.isOpen) &&
                    (
                        <div className="row">
                            <div className="col">

                                <Form className={styles.form}
                                      ref={this._formRef}
                                      id="distance"
                                      onSubmit={async () => await this.onSubmitAsync()}>

                                    <DateInput id="day" required readonly={this.isToday}
                                               label={Localizer.distanceModalLabelsDate}
                                               minDate={Utility.today().addDays(-31)}
                                               maxDate={Utility.today()}
                                               model={this.day}
                                    />

                                    <NumberInput id="vehicles" required
                                                 label={Localizer.distanceModalLabelsVehicles}
                                                 min={1} max={99}
                                                 model={this.vehicles}
                                    />

                                    <NumberInput id="value" required
                                                 label={Localizer.distanceModalLabelsValue}
                                                 min={0} max={999}
                                                 model={this.value}
                                    />

                                    <div>

                                        <Button className={styles.buttons}
                                                type={ButtonType.Light}
                                                label={Localizer.genericCancel}
                                                onClick={async () => await this.closeAsync()}
                                        />

                                        <Button className={this.css(styles.buttons, "float-right")} submit
                                                type={ButtonType.Orange}
                                                label={Localizer.genericSave}
                                        />

                                    </div>

                                </Form>

                            </div>
                        </div>
                    )                    
                }
                
            </Modal>
        )
    }
}