import React from "react";
import {FileModel, ITransformProvider, ServiceProvider, Utility} from "@weare/reapptor-toolkit";
import {ApplicationContext, BaseComponent, ch, IGlobalClick, IGlobalKeydown, IUser, IUserContext} from "@weare/reapptor-react-common";
import {IIconProps, IMenuItem, ITopNavProfile, IUserProfile} from "@weare/reapptor-react-components";
import {MenuItem} from "../MenuItem/MenuItem";
import Icon, {IconSize} from "../../Icon/Icon";
import {UserProfile} from "./UserProfile/UserProfile";

import styles from "./Profile.module.scss";

interface IProfileProps extends ITopNavProfile {
}

interface IProfileState {
    expanded: boolean;
}

export default class Profile extends BaseComponent<IProfileProps, IProfileState> implements IGlobalClick, IGlobalKeydown {
    state: IProfileState = {
        expanded: false,
    };
    
    private get containerId(): string {
        return `${this.id}_container`;
    }

    private async toggleAsync(): Promise<void> {
        const expanded: boolean = !this.state.expanded;
        
        await this.setState({expanded});
    };

    private async closeAsync(): Promise<void> {
        if (this.expanded) {
            await this.setState({expanded: false});
        }
    }

    public async onGlobalClick(e: React.SyntheticEvent): Promise<void> {
        if (this.expanded) {
            const target = e.target as Node;
            const outside: boolean = Utility.clickedOutside(target, this.id);
            if (outside) {
                await this.closeAsync();
            }
        }
    }

    public async onGlobalKeydown(e: React.KeyboardEvent): Promise<void> {
        if ((this.expanded) && (e.keyCode == 27)) {
            await this.closeAsync();
        }
    }
    
    public static findUserProfile(): IUserProfile | null {
        const context: ApplicationContext | null = ch.findContext();
        const userContext: IUserContext | null = context as IUserContext;
        if (userContext) {
            const user: IUser | null = userContext.user;
            if (user) {
                const transformProvider: ITransformProvider | null = ServiceProvider.findTransformProvider();
                const userFullName: string | null = transformProvider?.toString(user) || Utility.findStringValueByAccessor(user, ["fullName", "username", "login"]);
                if (userFullName) {
                    const roleNameAccessor = ["role.Name", "role.roleName", "roleName"];
                    const role: any = Utility.findValueByAccessor(userContext, "role") || Utility.findValueByAccessor(user, "role");
                    const roleName: string | null = transformProvider?.toString(role) || Utility.findStringValueByAccessor(userContext, roleNameAccessor) || Utility.findStringValueByAccessor(user, roleNameAccessor);
                    const rating: number | null = Utility.findValueByAccessor(user, "rating");
                    const avatar: IIconProps | FileModel | string | null = Utility.findValueByAccessor(user, "avatar");

                    return {
                        userFullName,
                        roleName,
                        rating,
                        avatar
                    } as IUserProfile;
                }
            }
        }
        return null;
    }
    
    public static resolveUserProfile<TResolver = {}>(resolver: TResolver, userProfile?: boolean | IUserProfile | ((sender: TResolver) => IUserProfile)): IUserProfile | null {
        return (userProfile != null)
            ? (typeof userProfile === "function")
                ? userProfile(resolver)
                : (typeof userProfile === "boolean")
                    ? userProfile
                        ? Profile.findUserProfile()
                        : null
                    : userProfile
            : null;
    }

    public getUserProfile(): IUserProfile | null {
        return Profile.resolveUserProfile(this, this.props.userProfile);
    }
    
    public get items(): IMenuItem[] {
        return this.props.items ?? [];
    }
    
    public get expanded(): boolean {
        return this.state.expanded;
    }

    public render(): React.ReactNode {
        const userProfile: IUserProfile | null = this.getUserProfile();

        const expandedStyle: any = (this.state.expanded) && styles.expanded;
        
        return (
            <div id={this.id} className={this.css(styles.profile, this.props.className, expandedStyle)}>
                
                <div className={styles.icon} onClick={async () => await this.toggleAsync()}>
                    {
                        Icon.renderIcon(this.props.icon || "far user-circle", null, IconSize.X2)
                    }
                </div>
                
                {
                    (this.items) &&
                    (
                        <div id={this.containerId} className={this.css(styles.container, expandedStyle)}>

                            <div className={styles.userProfileContainer}>

                                { (userProfile) && (<UserProfile {...userProfile}/>) }

                            </div>

                            <div className={styles.itemsContainer}>
                                
                                {
                                    this.items.map((item: IMenuItem, index: number) =>
                                        (
                                            <MenuItem key={index} {...item} onClick={() => this.closeAsync()} />
                                        )
                                    )
                                }

                            </div>

                        </div>
                    )
                }
                
            </div>
        );
    }
}