import React from "react";
import SignatureCanvas from "react-signature-canvas";

import styles from "../WidgetContainer.module.scss";
import SignatureWidgetLocalizer from "./SignatureWidgetLocalizer";
import BaseExpandableWidget, { IBaseExpandableWidgetProps } from "../WidgetContainer/BaseExpandableWidget";
import Button, { ButtonType } from "../Button/Button";

export interface ISignatureWidgetProps extends IBaseExpandableWidgetProps {
    onSign?(signature: string | null): Promise<void>;
}

export default class SignatureWidget extends BaseExpandableWidget<ISignatureWidgetProps> {
    
    private _canvasRef: React.RefObject<SignatureCanvas> = React.createRef();
    
    private initializeCanvas(): void {
        const signatureCanvas: SignatureCanvas | null = this._canvasRef.current;

        if(signatureCanvas) {
            const canvas: HTMLCanvasElement = signatureCanvas.getCanvas();
            
            const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
            
            const width: number = canvas.scrollWidth;
            const height: number = canvas.scrollHeight;
            const bottom: number = height - 0.20 * height;

            ctx.beginPath();
            
            ctx.moveTo(10, bottom);
            ctx.lineTo(width - 11, bottom);
            ctx.strokeStyle = "white";
            ctx.stroke();
        }
    }
    
    private async clearCanvas(): Promise<void> {
        if(this._canvasRef.current) {
            this._canvasRef.current.clear();
            this.initializeCanvas();
        }
    }
    
    private async saveSignature(): Promise<void> {
        if(this._canvasRef.current) {
            if (this.props.onSign) {
                await this.props.onSign(this.canvasData);
            }
        }

        await super.hideContentAsync();
    }
    
    protected async onClickAsync(e: React.MouseEvent): Promise<void> {
        let target: Element = e.target as Element;
        
        if(target.parentElement !== null) {
            if((target.parentElement.className === styles.signature && 
                target.className !== styles.icon) ||
                target.parentElement.className === styles.buttonContainer) {
                return;
            }
        }
        
        await super.toggleContentAsync();

        if(this.contentVisible) {
            this.initializeCanvas();
        }
    }
    
    protected async onMouseDownAsync(e: React.MouseEvent): Promise<void> {
        e.preventDefault();
    }
    
    private preventSwipe(e: React.TouchEvent): void {
        e.stopPropagation();
    }

    public get canvasData(): string | null {
        const canvas = this._canvasRef.current || null;

        if(canvas) {
            const rawData = canvas.toData().flat();

            if (rawData.length > 5) {
                return canvas.toDataURL();
            }
        }

        return null;
    }

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();
        await this.setState({icon: { name: "far file-contract" }});
    }

    public async componentWillReceiveProps(nextProps: Readonly<ISignatureWidgetProps>): Promise<void> {
        await super.componentWillReceiveProps(nextProps);
        await this.setState({icon: { name: "far file-contract" }});
    }

    protected renderExpanded(): React.ReactNode {
        return (
            <div className={styles.signature} onTouchStart={(e: React.TouchEvent) => this.preventSwipe(e)}>
                <SignatureCanvas penColor='#007bff'
                                 canvasProps={{className: styles.signaturePad}}
                                 ref={this._canvasRef}
                />

                <div className={styles.buttonContainer}>
                    <Button type={ButtonType.Orange} onClick={() => this.clearCanvas()} label={SignatureWidgetLocalizer.clear} />
                    <Button type={ButtonType.Blue} onClick={() => this.saveSignature()} label={SignatureWidgetLocalizer.done} />
                </div>
            </div>
        );
    }
}