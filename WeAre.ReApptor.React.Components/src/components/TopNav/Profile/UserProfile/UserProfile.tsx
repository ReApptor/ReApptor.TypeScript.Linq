import React from "react";
import {BaseComponent} from "@weare/reapptor-react-common";
import {IUserProfile} from "@weare/reapptor-react-components";
import Icon, {IconSize} from "../../../Icon/Icon";
import TopNavLocalizer from "../../TopNavLocalizer";

import styles from "./UserProfile.module.scss";

interface IUserProfileProps extends IUserProfile {
    id?: string;
}

interface IUserProfileState {
}

export class UserProfile extends BaseComponent<IUserProfileProps, IUserProfileState> {

    state: IUserProfileState = {};

    public get profile(): IUserProfile {
        return this.props;
    }

    public get rating(): number[] {
        const rating: number[] = [];
        for (let i = 0; i < (this.profile.rating ?? 0); i++) {
            rating[i] = i;
        }
        return rating;
    }

    public render(): React.ReactNode {
        if (this.profile.render) {
            return this.profile.render(this.props);
        }

        return (
            <div id={this.id} className={this.css(this.props.className, styles.userProfile)}>

                <div className={styles.avatar}>

                    {Icon.renderIcon(this.profile.avatar ?? "fa fa-user-circle", styles.avatar, IconSize.X5)}

                </div>

                <div className={styles.info}>
                    
                    <span className={this.css(styles.label, styles.fullName)}>
                        {this.profile.userFullName}
                    </span>

                    <span className={this.css(styles.label, styles.roleName)}>
                        {TopNavLocalizer.get(this.profile.roleName)}
                    </span>

                    <div className={styles.rating}>
                        {
                            this.rating.map((index: number) => (
                                <Icon key={index} className={styles.star} name={"fas fa-star"} size={IconSize.Normal}/>
                            ))
                        }
                    </div>

                </div>

            </div>
        )
    }
}