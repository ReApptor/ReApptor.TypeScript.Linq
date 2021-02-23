import React from "react";
import Checkbox from "../Checkbox/Checkbox";

import styles from "./Switch.module.scss";

export default class Switch extends Checkbox {
    renderInput(): React.ReactNode {
        const toggleStyles = this.checked ? styles.checked : styles.switch;
        
        return (
            <div onClick={async () => await this.toggleAsync()} className={this.css(toggleStyles, (this.readonly && styles.readonly))}>
                <span className={styles.toggler} />
            </div>
        );
    }
}
