import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import { GridModel } from "../GridModel";

import gridStyles from "../Grid.module.scss";

interface ICheckHeaderCellProps<TItem = {}> {
    model: GridModel<TItem>;
}

export default class CheckHeaderCell<TItem = {}> extends BaseComponent<ICheckHeaderCellProps<TItem>> {
    
    public get model(): GridModel<TItem> {
        return this.props.model;
    }

    private async onCheckAsync(): Promise<void> {
        const model: GridModel<TItem> = this.model;

        const newChecked: boolean = (model.checked === false);

        model.rows.forEach(row => {
            if (row.checkable) {
                row.checked = newChecked
            }
        });

        model.checked = newChecked;

        await model.reRenderAsync();
        
        if (model.onCheck) {
            await model.onCheck(model);
        }
    }

    render(): React.ReactNode {

        const model: GridModel<TItem> = this.model;
        
        model.checkHeaderInstance = this;
        
        const checked: boolean = (model.checked !== false);
        const partiallyStyle: any = (model.checked === undefined) && gridStyles.partially;

        return (
            <th rowSpan={2} className={this.css(gridStyles.check, partiallyStyle)} onClick={async () => this.onCheckAsync()}>
                <input type="checkbox" checked={checked} onChange={() => {}} />
            </th>
        )
    }
}