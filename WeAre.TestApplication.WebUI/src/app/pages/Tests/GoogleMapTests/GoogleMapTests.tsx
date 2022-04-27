import React from "react";
import {BaseComponent} from "@weare/reapptor-react-common";
import {AddressHelper, Button, Checkbox, FourColumns, GoogleMap, IGoogleMapMarker, NumberInput, PageRow, Tab, TabContainer, ThreeColumns} from "@weare/reapptor-react-components";

interface IModalTestsState {
    clusterMarkers: boolean;
    lat: number;
    lon: number;
    markerCount: number;
    markersWithInfoWindows: boolean;
    autoCloseInfoWindows: boolean;
}

export default class GoogleMapTests extends BaseComponent<{}, IModalTestsState> {

    public state: IModalTestsState = {
        clusterMarkers: false,
        lat: 50,
        lon: 50,
        markerCount: 0,
        markersWithInfoWindows: false,
        autoCloseInfoWindows: false,
    };

    private readonly _mapRef: React.RefObject<GoogleMap> = React.createRef();
    private _markers: IGoogleMapMarker[] | null = null;
    
    private clearMarkers(): void {
        this._markers = null;
    }

    private get markers(): IGoogleMapMarker[] {

        this._markers = this._markers ?? [];
        
        while (this._markers.length < this.state.markerCount) {

            const marker: IGoogleMapMarker = {
                title: "marker",
                position: {
                    lat: (Math.random() - 0.5) * 200,
                    lng: (Math.random() - 0.5) * 200
                },
            };

            if (this.state.markersWithInfoWindows) {
                marker.infoWindow = {
                    content: `Info window for marker, double click to select!`,
                    position: marker.position,
                    pixelOffset: {height: -42, width: 0, equals(): boolean {return false}},
                };
            }

            marker.onDoubleClick = async (sender, marker) => {
                alert("OnMarkerDoubleClick=" + marker.title);
            }

            this._markers.push(marker);
        }

        return this._markers;
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <PageRow>
                    <ThreeColumns>
                        
                        <NumberInput inline
                                     label="Latitude"
                                     value={this.state.lat}
                                     onChange={async (_, lat) => { await this.setState({lat})}}
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

                <PageRow>
                    <FourColumns>
                        
                        <NumberInput inline
                                     label="Markers"
                                     value={this.state.markerCount}
                                     onChange={async (_, markerCount) => {this.clearMarkers(); await this.setState({markerCount})}}
                        />

                        <Checkbox inline
                                  label="Cluster markers"
                                  value={this.state.clusterMarkers}
                                  onChange={async (_, clusterMarkers) => {this.clearMarkers(); await this.setState({clusterMarkers})}}
                        />

                        <Checkbox inline
                                  label="With info windows"
                                  value={this.state.markersWithInfoWindows}
                                  onChange={async (_, markersWithInfoWindows) => {this.clearMarkers(); await this.setState({markersWithInfoWindows})}}
                        />

                        <Checkbox inline
                                  label="Auto-close info windows"
                                  value={this.state.autoCloseInfoWindows}
                                  onChange={async (_, autoCloseInfoWindows) => {this.clearMarkers(); await this.setState({autoCloseInfoWindows})}}
                        />
                        
                    </FourColumns>
                </PageRow>

                <TabContainer>
                    
                    <Tab id="dynamicMap" title="Dynamic Map">
                        
                        <GoogleMap ref={this._mapRef}
                                   height={"50vh"}
                                   center={{lat: this.state.lat, lng: this.state.lon}}
                                   zoom={1}
                                   markers={this.markers}
                                   clusterMarkers={this.state.clusterMarkers}
                                   autoCloseInfoWindows={this.state.autoCloseInfoWindows}
                                   onClick={async () => {console.log(`map click`)}}
                        />
                        
                    </Tab>
                    
                    <Tab id="staticMap" title="Static Map">
                        
                        <img src={AddressHelper.googleStaticApiUrl({lat: this.state.lat, lng: this.state.lon}, 1)}
                             alt={"google static map"}
                        />
                        
                    </Tab>
                    
                </TabContainer>
                
            </React.Fragment>
        );
    }
}