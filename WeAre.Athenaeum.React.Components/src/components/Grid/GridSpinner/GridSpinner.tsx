import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import Spinner from "../../Spinner/Spinner";

interface IGridSpinnerProps {
}

interface IGridSpinnerState {
}

export default class GridSpinner extends BaseComponent<IGridSpinnerProps, IGridSpinnerState> {

    public hasSpinner(): boolean {
        return true;
    }
    
    render(): React.ReactNode {

        return (
            <React.Fragment>
                { (this.isSpinning()) && <Spinner /> }
            </React.Fragment>
        );
        
    }
}