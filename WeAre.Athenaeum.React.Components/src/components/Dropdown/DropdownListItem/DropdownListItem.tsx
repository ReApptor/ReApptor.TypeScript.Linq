import React from "react";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseComponent} from "@weare/athenaeum-react-common";
import Icon, {IconSize} from "../../Icon/Icon";
import {SelectListItem, StatusListItem} from "../SelectListItem";
import {AmountListItem} from "../Dropdown";

import styles from "../Dropdown.module.scss";
import DropdownLocalizer from "@weare/athenaeum-react-components/components/Dropdown/DropdownLocalizer";

export interface IDropdownListItemProps {
    item: SelectListItem;
    subtextHidden: boolean;
    noWrap?: boolean;
    onChangeAmount(sender: DropdownListItem, item: AmountListItem): Promise<void>;
}

export interface IDropdownListItemState {
}

export default class DropdownListItem extends BaseComponent<IDropdownListItemProps, IDropdownListItemState> {
    
    state: IDropdownListItemState = {
    };
    
    private canDecrease(item: AmountListItem): boolean {
        return (item.amount >= item.step);
    }

    private lastBeforeZero(item: AmountListItem): boolean {
        return (item.amount === item.step);
    }

    private async decreaseAsync(e: React.MouseEvent, item: AmountListItem): Promise<void> {
        e.stopPropagation();
        item.amount = Utility.roundE(item.amount - item.step);
        await this.props.onChangeAmount(this, item);
        await this.reRenderAsync();
    }

    private canIncrease(item: AmountListItem): boolean {
        return item.amount <= 1000 - item.step;
    }

    private async increaseAsync(e: React.MouseEvent, item: AmountListItem): Promise<void> {
        e.stopPropagation();
        item.amount = Utility.roundE(item.amount + item.step);
        await this.props.onChangeAmount(this, item);
        await this.reRenderAsync();
    }

    private renderAmountListItem(item: AmountListItem): React.ReactNode {
        const noWrapCss: any = this.props.noWrap && styles.noWrap;
        const icon: string = this.lastBeforeZero(item) ? "far times-circle" : "far minus-circle";

        return (
            <React.Fragment>

                <div className={this.css(styles.minus, !this.canDecrease(item) && styles.amountDisabled)} onClick={async (e) => await this.decreaseAsync(e, item)}>
                    <Icon name={icon}/>
                </div>

                <div className={this.css(styles.amountTitle, noWrapCss)}>
                    <span>{DropdownLocalizer.get(item.text)}</span>
                    {
                        (!this.props.subtextHidden) &&
                        (
                            <small className={styles.amountUnit}>{DropdownLocalizer.get(item.subtext)}</small>
                        )
                    }
                </div>

                <div className={styles.amount}>
                    <span>{item.amountValue}</span>
                </div>

                <div className={this.css(styles.plus, !this.canIncrease(item) && styles.amountDisabled)} onClick={async (e) => await this.increaseAsync(e, item)}>
                    <Icon name="far plus-circle"/>
                </div>

            </React.Fragment>
        )
    }

    private renderStatusListItem(item: StatusListItem): React.ReactNode {
        const noWrapCss: any = this.props.noWrap && styles.noWrap;
        const lineThroughCss: any = item.lineThrough && styles.lineThrough;

        return (
            <React.Fragment>

                <div className={this.css(noWrapCss, lineThroughCss)}>
                    <span>{DropdownLocalizer.get(item.text)}</span>
                    {
                        (!this.props.subtextHidden) &&
                        (
                            <small>{DropdownLocalizer.get(item.subtext)}</small>
                        )
                    }
                </div>

                {
                    (!item.completed) &&
                    (
                        <div className={this.css(styles.notCompleted)}>
                            <Icon name="fal exclamation-square" size={IconSize.Normal} />
                        </div>
                    )
                }

            </React.Fragment>
        )
    }

    private renderListItem(item: SelectListItem): React.ReactNode {
        const noWrapCss: any = this.props.noWrap && styles.noWrap;

        return (
            <React.Fragment>

                <div className={this.css(noWrapCss)}>
                    <span>{DropdownLocalizer.get(item.text)}</span>
                    {
                        (!this.props.subtextHidden) && 
                        (
                            <small>{DropdownLocalizer.get(item.subtext)}</small>
                        )
                    }
                </div>

            </React.Fragment>
        )
    }

    public render(): React.ReactNode {

        const item: SelectListItem = this.props.item;

        const isAmount: boolean = ((item as any).isAmountListItem);
        const isStatus: boolean = ((item as any).isStatusListItem);

        return (
            <React.Fragment>
                {
                    (isAmount)
                        ? this.renderAmountListItem(item as AmountListItem)
                        : (isStatus)
                            ? this.renderStatusListItem(item as StatusListItem)
                            : this.renderListItem(item)
                }
            </React.Fragment>
        );
    }
}
