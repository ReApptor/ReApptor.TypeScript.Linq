import React from "react";
import {ReactElement} from "react";
import {AthenaeumConstants} from "@weare/athenaeum-toolkit";

export default class ReactUtility {
    
    //#region Private
    
    private static split(regex: RegExp, tag: string, text: string, containerIndex: number): (ReactElement | string)[] {
        const items: string[] = text.split(regex);

        const tags = items
            .map((item: string, index: number) => (index % 2 != 0)
                ? [React.createElement(tag, {key: `_${containerIndex}${tag}${index}`}, item)]
                : [item]
            );

        return ((tags) && (Array.isArray(tags)))
            ? tags.flat().filter(tag => !!tag)
            : [];
    }

    private static containerToTags(text: string, containerIndex: number): (ReactElement | string)[] {
        let tags: (ReactElement | string)[] = this.containerToMarks(text, containerIndex);

        tags = this.invoke(tags, item => this.containerToSmalls(item, containerIndex));

        tags = this.invoke(tags, item => this.containerToItalics(item, containerIndex));
        
        tags = this.invoke(tags, item => this.containerToBolds(item, containerIndex));

        return tags;
    }
    
    private static containerToMarks(text: string, containerIndex: number): (ReactElement | string)[] {
        return this.split(AthenaeumConstants.markTagRegex, "mark", text, containerIndex);
    }
    
    private static containerToSmalls(text: string, containerIndex: number): (ReactElement | string)[] {
        return this.split(AthenaeumConstants.smallTagRegex, "small", text, containerIndex);
    }
    
    private static containerToBolds(text: string, containerIndex: number): (ReactElement | string)[] {
        return this.split(AthenaeumConstants.boldTagRegex, "b", text, containerIndex);
    }
    
    private static containerToItalics(text: string, containerIndex: number): (ReactElement | string)[] {
        return this.split(AthenaeumConstants.italicTagRegex, "i", text, containerIndex);
    }
    
    private static invoke(tags: (ReactElement | string)[], action: (item: string) => (ReactElement | string)[]): (ReactElement | string)[] {

        const items: ((ReactElement | string) | (ReactElement | string)[])[] = tags.map(item => {
                return (typeof item === "string")
                    ? action(item)
                    : Array.isArray(item)
                        ? this.invoke(item, action)
                        : item;
            }
        );

        return items.flat();
    }

    //#endregion

    public static toMarks(text: string | null | undefined): (ReactElement | string)[] {
        // check
        if (!text) {
            return [];
        }
        // noinspection SuspiciousTypeOfGuard
        if (typeof text !== "string") {
            return [];
        }

        return this.containerToMarks(text, 0);
    }

    public static toSmalls(text: string | null | undefined): (ReactElement | string)[] {
        // check
        if (!text) {
            return [];
        }
        // noinspection SuspiciousTypeOfGuard
        if (typeof text !== "string") {
            return [];
        }

        return this.containerToSmalls(text, 0);
    }
    
    public static toBolds(text: string | null | undefined): (ReactElement | string)[] {
        // check
        if (!text) {
            return [];
        }
        // noinspection SuspiciousTypeOfGuard
        if (typeof text !== "string") {
            return [];
        }

        return this.containerToBolds(text, 0);
    }
    
    public static toItalics(text: string | null | undefined): (ReactElement | string)[] {
        // check
        if (!text) {
            return [];
        }
        // noinspection SuspiciousTypeOfGuard
        if (typeof text !== "string") {
            return [];
        }

        return this.containerToItalics(text, 0);
    }

    public static toSingleLine(text: string | null | undefined): string {
        // check
        if (!text) {
            return "";
        }
        // noinspection SuspiciousTypeOfGuard
        if (typeof text !== "string") {
            return "";
        }

        return text.replace(AthenaeumConstants.newLineRegex, " ");
    }

    public static toMultiLines(text: string | null | undefined): (ReactElement | string)[] {
        // check
        if (!text) {
            return [];
        }
        // noinspection SuspiciousTypeOfGuard
        if (typeof text !== "string") {
            return [];
        }

        const lines: string[] = text.split(AthenaeumConstants.newLineRegex);

        return lines
            .map((line: string, index: number) => (index < lines.length - 1)
                ? [...this.containerToTags(line, index), React.createElement("br", {key: "br" + index})]
                : [...this.containerToTags(line, index)]
            )
            .flat();
    }

    public static toTags(text: string | null | undefined, toSingleLine: boolean = true): (ReactElement | string)[] {
        // check
        if (!text) {
            return [];
        }
        
        // noinspection SuspiciousTypeOfGuard
        if (typeof text !== "string") {
            return [];
        }
        
        if (toSingleLine) {
            text = this.toSingleLine(text);
        }

        return this.containerToTags(text, 0);
    }
}