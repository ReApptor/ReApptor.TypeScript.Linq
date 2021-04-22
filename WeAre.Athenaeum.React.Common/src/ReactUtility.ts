import React from "react";
import {ReactElement} from "react";
import {AthenaeumConstants} from "@weare/athenaeum-toolkit";

export default class ReactUtility {
    
    private static toTags(regex: RegExp, tag: string, text: string, containerIndex: number): (ReactElement | string)[] {
        if ((!text) || (!tag)) {
            return [];
        }
        
        // noinspection SuspiciousTypeOfGuard
        if (typeof text !== "string") {
            return [];
        }

        const items: string[] = text.split(regex);

        const tags = items
            .map((item: string, index: number) => (index % 2 != 0)
                ? [React.createElement(tag, {key: `${containerIndex}${tag}${index}`}, item)]
                : [item]
            );

        return ((tags) && (Array.isArray(tags)))
            ? tags.flat().filter(tag => !!tag)
            : [];
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
                ? [...this.containerToMarks(line, index), React.createElement("br", {key: "br" + index})]
                : [...this.containerToMarks(line, index)]
            )
            .flat();
    }
}