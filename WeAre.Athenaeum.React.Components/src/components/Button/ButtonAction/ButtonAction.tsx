import React from "react";
import {Justify} from "@weare/athenaeum-react-common";
import Icon, {IIconProps} from "@/components/Icon/Icon";

import styles from "../Button.module.scss"

export interface IButtonActionProps {
    title: string;
    icon?: IIconProps;
    iconPosition?: Justify;
    onClick(): Promise<void>;
}

const ButtonAction: React.FC<IButtonActionProps> = ({title, icon, iconPosition, onClick}) => {
    const hasIcon: boolean = !!icon;
    const hasPosition: boolean = !!iconPosition;

    const positionLeft: boolean = hasIcon && !hasPosition;
    const positionRight: boolean = hasIcon && hasPosition && iconPosition == Justify.Right;

    return (
        <div className={styles.action} onClick={async () => await onClick()}>
            {
                positionLeft && <Icon {...icon as IIconProps} />
            }
            
            <span>{title}</span>

            {
                positionRight && <Icon {...icon as IIconProps} />
            }
        </div>
    );
}

export default ButtonAction;