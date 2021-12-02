import React from "react";

import {BaseComponent} from "@weare/athenaeum-react-common";

import Button, {ButtonType} from "../../Button/Button";
import ImageInputLocalizer from "../ImageInputLocalizer";
import styles from "./ImageInputToolbar.module.scss";


export interface IIMageInputToolbar {

    /** Should an "Upload file"-button be shown. */
    uploadButton?: boolean;

    /** Should a "Take a picture"-button be shown. */
    takePictureButton?: boolean;

    /** Should a "Remove"-button be shown. */
    deleteButton?: boolean;

    /** Should a "Preview"-button be shown. */
    previewButton?: boolean;

    /** Should an "Edit"-button be shown. */
    editButton?: boolean;

    /** Should an "Save"-button be shown. */
    saveButton?: boolean;

    /** Should an "Back"-button be shown. */
    backButton?: boolean;

    /** Should a "Rotate left and right"-buttons be shown. */
    rotateButton?: boolean;

    /** Should a "Rotate left and right"-mini buttons be shown. */
    rotateMiniButton?: boolean;

    /** Should a "Move up"-button be shown. */
    moveUpButton?: boolean;

    /** Should a "Move down"-button be shown. */
    moveDownButton?: boolean;

    /** Should a "Move to top"-button be shown. */
    moveToTopButton?: boolean;
}


export interface IImageInputToolbarOverwriteProps {
    /**
     * Displayed when {@link pictures} is empty or when no image is selected.
     */
    noSelectionToolbar?: Partial<IIMageInputToolbar>;

    /**
     * Displayed when an image has been selected.
     * @default {@link IIMageInputToolbar.rotateLeftButton} {@link IIMageInputToolbar.rotateRightButton} {@link IIMageInputToolbar.editButton} {@link IIMageInputToolbar.previewButton} {@link IIMageInputToolbar.uploadButton} {@link IIMageInputToolbar.takePictureButton} {@link IIMageInputToolbar.deleteButton}
     */
    selectionToolbar?: Partial<IIMageInputToolbar>;

    /** Displayed when an image is being previewed in full-screen. */
    previewToolbar?: Partial<IIMageInputToolbar>;

    /** Displayed when an image is being edited. */
    editToolbar?: Partial<IIMageInputToolbar>;
}

export interface IImageInputToolbarProps{
    toolbar: IIMageInputToolbar;
    className?: string;
    onRotateMiniButtonClickAsync?: (rotation: number) => Promise<void>;
    onRotateButtonClickAsync?: (rotation: number) => Promise<void>;
    onMoveToTopButtonClickAsync?: () => Promise<void>;
    onMoveUpButtonClickAsync?: () => Promise<void>;
    onMoveDownButtonClickAsync?: () => Promise<void>;
    onEditButtonClickAsync?: () => Promise<void>;
    onPreviewButtonClickAsync?: () => Promise<void>;
    onBrowseForFileClick?: (captureMode: boolean) => Promise<void>;
    onSaveButtonClickAsync?: () => Promise<void>;
    onBackButtonClickAsync?: () => Promise<void>;
    onDeleteButtonClickAsync?: () => Promise<void>;
}

export interface IImageInputToolbarState {
}

export class ImageInputToolbar extends BaseComponent<IImageInputToolbarProps, IImageInputToolbarState> {
    state: IImageInputToolbarState = {
    };

    private get toolbar(): IIMageInputToolbar {
        return this.props.toolbar;
    }


