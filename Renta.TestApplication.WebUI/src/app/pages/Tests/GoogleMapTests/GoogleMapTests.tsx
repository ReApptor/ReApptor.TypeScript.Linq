import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {Button, Checkbox, GoogleMap, NumberInput, PageRow, ThreeColumns, TwoColumns} from "@weare/athenaeum-react-components";

interface IModalTestsState {
    clusterMarkers: boolean;
    lat: number;
    lon: number;
    markers: google.maps.Marker[];
}

export default class GoogleMapTests extends BaseComponent<{}, IModalTestsState> {

    public state: IModalTestsState = {
        clusterMarkers: false,
        lat: 0,
        lon: 0,
        markers: [],
    };

    private readonly _mapRef: React.RefObject<GoogleMap> = React.createRef();

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
                <PageRow>
                    <TwoColumns>
                        <NumberInput inline
                                     label="Markers"
                                     onChange={async (_, markers) => await this.setMarkersAsync(markers)}
                        />

                        <Checkbox inline
                                  label="Cluster markers"
                                  value={this.state.clusterMarkers}
                                  onChange={async (_, clusterMarkers) => {await this.setState({clusterMarkers})}}
                        />
                    </TwoColumns>
                </PageRow>

                <PageRow>
                    <ThreeColumns>
                        <NumberInput inline
                                     label="Latitude"
                                     value={this.state.lat}
                                     onChange={async (_, lat) => {await this.setState({lat})}}
                        />

                        <NumberInput inline
                                     label="Longitude"
                                     value={this.state.lon}
                                     onChange={async (_, lon) => {await this.setState({lon})}}
                        />

                        <Button label="Set new center coodinates"
                                onClick={async () => await this._mapRef.current!.setCenterAsync({lat: this.state.lat, lng: this.state.lon})}
                        />
                    </ThreeColumns>
                </PageRow>

                <GoogleMap ref={this._mapRef}
                           height={"50vh"}
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