import React from "react";
import {ActionType, ch, DescriptionModel, IConfirmation, BaseComponent} from "@weare/reapptor-react-common";
import {CellAction, CellModel, ColumnAction, DescriptionCellAction, GridConfirmationDialogTitleCallback, ICellAction} from "../../GridModel";
import Icon, {IIconProps} from "../../../Icon/Icon";
import Button from "../../../Button/Button";

import gridStyles from "../../Grid.module.scss";

interface ICellActionComponentProps<TItem = {}> {
    cell: CellModel<TItem>;
    cellAction: CellAction<TItem>;
}

interface ICellActionComponentState<TItem> {
}

export default class CellActionComponent<TItem = {}> extends BaseComponent<ICellActionComponentProps<TItem>, ICellActionComponentState<TItem>> implements ICellAction {

    state: ICellActionComponentState<TItem> = {};

    private async invokeActionCallbackAsync(cell: CellModel<TItem>, action: CellAction<TItem>, selectedAction?: string): Promise<void> {
        if (this.descriptionCellAction) {
            await this.toggleDescriptionAsync(cell, action as DescriptionCellAction<TItem>);
        } else if (action.action.callback) {
            await action.action.callback(cell, action, selectedAction);
        }
    }

    private getActionColor(actionType: ActionType | null): string {
        switch (actionType) {
            case ActionType.Default:
                return "text-dark";

            case ActionType.Create:
                return "text-success";

            case ActionType.Edit:
                return "text-warning";

            case ActionType.Delete:
                return "text-danger";

            case ActionType.Muted:
                return "text-muted";

            case ActionType.Secondary:
                return "text-secondary";

            case ActionType.Light:
                return "text-light";

            case ActionType.Grey:
                return "grey";

            case ActionType.Info:
                return "text-info";

            case ActionType.Blue:
                return "text-primary";

            default:
                return "text-primary";
        }
    }

    private async toggleDescriptionAsync(cell: CellModel<TItem>, action: DescriptionCellAction<TItem>): Promise<void> {
        const model = new DescriptionModel();
        model.description = cell.description;
        model.align = action.alight;
        model.justify = action.justify;
        model.maxLength = action.maxLength;
        model.readonly = cell.descriptionReadonly;
        model.onChange = async (value) => this.updateDescriptionAsync(cell, action, value);
        await ch.descriptionAsync(cell.instance.id, model);
    }

    private async updateDescriptionAsync(cell: CellModel<TItem>, action: CellAction<TItem>, value: string): Promise<void> {
        const hadDescription: boolean = (!!cell.description);

        cell.description = value;

        if (action.action.callback) {
            await action.action.callback(cell, action);
        }

        if (hadDescription && !cell.description) {
            await cell.reRenderAsync();
        }
    }

    public get cell(): CellModel<TItem> {
        return this.props.cell;
    }

    public get cellAction(): CellAction<TItem> {
        return this.props.cellAction;
    }

    public get descriptionCellAction(): DescriptionCellAction<TItem> | null {
        return this.cell.descriptionAction;
    }

    public get columnAction(): ColumnAction<TItem> {
        return this.cellAction.action;
    }

    public render(): React.ReactNode {

        const cellAction: CellAction<TItem> = this.cellAction;
        const action: ColumnAction<TItem> = this.columnAction;
        const cell: CellModel<TItem> = this.cell;

        cellAction.instance = this;

        const isDescription: boolean = (this.descriptionCellAction != null);
        const alwaysAvailable: boolean = (isDescription) || (action.alwaysAvailable);
        const visible: boolean = (cellAction.visible) && ((alwaysAvailable) || (!cell.grid.readonly));

        const actionColorClassName: string = this.getActionColor(action.type);
        const rightStyle: any = (action.right) && gridStyles.actionRight;

        const hasToggleModal: boolean = (action.toggleModal != null);
        let dataModal: string | undefined = undefined;

        if (hasToggleModal) {
            try {
                dataModal = JSON.stringify(cell.model);
            } catch {
                // Just to solve cyclic object parsing problem
            }
        }

        let confirm: string | IConfirmation | null = null;
        if (action.confirm) {
            if (typeof action.confirm === "function") {
                const routeCallback = action.confirm as GridConfirmationDialogTitleCallback<TItem>;
                confirm = routeCallback(cell, cellAction);
            } else {
                confirm = action.confirm;
            }
        }

        let icon: IIconProps | null = action.icon;

        if (isDescription) {
            icon = {
                name: (cell.descriptionIcon)
                    ? cell.descriptionIcon
                    : (cell.description)
                        ? "far comment-alt-dots"
                        : "far comment-alt"
            };
        }

        if ((!action.title) && (!icon)) {
            icon = {
                name: "fas circle"
            };
        }

        const inlineStyles: React.CSSProperties = {};

        if (action.right) {
            inlineStyles.float = "right";
        }

        return (
            <React.Fragment>
                {
                    (visible) &&
                    (
                        <React.Fragment>
                            {
                                (icon)
                                    ?
                                    (
                                        action.actions
                                            ? 
                                            (
                                                <Icon id={this.id}
                                                      {...icon!}
                                                      tooltip={action.title || undefined}
                                                      className={this.css(actionColorClassName, rightStyle)}
                                                      onClick={async () => this.invokeActionCallbackAsync(cell, cellAction)}
                                                      dataTarget={action.toggleModal || undefined}
                                                      dataModal={dataModal}
                                                      toggleModal={!!action.toggleModal}
                                                      confirm={confirm || undefined}
                                                >
                                                    {action.actions.map((value, index: number) => {
                                                        return (
                                                            <Icon.Action key={index} title={value} onClick={() => this.invokeActionCallbackAsync(cell, cellAction, value)} />
                                                        )
                                                    })}
                                                </Icon>
                                            )
                                            :
                                            (
                                                <Icon id={this.id}
                                                      {...icon!}
                                                      tooltip={action.title || undefined}
                                                      className={this.css(actionColorClassName, rightStyle)}
                                                      onClick={async () => this.invokeActionCallbackAsync(cell, cellAction)}
                                                      dataTarget={action.toggleModal || undefined}
                                                      dataModal={dataModal}
                                                      toggleModal={!!action.toggleModal}
                                                      confirm={confirm || undefined}
                                                />
                                            )


                                    )
                                    :
                                    (
                                        action.actions
                                            ?
                                            (
                                                <Button id={this.id}
                                                        label={action.title!}
                                                        className={this.css(actionColorClassName, rightStyle)}
                                                        onClick={async () => this.invokeActionCallbackAsync(cell, cellAction)}
                                                        dataTarget={action.toggleModal || undefined}
                                                        dataModal={dataModal}
                                                        toggleModal={!!action.toggleModal}
                                                        confirm={confirm || undefined}
                                                >
                                                    {action.actions.map((value, index: number) => {

                                                        return (
                                                            <Button.Action key={index} title={value} onClick={async () => this.invokeActionCallbackAsync(cell, cellAction, value)}/>
                                                        )

                                                    })}

                                                </Button>
                                            ) 
                                            : 
                                            (
                                                <Button id={this.id}
                                                        label={action.title!}
                                                        className={this.css(actionColorClassName, rightStyle)}
                                                        onClick={async () => this.invokeActionCallbackAsync(cell, cellAction)}
                                                        dataTarget={action.toggleModal || undefined}
                                                        dataModal={dataModal}
                                                        toggleModal={!!action.toggleModal}
                                                        confirm={confirm || undefined}
                                                />
                                            )

                                    )
                            }
                        </React.Fragment>
                    )
                }
            </React.Fragment>
        );
    }
}