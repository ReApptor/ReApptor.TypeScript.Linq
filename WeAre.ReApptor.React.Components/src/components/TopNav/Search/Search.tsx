import React from "react";
import {BaseComponent, IGlobalClick} from "@weare/reapptor-react-common";
import Icon, {IconSize} from "../../Icon/Icon";
import {Button, Form, Inline, IStringInputModel, OneColumn, TextInput} from "@weare/reapptor-react-components";
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

    private _searchInputModel: IStringInputModel = {value: ""};
    private readonly _searchInputRef: React.RefObject<TextInput> = React.createRef();

    private async dropdownToggleAsync(): Promise<void> {
        let isOpen: boolean = !this.state.isOpen;
        
        await this.setState({isOpen});
        
        if (isOpen) {
            if (this._searchInputRef.current) {
                this._searchInputRef.current.focus();
            }
        }
  
    };

    private async closeDropdownAsync(): Promise<void> {
        await this.setState({isOpen: false});
    }

    private async onSearchButtonCLickAsync(): Promise<void> {
        if (this._searchInputModel.value.length >= 3) {
            if (this.props.onSearch) {
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
        const className: string = (this.state.isOpen)
            ? styles.dropdown_open
            : styles.searchContainer;

        return (
            <div className={this.css(styles.dropdown, this.props.className)}>
                <Icon name={"search"}
                      size={IconSize.X2}
                      className={this.props.className}
                      onClick={async () => await this.dropdownToggleAsync()}
                />
                <div className={className}>
                    <Form inline submitOnEnter
                          onSubmit={async () => await this.onSearchButtonCLickAsync()}
                    >
                        <TextInput ref={this._searchInputRef}
                                   placeholder={this.props.searchPlaceHolder}
                                   className={styles.searchInput}
                                   width={"250px"}
                                   model={this._searchInputModel}
                        />
                        <Button submit
                                label={TopNavLocalizer.searchButton}
                        />
                    </Form>

                </div>
            </div>
        );
    }

}

export default Search;