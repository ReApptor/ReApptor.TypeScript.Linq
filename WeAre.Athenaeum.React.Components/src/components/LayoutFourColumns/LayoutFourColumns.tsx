import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";

import layoutStyles from "../Layout/Layout.module.scss";

interface IFourColumnsProps {
    className?: string;
}

export default class FourColumns extends BaseComponent<IFourColumnsProps> {
    
    private renderRow(left: React.ReactNode | null, left2: React.ReactNode | null, right: React.ReactNode | null, right2: React.ReactNode | null): React.ReactNode {
        return (
            <div className={this.css(layoutStyles.row, this.props.className, "row")}>
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
        const children: React.ReactElement[] = this.children;
        return (
            <React.Fragment>
                {
                    (children.length > 0) &&
                    (
                        this.renderRow(children[0], children[1], children[2], children[3])
                    )
                }
            </React.Fragment>
        );
    }
};
