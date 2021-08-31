import React from "react";
import {BaseComponent, IBaseClassNames} from "@weare/athenaeum-react-common";

import "./BootstrapOverride.scss";
import styles from "./Pagination.module.scss";
import Dropdown, { DropdownOrderBy } from "../Dropdown/Dropdown";

export interface IPaginationClassNames {
    readonly pagination?: string;
    readonly buttonActive?: string;
    readonly buttonDisabled?: string;
    readonly pageItem?: string;
    readonly pageLink?: string;
    readonly pageDropdownWrap?: string;
    readonly total?: string;
}

class PaginationButton {

    public pageNumber: number = 0;

    public current: boolean = false;

    public visible: boolean = false;

    public disabled: boolean = false;

    public label: string = "";
}

interface IPaginationProps {
    className?: string;
    classNames?: IPaginationClassNames;
    pageSize: number;
    itemCount: number;
    totalItemCount: number;
    pageNumber: number;
    dataPerPageVariants?: number[];
    onChange?(sender: Pagination, pageNumber: number, pageSize: number): Promise<void>;
}

interface IPaginationState {
    pageSize: number;
    pageNumber: number;
}

export default class Pagination extends BaseComponent<IPaginationProps, IPaginationState> {
    
    state: IPaginationState = {
        pageSize: this.props.pageSize,
        pageNumber: this.props.pageNumber
    };
    
    private _dataPerPageVariants: number[] | null = null;
    
    private async processAsync(): Promise<void> {
        if (this.props.onChange) {
            await this.props.onChange(this, this.pageNumber, this.pageSize);
        }
    }

    private async onChangePageNumber(event: React.MouseEvent<HTMLAnchorElement>, button: PaginationButton): Promise<void> {
        event.preventDefault();
        if (!button.disabled) {
            const pageNumber: number = button.pageNumber;
            if (this.pageNumber != pageNumber) {
                await this.setState({pageNumber});
                await this.processAsync();
            }
        }
    }
    
    private async onChangePageSizeAsync(pageSize: number, userInteraction: boolean): Promise<void> {
        if ((userInteraction) && (this.pageSize != pageSize)) {

            const currentFirstRowIndex: number = (this.pageNumber - 1) * this.pageSize;
            const pageNumber: number = (Math.trunc(currentFirstRowIndex / pageSize)) + 1;
                
            await this.setState({ pageSize, pageNumber });
            await this.processAsync();
        }
    }

    private get paginationButtons(): PaginationButton[] {

        const firstPageNumber: number = 1;
        const currentPageNumber: number = this.pageNumber;
        const totalItemCount: number = this.totalItemCount;
        const pageSize: number = this.pageSize;

        const prevPrevPageNumber = currentPageNumber - 2;
        const prevPageNumber = currentPageNumber - 1;
        const nextPageNumber = currentPageNumber + 1;
        const nextNextPageNumber = currentPageNumber + 2;
        const lastPageNumber = (totalItemCount > 0)
            ? Math.ceil(totalItemCount / pageSize)
            : 1;

        const pages: PaginationButton[] = [
            {pageNumber: prevPageNumber, current: false, visible: true, disabled: (prevPageNumber < firstPageNumber), label: "‹"},
            {pageNumber: firstPageNumber, current: false, visible: (firstPageNumber < prevPrevPageNumber), disabled: (firstPageNumber === currentPageNumber), label: firstPageNumber.toString()},
            {pageNumber: prevPrevPageNumber, current: false, visible: (prevPageNumber - firstPageNumber > 2), disabled: true, label: "..."},
            {pageNumber: prevPrevPageNumber, current: false, visible: (prevPrevPageNumber >= firstPageNumber), disabled: false, label: prevPrevPageNumber.toString()},
            {pageNumber: prevPageNumber, current: false, visible: (prevPageNumber >= firstPageNumber), disabled: false, label: prevPageNumber.toString()},
            {pageNumber: currentPageNumber, current: true, visible: true, disabled: true, label: currentPageNumber.toString()},
            {pageNumber: nextPageNumber, current: false, visible: (nextPageNumber <= lastPageNumber), disabled: false, label: nextPageNumber.toString()},
            {pageNumber: nextNextPageNumber, current: false, visible: (nextNextPageNumber <= lastPageNumber), disabled: false, label: nextNextPageNumber.toString()},
            {pageNumber: nextNextPageNumber, current: false, visible: (lastPageNumber - nextPageNumber > 2), disabled: true, label: "..."},
            {pageNumber: lastPageNumber, current: false, visible: (lastPageNumber > nextNextPageNumber), disabled: (lastPageNumber === currentPageNumber), label: lastPageNumber.toString()},
            {pageNumber: nextPageNumber, current: false, visible: true, disabled: (nextPageNumber > lastPageNumber), label: "›"}
        ];

        return pages;
    }

