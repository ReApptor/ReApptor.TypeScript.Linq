import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import { WidgetContainer, LinkWidget, IconSize } from "@weare/athenaeum-react-components";

export default class LinkWidgetTests extends BaseComponent {

    public render(): React.ReactNode {        
        return (
            <React.Fragment>
                <h4 className="pt-2 pb-2 ">LinkWidget wide</h4>
                
                <WidgetContainer className="flex-column flex-grow-1">
                    <LinkWidget wide label={"LinkWidget"} url=""  />
                    <LinkWidget wide label={"LinkWidget"} url="" icon={{name: "map-marked", size: IconSize.X3}}  />
                    <LinkWidget wide label={"LinkWidget with description"} url="" description="SomeDesc"  />
                    <LinkWidget wide label={"LinkWidget with description"} url="" description="SomeDesc" icon={{name: "map-marked", size: IconSize.X3}}  />
                </WidgetContainer>
                
                <h4 className="pt-2 pb-2 ">LinkWidget</h4>
                
                <WidgetContainer className="flex-column flex-grow-1">
                    <LinkWidget label={"LinkWidget"} url=""  />
                    <LinkWidget label={"LinkWidget with description"} url="" description="SomeDesc"  />
                    <LinkWidget label={"LinkWidget with description"} url="" description="SomeDesc" icon={{name: "map-marked", size: IconSize.X3}}  />
                </WidgetContainer>
                
                <h4 className="pt-2 pb-2 ">LinkWidget minimized</h4>

                <WidgetContainer className="flex-column flex-grow-1">
                    <LinkWidget minimized label={"LinkWidget"} url=""  />
                    <LinkWidget minimized label={"LinkWidget with description"} url="" description="SomeDesc" icon={{name: "map-marked", size: IconSize.X3}}  />
                </WidgetContainer> 
                
                <h4 className="pt-2 pb-2 ">LinkWidget wide minimized</h4>

                <WidgetContainer className="flex-column flex-grow-1">
                    <LinkWidget wide minimized label={"LinkWidget"} url=""  />
                    <LinkWidget wide minimized label={"LinkWidget with description"} url="" description="SomeDesc" icon={{name: "map-marked", size: IconSize.X3}}  />
                </WidgetContainer>
            </React.Fragment>
        );
    }
}