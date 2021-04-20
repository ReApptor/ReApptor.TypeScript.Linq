import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import Accordion from "@/@weare/athenaeum-react-components/components/Accordion/Accordion";

export default class AccordionTests extends BaseComponent {
    
    public render(): React.ReactNode {
        return (
            <div style={{margin: "1rem 0"}}>
                <Accordion header="Header" >
                    <div>
                        Content
                    </div>
                </Accordion>
            </div>
        );
    }
}