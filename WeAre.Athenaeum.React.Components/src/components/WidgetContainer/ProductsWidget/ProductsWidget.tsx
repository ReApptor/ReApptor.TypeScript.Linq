import React from "react";
import BaseExpandableWidget, { IBaseExpandableWidgetProps } from "../BaseExpandableWidget";
import Product from "../../../models/server/Product";

import styles from "../WidgetContainer.module.scss";

export interface IProductsWidgetProps extends IBaseExpandableWidgetProps {
    products: Product[]
}

export default class ProductsWidget extends BaseExpandableWidget<IProductsWidgetProps> {
    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();
        this.setState({icon: { name: "far rocket" }});
    }

    public async componentWillReceiveProps(nextProps: Readonly<IProductsWidgetProps>): Promise<void> {
        await super.componentWillReceiveProps(nextProps);
        this.setState({icon: { name: "far rocket" }});
    }
    
    protected renderExpanded(): React.ReactNode {
        return (
            <div className={styles.products}>
                {this.props.products.map((product, index) => <div className={styles.category} />)}
            </div>
        );
    }
}