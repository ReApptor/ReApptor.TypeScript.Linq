import React from "react";
import {BaseComponent, CameraType, ch} from "@weare/reapptor-react-common";
import {Button, ButtonContainer, ButtonType, PageRow} from "@weare/reapptor-react-components";
import {FileModel} from "@weare/reapptor-toolkit";

interface IInlineImageTestsState {
    image: FileModel | null;
}

export default class InlineImageTests extends BaseComponent {

    public state: IInlineImageTestsState = {
        image: null
    };
    
    private async takePictureAsync(camera: boolean | CameraType = true): Promise<void> {
        const image: FileModel | null = await ch.takePictureAsync(camera);

        if (image != null) {
            await this.setState({image});
        }
    }
    
    private async clearPictureAsync(): Promise<void> {
        await this.setState({ image: null });
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                
                <PageRow>
                    
                    <ButtonContainer>

                        <Button label={"Camera"}
                                icon={{name: "fas fa-phone"}}
                                type={ButtonType.Blue}
                                onClick={() => this.takePictureAsync(true)}
                        />

                        <Button label={"Camera (UserFacingCamera)"}
                                icon={{name: "fas fa-phone"}}
                                type={ButtonType.Blue}
                                onClick={() => this.takePictureAsync(CameraType.UserFacingCamera)}
                        />

                        <Button label={"Camera (OutwardFacingCamera)"}
                                icon={{name: "fas fa-phone"}}
                                type={ButtonType.Blue}
                                onClick={() => this.takePictureAsync(CameraType.OutwardFacingCamera)}
                        />

                        <Button label={"Image"}
                                icon={{name: "fas fa-image"}}
                                type={ButtonType.Blue}
                                onClick={() => this.takePictureAsync(false)}
                        />

                        <Button label={"Clear image"}
                                type={ButtonType.Link}
                                onClick={() => this.clearPictureAsync()}
                        />

                        <Button label={"Call-to"}
                                icon={{name: "fas fa-image"}}
                                type={ButtonType.Blue}
                                onClick={async () => ch.callTo("+7 921 0932323")}
                        />

                        <Button label={"Mail-to"}
                                icon={{name: "fas fa-envelope"}}
                                type={ButtonType.Blue}
                                onClick={async () => ch.mailTo("mail.me@google.com")}
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