    public get dataPerPageVariants(): number[] {
        if (this._dataPerPageVariants == null) {
            const variants: number[] = this.props.dataPerPageVariants || [10, 25, 50, 100];
            if (!variants.includes(this.pageSize)) {
                variants.push(this.pageSize);
                variants.sort((x, y) => x - y);
            }
            this._dataPerPageVariants = variants;
        }
        return this._dataPerPageVariants;
    }

    private get classNames(): IPaginationClassNames {
        const classNamesCopy: IBaseClassNames = {...this.props.classNames};

        Object.keys(styles).forEach((key: string) => !classNamesCopy[key] ? classNamesCopy[key] = styles[key] : classNamesCopy[key]);

        return classNamesCopy;
    }

    public get pageNumber(): number {
        return this.state.pageNumber;
    }

    public get pageSize(): number {
        return this.state.pageSize;
    }

    public get itemCount(): number {
        return this.props.itemCount;
    }

    public get totalItemCount(): number {
        return this.props.totalItemCount;
    }

    private renderPaginationButton(button: PaginationButton, index: number): React.ReactNode {

        const activeStyle: any = (button.current) && this.css("active", this.classNames.buttonActive);
        const disabledStyle: any = (button.disabled) && this.css("disabled", this.classNames.buttonDisabled);

        return (
            (button.visible) &&
            (
                <li key={index} className={this.css("page-item", this.classNames.pageItem, activeStyle, disabledStyle)}>
                    <a href="#" className={this.css("page-link shadow-none", this.classNames.pageLink)} onClick={async (e) => await this.onChangePageNumber(e, button)}>
                        {button.label}
                    </a>
                </li>
            )
        )
    }

    public async componentWillReceiveProps(nextProps: IPaginationProps): Promise<void> {
        await super.componentWillReceiveProps(nextProps);
        
        const newProps: boolean = (nextProps.pageNumber != this.pageNumber) ||
                                  (nextProps.pageSize != this.pageSize);
        
        if (newProps) {
            await this.setState({ pageNumber: nextProps.pageNumber, pageSize: nextProps.pageSize }); 
        }
    }

    public render(): React.ReactNode {
        
        return (
            <nav className={this.css(styles.pagination, "d-flex align-items-center", this.props.className)}>
                
                <ul className={this.css("pagination mb-0", this.classNames.pagination)}>
                    {
                        this.paginationButtons.map((button, index) => (this.renderPaginationButton(button, index)))
                    }
                </ul>
                
                <div className={this.css(styles.pageDropdownWrap, "ml-3 d-flex align-items-center justify-content-between", this.classNames.pageDropdownWrap)}>

                    <Dropdown inline small required noFilter
                              items={this.dataPerPageVariants}
                              selectedItem={this.props.pageSize}
                              orderBy={DropdownOrderBy.None}
                              onChange={async (sender, item, userInteraction) => await this.onChangePageSizeAsync(item!, userInteraction)} 
                    />
                    
                    {
                        (this.totalItemCount > 0) &&
                        (
                            <span className={this.css(styles.total, this.classNames.total)}>
                                {this.itemCount} / {this.totalItemCount}
                            </span>
                        )
                    }
           
                </div>
                
            </nav>
        )
    }
}