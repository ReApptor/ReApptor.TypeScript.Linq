import React from "react";
import {BaseComponent, DescriptionModel} from "@weare/athenaeum-react-common";
import Form from "../../Form/Form";
import ButtonContainer from "../../ButtonContainer/ButtonContainer";
import Button, { ButtonType } from "../../Button/Button";
import Popover from "../Popover";
import { Dictionary } from "typescript-collections";
import { IconSize } from "../../Icon/Icon";

import styles from "./Description.module.scss";
import TextAreaInput from "../../TextAreaInput/TextAreaInput";

interface IDescriptionProps {
    model?: DescriptionModel;
}

interface IDescriptionState {
    model: DescriptionModel;
}

export default class Description extends BaseComponent<IDescriptionProps, IDescriptionState> {
   
    state: IDescriptionState = {
        model: this.props.model || new DescriptionModel()
    };
    
    private readonly _popoverRef: React.RefObject<Popover> = React.createRef();
    
    private async onChangeAsync(data: Dictionary<string, string>): Promise<void> {
        
        const description: string = data.getValue("description") || "";

        await this.closeAsync();

        if (description != this.model.description) {
            
            this.model.description = description;
            
            await this.setState({ model: this.model });
            
            if (this.model.onChange) {
                await this.model.onChange(description);
            }
        }
    }
    
    private get popover(): Popover {
        return this._popoverRef.current!;
    }

    public async toggleAsync(containerId: string, model: DescriptionModel): Promise<void> {
        await this.setState({ model });
        await this.popover.toggleAsync(containerId);
    }

    public async openAsync(containerId: string, model: DescriptionModel): Promise<void> {
        await this.toggleAsync(containerId, model);
    }

    public async closeAsync(): Promise<void> {
        await this.popover.closeAsync();
    }
    
    public get model(): DescriptionModel {
        return this.state.model;
    }

    render(): React.ReactNode {
        return (
            <Popover ref={this._popoverRef}
                     className={this.css(styles.description, this.model.className)}
                     justify={this.model.justify}
                     align={this.model.align}
            >
                <Form onSubmit={async (sender, data) => await this.onChangeAsync(data)}>
                    <TextAreaInput id="description" className="mb-2"
                                   autoFocus cols={50} rows={4} maxLength={255}
                                   readonly={this.model.readonly}
                                   value={this.model.description}
                    />
                    {
                        (!this.model.readonly) &&
                        (
                            <ButtonContainer>
                                <Button icon={{name: "fa fa-check", size: IconSize.Large}} submit type={ButtonType.Success} />
                            </ButtonContainer>
                        )
                    }
                </Form>
            </Popover>
        )
    }    
}
