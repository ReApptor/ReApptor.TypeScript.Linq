import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {FileModel} from "@weare/athenaeum-toolkit";

import styles from "./ImageInputListItem.module.scss";

export interface IImageInputListItemProps {
    fileModel: FileModel;
    index: number;
    hasSelectedPictureIndex: boolean;
    selectedPictureIndex: number | null;
    onListViewItemClick: (index: number) => void;
    getPreviewSource: (index: number) => string;
    getPreviewName: (index: number) => string;
}

export interface IImageInputListItemState {
}

export class ImageInputListItem extends BaseComponent<IImageInputListItemProps, IImageInputListItemState> {


    render(): JSX.Element {
        const activeListViewItemStyle: string | false = (this.props.hasSelectedPictureIndex) && (this.props.selectedPictureIndex === this.props.index) && styles.activeListViewItem;

        return (
            <div key={this.props.index}
                 className={this.css(styles.listViewItem, activeListViewItemStyle)}
                 onClick={() => this.props.onListViewItemClick(this.props.index)}
            >

                <div className={styles.listViewItemThumbnail}>
                    <img
                        src={this.props.getPreviewSource(this.props.index)}
                        alt={this.props.getPreviewName(this.props.index)}
                    />
                </div>

                {
                    this.props.getPreviewName(this.props.index)
                }

            </div>
        );
    }


    static TestIds = {

    };
}
