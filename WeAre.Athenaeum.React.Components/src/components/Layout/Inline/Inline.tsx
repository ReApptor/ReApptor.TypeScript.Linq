import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";

export enum JustifyContent {
    Start,
    
    Center,
    
    End,
    
    SpaceBetween
}


interface IInlineProps {
    justify?: JustifyContent;
    className?: string;
}

export default class Inline extends BaseComponent<IInlineProps> {

    private getPaddingStyle(index: number, length: number): string {
        return (length > 0)
            ? (length === 1)
                ? "p-1-except-left p-1-except-right"
                : (index === 0)
                    ? "p-1-except-left"
                    : (index === this.children.length - 1)
                        ? "p-1-except-right"
                        : "p-1"
            : "";
    }

    private renderItem(item: React.ReactNode, index: number, length: number): React.ReactNode {

        const paddingStyle: string = this.getPaddingStyle(index, length);

        return (
            <div key={index} className={this.css(paddingStyle)}>
                {item}
            </div>
        )
    }
    
    private get justify(): JustifyContent {
        return this.props.justify || JustifyContent.Start;
    }
    
    private get justifyContentStyles(): string {
        switch(this.justify) {
            case JustifyContent.Center:
                return "justify-content-center";
            case JustifyContent.End:
                return "justify-content-end";
            case JustifyContent.SpaceBetween:
                return "justify-content-between";
            default:
                return "justify-content-start";
        }
    }

    render(): React.ReactNode {
        return (
            <div className={this.css("d-flex flex-row align-items-center", this.justifyContentStyles, this.props.className)}>
                {
                    ((this.props.children) && (this.children.length > 0)) &&
                    (this.children.map((item, index) => this.renderItem(item, index, this.children.length)))
                }
            </div>
        )
    }
}