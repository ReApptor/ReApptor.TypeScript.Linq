import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseComponent, IBaseComponent} from "@weare/athenaeum-react-common";
import Modal from "@/components/Modal/Modal";
import Form from "@/components/Form/Form";
import Button, {ButtonType} from "@/components/Button/Button";
import UserSalaryHour from "@/models/server/UserSalaryHour";
import DateInput from "@/components/Form/Inputs/DateInput/DateInput";
import NumberInput from "@/components/Form/Inputs/NumberInput/NumberInput";
import User from "@/models/server/User";
import Dropdown from "@/components/Form/Inputs/Dropdown/Dropdown";
import Localizer from "@/localization/Localizer";

import styles from "./DailyHoursModal.module.scss";

interface IDailyHoursModalProps {
    mounters: User[];
    onChange(sender: IBaseComponent, hour: UserSalaryHour): Promise<void>;
}

interface IDailyHoursModalState {
}

export default class DailyHoursModal extends BaseComponent<IDailyHoursModalProps, IDailyHoursModalState> {
    private readonly _modalRef: React.RefObject<Modal<UserSalaryHour>> = React.createRef();
    private readonly _formRef: React.RefObject<Form> = React.createRef();

    private async onSubmitAsync(): Promise<void> {
        await this.props.onChange(this, this.hour);
        await this.modal.closeAsync();
    }

    private get hour(): UserSalaryHour {
        return this._modalRef.current!.data!;
    }
    
    private get title(): string {
        return (this.isOpen)
            ? "{0}, {1:dd.MM.yyyy}".format(this.hour.user, this.hour.day)
            : "...";
    }

    private get modal(): Modal {
        return this._modalRef.current!;
    }

    public async openAsync(hour: UserSalaryHour): Promise<void> {
        await this.modal.openAsync(hour);
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
            <Modal id="dailyHoursModal" ref={this._modalRef}
                   className={styles.dailyHoursModal}
                   title={this.title}
                   subtitle={Localizer.dailyHoursModalSubtitle}
            >
                
                {
                    (this.isOpen) &&
                    (
                        <div className="row">
                            <div className="col">

                                <Form className={styles.form}
                                      ref={this._formRef}
                                      id="dailyHours"
                                      onSubmit={async () => await this.onSubmitAsync()}>
                                    
                                    <Dropdown id="mounters" required noSubtext
                                              label={Localizer.dailyHoursModalLabelsMounter}
                                              items={this.props.mounters}
                                              selectedItem={this.hour.user!.id}
                                              onChange={async (sender, value) => { this.hour.user = value!; this.hour.userId = value!.id; } }
                                    />

                                    <DateInput id="day" required
                                               label={Localizer.dailyHoursModalLabelsDate}
                                               minDate={Utility.today().addDays(-31)}
                                               maxDate={Utility.today()}
                                               value={this.hour.day}
                                               onChange={async (value) => { this.hour.day = value }}
                                    />
                                    
                                    <NumberInput id="normalHours" required
                                                 label={Localizer.dailyHoursModalLabelsNormalHours}
                                                 step={0.5}
                                                 value={this.hour.normalHours}
                                                 onChange={async (sender, value) => { this.hour.normalHours = value }}
                                    />

                                    <NumberInput id="overtime50Hours" required
                                                 label={Localizer.dailyHoursModalLabelsOvertime50Hours}
                                                 min={0} max={24}
                                                 step={0.5}
                                                 value={this.hour.overtime50Hours}                                                 
                                                 onChange={async (sender, value) => { this.hour.overtime50Hours = value }}
                                    />

                                    <NumberInput id="overtime100Hours" required
                                                 label={Localizer.dailyHoursModalLabelsOvertime100Hours}
                                                 min={0} max={24}
                                                 step={0.5}
                                                 value={this.hour.overtime100Hours}
                                                 onChange={async (sender, value) => { this.hour.overtime100Hours = value }}
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