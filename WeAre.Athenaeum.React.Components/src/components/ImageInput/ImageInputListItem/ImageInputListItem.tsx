import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {FileModel} from "@weare/athenaeum-toolkit";

import styles from "./ImageInputListItem.module.scss";

export interface IImageInputListItemProps {
    fileModel: FileModel;
    className?: string;
    multiple: boolean;
    selected: boolean;
    previewSource: string;
    previewName: string;
    onListViewItemClick: () => void;
}

export interface IImageInputListItemState {
}

export class ImageInputListItem extends BaseComponent<IImageInputListItemProps, IImageInputListItemState> {


    render(): JSX.Element {
        const activeListViewItemStyle: string | false = (this.props.selected && this.props.multiple) && styles.activeListViewItem;

        return (
            <div className={this.css(styles.listViewItem, activeListViewItemStyle, this.props.className)}
                 app-multiple={String(this.props.multiple)}
                 onClick={() => this.props.onListViewItemClick()}
            >

                <div className={styles.listViewItemThumbnail}  style={{backgroundImage: `url(${this.props.previewSource})`}}>
                </div>

                <span className={this.css(styles.listViewItemName)}>
                    {
                        this.props.previewName
                    }
                </span>

            </div>
        );
    }


    static TestIds = {

    };
}
