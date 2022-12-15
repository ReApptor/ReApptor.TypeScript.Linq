import React from "react";
import {BaseComponent, IBaseContainerComponentProps} from "@weare/reapptor-react-common";

import styles from "../Layout/Layout.module.scss";

interface IThreeColumnsProps extends IBaseContainerComponentProps {
}

export default class ThreeColumns extends BaseComponent<IThreeColumnsProps> {
    
    private renderRow(left: React.ReactNode | null, middle: React.ReactNode | null, right: React.ReactNode | null): React.ReactNode {
        return (
            <div className={this.css(styles.row, "row")}>
                <div className="col-md-4">
                    {left}
                </div>
                <div className="col-md-4">
                    {middle}
                </div>
                <div className="col-md-4">
                    {right}
                </div>
            </div>
        );
    }
    
    public render(): React.ReactNode {
        return (
            <React.Fragment>
                {
                  this.props.children &&  this.children.length > 0 && this.renderRow(this.children[0], this.children[1], this.children[2])                   
                }
            </React.Fragment> 
        );
    }
};
