import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {FileModel} from "@weare/athenaeum-toolkit";

import styles from "./ImageInputListItem.module.scss";

export interface IImageInputListItemProps {
    fileModel: FileModel;
    selected: boolean;
    previewSource: string;
    previewName: string;
    onListViewItemClick: () => void;
}

export interface IImageInputListItemState {
}

export class ImageInputListItem extends BaseComponent<IImageInputListItemProps, IImageInputListItemState> {


    render(): JSX.Element {
        const activeListViewItemStyle: string | false = (this.props.selected) && styles.activeListViewItem;

        return (
            <div className={this.css(styles.listViewItem, activeListViewItemStyle)}
                 onClick={() => this.props.onListViewItemClick()}
            >

                <div className={styles.listViewItemThumbnail}>
                    <img
                        src={this.props.previewSource}
                        alt={this.props.previewName}
                    />
                </div>

                {
                    this.props.previewName
                }

            </div>
        );
    }


    static TestIds = {

    };
}
