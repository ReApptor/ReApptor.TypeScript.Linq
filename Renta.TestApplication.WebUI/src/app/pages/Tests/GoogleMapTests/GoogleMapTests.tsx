import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {Checkbox, FourColumns, GoogleMap, NumberInput} from "@weare/athenaeum-react-components";

interface IModalTestsState {
    clusterMarkers: boolean;
    markers: google.maps.Marker[];
}

export default class GoogleMapTests extends BaseComponent<{}, IModalTestsState> {

    public state: IModalTestsState = {
        clusterMarkers: false,
        markers: [],
    };

    private async setMarkersAsync(count: number): Promise<void> {
        while (this.state.markers.length <= count) {
            this.state.markers.push(new google.maps.Marker({
                title: "marker",
                position: {lat: (Math.random() - 0.5) * 200, lng: (Math.random() - 0.5) * 200},
            }));
        }

        if (this.state.markers.length > count) {
            this.state.markers.splice(count);
        }

        await this.reRenderAsync();
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <FourColumns>
                    <NumberInput inline
                                 label="Markers"
                                 onChange={async (_, markers) => await this.setMarkersAsync(markers)}
                    />

                    <Checkbox inline
                              label="Cluster markers"
                              value={this.state.clusterMarkers}
                              onChange={async (_, clusterMarkers) => {await this.setState({clusterMarkers})}}
                    />
                </FourColumns>

                <GoogleMap height={"50vh"}
                           initialCenter={{lat: 50, lng: 50}}
                           initialZoom={1}
                           clusterMarkers={this.state.clusterMarkers}
                           markers={this.state.markers}
                           onClick={async () => {console.log(`map click, ${this.state.markers.length} markers`)}}
                />
            </React.Fragment>
        );
    }
}