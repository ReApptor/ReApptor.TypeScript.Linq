import React from "react";
import {BaseComponent, IGlobalClick} from "@weare/athenaeum-react-common";
import Icon, {IconSize} from "../../Icon/Icon";
import {Button, Inline, IStringInputModel, OneColumn, TextInput} from "@weare/athenaeum-react-components";
import TopNavLocalizer from "../TopNavLocalizer";

import styles from "./Search.module.scss";


interface ISearchProps {
    className?: string;
    searchPlaceHolder?: string;
    onSearch?(searchTerm: string): void;
}

interface ISearchState {
    isOpen: boolean;
}

class Search extends BaseComponent<ISearchProps, ISearchState> implements IGlobalClick {
    state = {
        isOpen: false
    };

    private _searchInputModel: IStringInputModel = { value: "" };

    private async dropdownToggleAsync(): Promise<void> {
        let isOpen: boolean = !this.state.isOpen;
        await this.setState({isOpen});
    };

    private async closeDropdownAsync(): Promise<void> {
        await this.setState({isOpen: false});
    }

    private async onSearchButtonCLickAsync(): Promise<void> {
        if(this._searchInputModel.value.length >= 3) {
            if(this.props.onSearch) {
                this.props.onSearch(this._searchInputModel.value);
            }
        }
        this._searchInputModel.value = "";
        await this.closeDropdownAsync();
    };

    public async onGlobalClick(e: React.SyntheticEvent): Promise<void> {
        let target = e.target as Node;
        let container = document.querySelector(`.${styles.dropdown}`);
        let outside: boolean = ((container != null) && (!container.contains(target)));
        if (outside) {
            await this.closeDropdownAsync();
        }
    }

    public render(): React.ReactNode {
        const className: string = (this.state.isOpen) ? styles.dropdown_open : styles.searchContainer;

        return (
            <div className={this.css(styles.dropdown, this.props.className)}>
                <Icon name={"search"}
                      size={IconSize.X2}
                      className={this.props.className ?? styles.right_search}
                      onClick={async () => await this.dropdownToggleAsync()}
                />
                <div className={className}>
                    <OneColumn>
                        <Inline>
                            <TextInput placeholder={this.props.searchPlaceHolder} 
                                       width={"250px"}
                                       model={this._searchInputModel}
                            />
                            <Button label={TopNavLocalizer.searchButton}
                                    onClick={async () => await this.onSearchButtonCLickAsync()}
                            />
                        </Inline>
                    </OneColumn>

                </div>
            </div>
        );
    }

}

export default Search;