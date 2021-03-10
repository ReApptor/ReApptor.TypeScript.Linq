import React, {Attributes, ComponentClass, FunctionComponent, ReactChildren, ReactNode} from "react";
import {ReactElement} from "react";
import {AthenaeumConstants} from "@weare/athenaeum-toolkit";

export default class ReactUtility {
    
    private static toTags(regex: RegExp, tag: string, text: string, containerIndex: number): (ReactElement | string)[] {
        if (!text) {
            return [];
        }

        const items: string[] = text.split(regex);

        return items
            .map((item: string, index: number) => (index % 2 != 0)
                ? [this.createElement(tag, {key: `${containerIndex}${tag}${index}`}, item)]
                : [item]
            )
            .flat();
    }
    
    private static containerToMarks(text: string, containerIndex: number): (ReactElement | string)[] {
        return this.toTags(AthenaeumConstants.markTagRegex, "mark", text, containerIndex);
    }
    
    private static containerToSmalls(text: string, containerIndex: number): (ReactElement | string)[] {
        return this.toTags(AthenaeumConstants.smallTagRegex, "small", text, containerIndex);
    }

    public static toMarks(text: string): (ReactElement | string)[] {
        return this.containerToMarks(text, 0);
    }

    public static toSmalls(text: string): (ReactElement | string)[] {
        return this.containerToSmalls(text, 0);
    }

    public static toSingleLine(text: string | null | undefined): string {
        if (text) {
            text = text.replace(AthenaeumConstants.newLineRegex, " ");
        }
        return text || "";
    }

    public static toMultiLines(text: string | null | undefined): (ReactElement | string)[] {
        if (!text) {
            return [];
        }

        const lines: string[] = text.split(AthenaeumConstants.newLineRegex);

        return lines
            .map((line: string, index: number) => (index < lines.length - 1)
                ? [...this.containerToMarks(line, index), this.createElement("br", {key: "br" + index})]
                : [...this.containerToMarks(line, index)]
            )
            .flat();
    }
    
    public static createElement<P extends {}>(type: FunctionComponent<P> | ComponentClass<P> | string, props?: Attributes & P | null, ...children: ReactNode[]): ReactElement<P> {
        console.log("createElement: props=", props);
        const createElement = ((window as any).reactCreateElement) || ((window as any).reactCreateElement = React.createElement);
        return createElement(type, props, ...children);
    }
    
    public static cloneElement<P>(element: ReactElement<P>, props?: Partial<P> & Attributes, ...children: ReactNode[]): ReactElement<P> {
        console.log("cloneElement: element=", element, "props=", props);
        const cloneElement = ((window as any).reactCloneElement) || ((window as any).reactCloneElement = React.cloneElement);
        return cloneElement(element, props, ...children);
    }

    public static get reactChildren(): ReactChildren {
        console.log("reactChildren()");
        return ((window as any).reactChildren || ((window as any).reactChildren = React.Children));
    }
}