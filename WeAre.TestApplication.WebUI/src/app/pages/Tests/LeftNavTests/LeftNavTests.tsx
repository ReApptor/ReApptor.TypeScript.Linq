import React from "react";
import {BaseComponent, ch} from "@weare/reapptor-react-common";
import {Button, ButtonType, Checkbox, FourColumns, IconSize, IMenuItem, InlineType, IUserProfile, LeftNav, OneColumn, TwoColumns} from "@weare/reapptor-react-components";
import TestApplicationController from "../../TestApplicationController";

import styles from "./LeftNavTests.module.scss";

interface ILeftNavTestsState {
    global: boolean;
    showUserProfile: boolean;
    customUserProfile: boolean;
    expanded: boolean;
    autoCollapse: boolean;
    fixed: boolean;
    expandable: boolean;
}

export default class LeftNavTests extends BaseComponent<{}, ILeftNavTestsState> {

    state: ILeftNavTestsState = {
        global: false,
        showUserProfile: true,
        customUserProfile: false,
        expanded: true,
        autoCollapse: false,
        fixed: true,
        expandable: true,
    };
    
    private readonly _leftNavRef: React.RefObject<LeftNav> = React.createRef();

    public async setGlobalAsync(global: boolean): Promise<void> {

        await this.setState({ global });

        await TestApplicationController.switchLeftNavAsync(global);
    }

    public async onToggleAsync(expanded: boolean): Promise<void> {
        await this.setState({ expanded });
    }

    public async signInAsync(): Promise<void> {
        await TestApplicationController.signInAsync();
        await this.reRenderAsync();
    }

    public async signOutAsync(): Promise<void> {
        await TestApplicationController.signOutAsync();
        await this.reRenderAsync();
    }

    public async toggleAsync(): Promise<void> {
    }
    
    private getItems(): IMenuItem[] {
        return TestApplicationController.profile()?.items!;
    }
    
    private get userProfile(): boolean | IUserProfile | null {
        
        if (this.state.showUserProfile) {
            if (this.state.customUserProfile) {
                return {
                    userFullName: "Andrey Popov",
                    roleName: "Administrator",
                    rating: 4
                };
            }

            return true;
        }
        
        return false;
    }

    public render(): React.ReactNode {
        return (
            <div style={{margin: "1rem 0"}} className={styles.leftNavTests}>
                <div className="mb-3">
                    
                    <p>[Left Nav Test]</p>
                    <p>[{ ch.isAuthenticated ? "Authenticated!" : "Anonymous!"}]</p>

                    <hr/>

                    <OneColumn>

                        <FourColumns>

                            <Button block
                                    icon={{name: "far fa-sign-in-alt"}}
                                    label={"Sign-in"}
                                    type={ButtonType.Primary}
                                    disabled={ch.isAuthenticated}
                                    onClick={() => this.signInAsync()}
                            />

                            <Button block
                                    icon={{name: "far fa-sign-out-alt"}}
                                    label={"Sign-out"}
                                    type={ButtonType.Light}
                                    disabled={!ch.isAuthenticated}
                                    onClick={() => this.signOutAsync()}
                            />

                        </FourColumns>

                        <hr/>

                        <Checkbox label="Global (In TopNav)" inline
                                  inlineType={InlineType.Right}
                                  value={this.state.global}
                                  onChange={(sender, value) => this.setGlobalAsync(value)}
                        />

                        <hr/>
                        
                        <Checkbox label="Show user profile" inline
                                  inlineType={InlineType.Right}
                                  value={this.state.showUserProfile}
                                  onChange={async (sender, value) => { await this.setState({showUserProfile: value}) }}
                        />

                        <Checkbox label="Custom user profile" inline
                                  inlineType={InlineType.Right}
                                  readonly={!this.state.showUserProfile}
                                  value={this.state.showUserProfile && this.state.customUserProfile}
                                  onChange={async (sender, value) => { await this.setState({customUserProfile: value}) }}
                        />

                        <Checkbox label="Auto collapse" inline
                                  inlineType={InlineType.Right}
                                  value={this.state.expandable && this.state.autoCollapse}
                                  readonly={!this.state.expandable}
                                  onChange={async (sender, value) => { await this.setState({autoCollapse: value}) }}
                        />

                        <Checkbox label="Fixed layout" inline
                                  inlineType={InlineType.Right}
                                  value={this.state.fixed}
                                  onChange={async (sender, value) => { await this.setState({fixed: value}) }}
                        />

                        <Checkbox label="Expandable layout" inline
                                  inlineType={InlineType.Right}
                                  value={this.state.expandable}
                                  onChange={async (sender, value) => { await this.setState({expandable: value}) }}
                        />
                        
                        <FourColumns>

                        </FourColumns>

                    </OneColumn>

                    <hr/>

                    {
                        (!this.state.global) &&
                        (
                            <div className={styles.leftNavContainer}>
                                
                                <Button icon={{name: this.state.expanded ? "fal fa-times" : "fal fa-bars", size: IconSize.X2}}
                                        className={styles.expander}
                                        type={ButtonType.Orange}
                                        onClick={async () => { await this._leftNavRef.current?.toggleAsync(); }}
                                />

                                <TwoColumns>

                                    <div>

                                        <LeftNav ref={this._leftNavRef}
                                                 className={styles.leftMenu}
                                                 items={async () => this.getItems()}
                                                 minHeight={600}
                                                 userProfile={this.userProfile}
                                                 autoCollapse={this.state.autoCollapse}
                                                 fixed={this.state.fixed}
                                                 expandable={this.state.expandable}
                                                 onToggle={(sender, expanded) => this.onToggleAsync(expanded)}
                                        />

                                    </div>
                                    
                                    <div>
                                        
                                        <span>Context</span>
                                        
                                    </div>

                                </TwoColumns>


                            </div>
                        )
                    }
                    
                </div>
            </div>
        );
    }
}