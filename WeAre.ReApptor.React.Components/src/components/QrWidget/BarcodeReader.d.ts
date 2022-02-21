// Type definitions for react-barcode-reader 0.0.2

declare module "react-barcode-reader" {

    import * as React from "react";

    declare namespace BarcodeReader {
        interface props {
            onScan: (data: string | null) => void;
            onError: (err: any) => void;
            onLoad?: (() => void) | undefined;
            onImageLoad?: ((event: React.SyntheticEvent<HTMLImageElement>) => void) | undefined;
            delay?: number | false | undefined;
            facingMode?: 'user' | 'environment' | undefined;
            legacyMode?: boolean | undefined;
            resolution?: number | undefined;
            showViewFinder?: boolean | undefined;
            style?: any;
            className?: string | undefined;
        }
    }

    export as namespace BarcodeReader;

    declare class BarcodeReader extends React.Component<BarcodeReader.props> {
        openImageDialog: () => void;
    }

    export = BarcodeReader;
    
    // export interface IBarcodeReaderProps {
    //     onScan: (data: string | null) => void;
    //     onError: (err: any) => void;
    //     onLoad?: (() => void) | undefined;
    //     onImageLoad?: ((event: React.SyntheticEvent<HTMLImageElement>) => void) | undefined;
    //     delay?: number | false | undefined;
    //     facingMode?: 'user' | 'environment' | undefined;
    //     legacyMode?: boolean | undefined;
    //     resolution?: number | undefined;
    //     showViewFinder?: boolean | undefined;
    //     style?: any;
    //     className?: string | undefined;
    // }
    //
    // export default class BarcodeReader extends React.Component<IBarcodeReaderProps> {
    //     openImageDialog: () => void;
    // }
}