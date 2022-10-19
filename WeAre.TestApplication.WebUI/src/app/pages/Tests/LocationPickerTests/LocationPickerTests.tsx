import React from "react";
import {BaseComponent, DocumentPreviewSize} from "@weare/reapptor-react-common";
import {Checkbox, LocationPicker, NumberWidget, WidgetContainer} from "@weare/reapptor-react-components";

interface LocationPickerTestsState {
    fullWidth: boolean;
}

export default class LocationPickerTests extends BaseComponent<{}, LocationPickerTestsState> {
    state: LocationPickerTestsState = {
        fullWidth: false
    };

    get fullWidth() {
        return this.state.fullWidth;
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <div style={{margin: "1rem 0"}}>
                    <Checkbox
                        value={this.fullWidth}
                        label="Full width"
                        inline
                        onChange={async (checkbox, value) => await this.setState({fullWidth: value})}
                    />
                </div>
                <LocationPicker fullWidth={this.fullWidth}
                                zoomLevel={10}
                                country={["us", "fi"]}
                />
            </React.Fragment>
        );
    }
}