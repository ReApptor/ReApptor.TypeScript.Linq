import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import Icon from "../../../Icon/Icon";

import styles from "../StepsWidget.module.scss";

interface IStepProps {
    index: number;
    first?: boolean;
    last?: boolean;
    title?: string | null;
    completed: boolean;
}

export default class Step extends BaseComponent<IStepProps> {

    render(): React.ReactNode {

        const firstStyle = (this.props.first) && (this.desktop) && (styles.first);
        const lastStyle = (this.props.last) && (this.desktop) && (styles.last);

        return (
            <div id={`tooltip_${this.id}`} className={this.css(styles.iconContainer, this.props.completed && (styles.completed))}
                 title={this.props.title || ""}
                 data-toggle={this.mobile ? "tooltip" : ""}>
                
                <Icon {...{ name: "far circle", }} className={styles.icon} />
                <span className={styles.number}>{this.props.index}</span>

                {!this.mobile && <span className={this.css(styles.title, firstStyle, lastStyle)}>{this.props.title}</span>}
                
            </div>
        )
    }
}