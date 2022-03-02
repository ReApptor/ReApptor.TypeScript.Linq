import React from "react";
import {BaseComponent, ch} from "@weare/reapptor-react-common";
import {Button, ButtonContainer, ButtonType, PageRow} from "@weare/reapptor-react-components";
import {FileModel} from "@weare/reapptor-toolkit";

interface IInlineImageTestsState {
    image: FileModel | null;
}

export default class InlineImageTests extends BaseComponent {

    public state: IInlineImageTestsState = {
        image: null
    };
    
    private async takePictureAsync(camera: boolean): Promise<void> {
        const image: FileModel | null = await ch.takePictureAsync(camera);
        
        await this.setState({ image });
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                
                <PageRow>
                    
                    <ButtonContainer>

                        <Button label={"Camera"}
                                icon={{name: "fas fa-camera"}}
                                type={ButtonType.Blue}
                                onClick={() => this.takePictureAsync(true)}
                        />

                        <Button label={"Image"}
                                icon={{name: "fas fa-image"}}
                                type={ButtonType.Blue}
                                onClick={() => this.takePictureAsync(false)}
                        />
                        
                    </ButtonContainer>
                    
                </PageRow>

                <PageRow>
                    
                    {
                        (this.state.image) &&
                        (
                            <div style={{minWidth: 100, minHeight: 100}}>
                                <img src={this.state.image.src} alt={this.state.image.name} />
                            </div>
                        )
                    }

                </PageRow>

            </React.Fragment>
        );
    }
}