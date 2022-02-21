import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {WidgetContainer, IconSize, TextAreaWidget} from "@weare/athenaeum-react-components";

export default class TextAreaWidgetTests extends BaseComponent {

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <h4 className="pt-2 pb-2 ">TextAreaWidget</h4>

                <WidgetContainer className="flex-column flex-grow-1">

                    <TextAreaWidget wide
                                    label={"Wide"}
                    />

                    <TextAreaWidget wide
                                    label={"Wide (maxlength 10)"}
                                    maxLength={10}
                    />
                    <TextAreaWidget wide
                                    rows={5}
                                    label={"Wide, rows 5"}
                                    value={"aaa\nbbb\nccc\nddd\neee"}
                                    text={"aaa aaa bbb ccc ddd"}
                    />
                    <TextAreaWidget label={"Not wide"}

                    />

                    <TextAreaWidget minimized
                                    label={"Minimized - Not wide"}
                    />
                    
                </WidgetContainer>

            </React.Fragment>
        );
    }
}