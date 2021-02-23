import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";

import styles from "../Layout/Layout.module.scss";

interface IFourColumnsProps {
    className?: string;
}

export default class FourColumns extends BaseComponent<IFourColumnsProps> {
    
    private renderRow(left: React.ReactNode | null, left2: React.ReactNode | null, right: React.ReactNode | null, right2: React.ReactNode | null): React.ReactNode {
        return (
            <div className={this.css(styles.row, this.props.className, "row")}>
                <div className="col-md-3">
                    {left}
                </div>
                <div className="col-md-3">
                    {left2}
                </div>
                <div className="col-md-3">
                    {right}
                </div>
                <div className="col-md-3">
                    {right2}
                </div>
            </div>
        );
    }
    
    render(): React.ReactNode {
        return (
            <React.Fragment>
                {
                    ((this.props.children) && (this.children.length > 0))
                    && 
                    this.renderRow(
                        this.children[0], 
                        this.children[1], 
                        this.children[2], 
                        this.children[3]
                    )
                }
            </React.Fragment> 
        );
    }
};