    public render(): JSX.Element {
        return (
            <div className={this.css(styles.controlPanel, this.props.className)}>

                {
                    (this.toolbar.rotateMiniButton) &&
                    (
                        <div className={styles.controlPanelMiniButtonWrap}>

                            <Button small
                                    icon={{name: "undo"}}
                                    type={ButtonType.Info}
                                    onClick={async () => {
                                        if (this.props.onRotateMiniButtonClickAsync) {
                                            await this.props.onRotateMiniButtonClickAsync(-90);
                                        }
                                    }}
                            />
                            <Button small
                                    icon={{name: "redo"}}
                                    type={ButtonType.Info}
                                    onClick={async () => {
                                        if (this.props.onRotateMiniButtonClickAsync) {
                                            await this.props.onRotateMiniButtonClickAsync(90);
                                        }
                                    }}
                            />

                        </div>
                    )
                }

                {
                    (this.toolbar.rotateButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "undo"}}
                                type={ButtonType.Light}
                                label={ImageInputLocalizer.rotateLeft}
                                onClick={async () => {
                                    if (this.props.onRotateButtonClickAsync) {
                                        await this.props.onRotateButtonClickAsync(-90);
                                    }
                                }}
                        />
                    )
                }
                {
                    (this.toolbar.rotateButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "redo"}}
                                type={ButtonType.Light}
                                label={ImageInputLocalizer.rotateRight}
                                onClick={async () => {
                                    if (this.props.onRotateButtonClickAsync) {
                                        await this.props.onRotateButtonClickAsync(90);
                                    }
                                }}
                        />
                    )
                }

                {
                    (this.toolbar.moveToTopButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "level-up"}}
                                type={ButtonType.Info}
                                label={ImageInputLocalizer.moveToTop}
                                onClick={async () => {
                                    if (this.props.onMoveToTopButtonClickAsync) {
                                        await this.props.onMoveToTopButtonClickAsync();
                                    }
                                }}
                        />
                    )
                }

                {
                    (this.toolbar.moveUpButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "arrow-up"}}
                                type={ButtonType.Info}
                                label={ImageInputLocalizer.moveUp}
                                onClick={async () => {
                                    if (this.props.onMoveUpButtonClickAsync) {
                                        await this.props.onMoveUpButtonClickAsync();
                                    }
                                }}
                        />
                    )
                }

                {
                    (this.toolbar.moveDownButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "arrow-down"}}
                                type={ButtonType.Info}
                                label={ImageInputLocalizer.moveDown}
                                onClick={async () => {
                                    if (this.props.onMoveDownButtonClickAsync) {
                                        await this.props.onMoveDownButtonClickAsync();
                                    }
                                }}
                        />
                    )
                }

                {
                    (this.toolbar.editButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "crop"}}
                                type={ButtonType.Info}
                                label={ImageInputLocalizer.edit}
                                onClick={async () => {
                                    if (this.props.onEditButtonClickAsync) {
                                        await this.props.onEditButtonClickAsync();
                                    }
                                }}
                        />
                    )
                }

                {
                    (this.toolbar.previewButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "eye"}}
                                type={ButtonType.Info}
                                label={ImageInputLocalizer.preview}
                                onClick={async () => {
                                    if (this.props.onPreviewButtonClickAsync) {
                                        await this.props.onPreviewButtonClickAsync();
                                    }
                                }}
                        />
                    )
                }

                {
                    (this.toolbar.uploadButton) &&
                    (
                        <Button small right
                                className={styles.controlPanelButton}
                                icon={{name: "file-import"}}
                                type={ButtonType.Orange}
                                label={ImageInputLocalizer.browse}
                                onClick={async () => {
                                    if (this.props.onBrowseForFileClick) {
                                        await this.props.onBrowseForFileClick(false);
                                    }
                                }}
                        />
                    )

                }

                {
                    (this.toolbar.takePictureButton) &&
                    (
                        <Button small right
                                className={styles.controlPanelButton}
                                icon={{name: "camera"}}
                                type={ButtonType.Orange}
                                label={ImageInputLocalizer.camera}
                                onClick={async () => {
                                    if (this.props.onBrowseForFileClick) {
                                        await this.props.onBrowseForFileClick(true);
                                    }
                                }}
                        />
                    )

                }

                {
                    (this.toolbar.saveButton) &&
                    (
                        <Button small right
                                className={styles.controlPanelButton}
                                icon={{name: "save"}}
                                type={ButtonType.Success}
                                label={ImageInputLocalizer.save}
                                onClick={async () => {
                                    if (this.props.onSaveButtonClickAsync) {
                                        await this.props.onSaveButtonClickAsync();
                                    }
                                }}
                        />
                    )
                }

                {
                    (this.toolbar.backButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "arrow-left"}}
                                type={ButtonType.Info}
                                label={ImageInputLocalizer.back}
                                onClick={async () => {
                                    if (this.props.onBackButtonClickAsync) {
                                        await this.props.onBackButtonClickAsync();
                                    }
                                }}
                        />
                    )
                }

                {
                    (this.toolbar.deleteButton) &&
                    (
                        <Button small
                                className={styles.controlPanelButton}
                                icon={{name: "trash"}}
                                type={ButtonType.Warning}
                                label={ImageInputLocalizer.delete}
                                onClick={async () => {
                                    if (this.props.onDeleteButtonClickAsync) {
                                        await this.props.onDeleteButtonClickAsync();
                                    }
                                }}
                        />
                    )
                }
            </div>


        );
    }

    private static get defaultToolbar(): IIMageInputToolbar {
        return {
            takePictureButton: false,
            uploadButton: false,
            deleteButton: false,
            editButton: false,
            moveDownButton: false,
            moveToTopButton: false,
            moveUpButton: false,
            rotateButton: false,
            previewButton: false,
            rotateMiniButton: false
        };
    }

    /**
     * Following functionality is enabled:
     * {@link IIMageInputToolbar.takePictureButton}
     * {@link IIMageInputToolbar.uploadButton}
     */
    public static get defaultNoSelectionToolbar(): IIMageInputToolbar {
        return {
            ...ImageInputToolbar.defaultToolbar,
            takePictureButton: true,
            uploadButton: true,
        };
    }

    /**
     * Following functionality is enabled:
     * {@link IIMageInputToolbar.deleteButton}
     * {@link IIMageInputToolbar.editButton}
     * {@link IIMageInputToolbar.previewButton}
     * {@link IIMageInputToolbar.rotateMiniButton}
     * {@link IIMageInputToolbar.takePictureButton}
     * {@link IIMageInputToolbar.uploadButton}
     */
    public static get defaultSelectionToolbar(): IIMageInputToolbar {
        return {
            ...ImageInputToolbar.defaultToolbar,
            deleteButton: true,
            editButton: true,
            previewButton: true,
            rotateMiniButton: true,
            takePictureButton: true,
            uploadButton: true
        }
    }

    /**
     * Following functionality is enabled:
     * {@link IIMageInputToolbar.deleteButton}.
     * {@link IIMageInputToolbar.editButton}
     * {@link IIMageInputToolbar.uploadButton}
     * {@link IIMageInputToolbar.takePictureButton}
     * {@link IIMageInputToolbar.backButton}
     *
     * A "Back"-button which returns the user back to the previous view is also displayed.
     */
    public static get defaultPreviewToolbar(): IIMageInputToolbar {
        return {
            ...ImageInputToolbar.defaultToolbar,
            deleteButton: true,
            editButton: true,
            backButton: true
        };
    }

    /**
     * Following functionality is enabled:
     * {@link IIMageInputToolbar.rotateButton}
     * {@link IIMageInputToolbar.deleteButton}.
     * {@link IIMageInputToolbar.saveButton}.
     * {@link IIMageInputToolbar.backButton}.
     *
     * A "Save"-button which saves the changes and a "Back"-button which returns the user back to the previous view are also displayed.
     */
    public static get defaultEditToolbar(): IIMageInputToolbar {
        return {
            ...ImageInputToolbar.defaultToolbar,
            rotateButton: true,
            deleteButton: true,
            saveButton: true,
            backButton: true
        };
    }

    static TestIds = {
        component: "ImageInputToolbar-TestId",
    };
}