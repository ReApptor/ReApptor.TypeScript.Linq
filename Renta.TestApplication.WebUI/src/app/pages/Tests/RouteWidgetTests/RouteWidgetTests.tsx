import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {RouteWidget, WidgetContainer} from "@weare/athenaeum-react-components";
import PageDefinitions from "../../PageDefinitions";
import {TFormat, Utility} from "@weare/athenaeum-toolkit";

class TestNumberRouteWidget extends RouteWidget {
    protected get numberFormat(): TFormat {
        return "0.00";
    }
    protected async fetchDataAsync(): Promise<number> {
        await Utility.wait(2000);
        return 25.7;
    }
}

class TestNumberAsTextRouteWidget extends RouteWidget {
    protected get numberFormat(): TFormat {
        return "0.00";
    }
    protected async fetchDataAsync(): Promise<string> {
        await Utility.wait(2000);
        return "25.7";
    }
}

class TestTextRouteWidget extends RouteWidget {
    protected async fetchDataAsync(): Promise<string> {
        await Utility.wait(2000);
        return "Text";
    }
}

class TestDateRouteWidget extends RouteWidget {
    protected async fetchDataAsync(): Promise<Date> {
        await Utility.wait(2000);
        return Utility.today();
    }
}

export default class RouteWidgetTests extends BaseComponent {
    
    public render(): React.ReactNode {        
        return (
            <React.Fragment>

                <WidgetContainer>

                    <RouteWidget id={"WidgetIcon"} wide icon={{ name: "list"}} label={"Icon"} route={PageDefinitions.dummyRoute} description={"Test routeWidget with icon"} />
                    
                    <RouteWidget id={"WidgetText"} wide text={"Text"} label={"Text"} route={PageDefinitions.dummyRoute}  description={"Test routeWidget with text"} />
                    
                    <RouteWidget id={"WidgetIconText"} wide icon={{ name: "list"}} text={"Text"} label={"Icon & text"} route={PageDefinitions.dummyRoute}  description={"Test routeWidget with icon and text"} />
                    
                    <TestNumberRouteWidget id={"AsyncWidgetNumber"} wide async label={"NumberRouteWidget"} route={PageDefinitions.dummyRoute}  description={"AsyncWidget with number fetching"} />
                    
                    <TestNumberAsTextRouteWidget id={"AsyncWidgetNumberAsText"} wide async label={"NumberAsTextRouteWidget"} route={PageDefinitions.dummyRoute}  description={"AsyncWidget with number as string fetching"} />
                    
                    <TestTextRouteWidget id={"AsyncWidgetText"} wide async label={"TextRouteWidget"} route={PageDefinitions.dummyRoute}  description={"AsyncWidget with text fetching"} />
                    
                    <TestDateRouteWidget id={"AsyncWidgetDate"} wide async label={"DateRouteWidget"} route={PageDefinitions.dummyRoute}  description={"AsyncWidget with date fetching"} />

                </WidgetContainer>
                
            </React.Fragment>
        );
    }
}