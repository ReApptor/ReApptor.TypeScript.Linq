declare module 'react-signature-canvas' {
    // signature_pad's props
    export interface IOptions {
        dotSize?: number | (() => number);
        minWidth?: number;
        maxWidth?: number;
        minDistance?: number;
        backgroundColor?: string;
        penColor?: string;
        throttle?: number;
        velocityFilterWeight?: number;
        onBegin?: (event: MouseEvent | Touch) => void;
        onEnd?: (event: MouseEvent | Touch) => void;
    }

    // props specific to the React wrapper
    export interface SignatureCanvasProps extends IOptions {
        canvasProps?: any;
        clearOnResize?: boolean;
    }

    export default class SignatureCanvas extends React.Component<SignatureCanvasProps> {
        getCanvas(): HTMLCanvasElement;
        clear(): void;
        toData(): any;
        toDataURL(): string;
    }
}