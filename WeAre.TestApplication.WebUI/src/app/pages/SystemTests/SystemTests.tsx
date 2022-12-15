import React from "react";
import {Button, ButtonType, PageContainer, PageRow,} from "@weare/reapptor-react-components";
import AnonymousPage from "../AnonymousPage";
import {ServiceProvider} from "@weare/reapptor-toolkit";

export default class SystemTests extends AnonymousPage {
    
    private async testAsync(): Promise<void> {
        // Extract service name 
        const name: string = nameof(SystemTests);
        // Register service
        ServiceProvider.addSingleton(name, this);
        // Get service
        const service: SystemTests | null = ServiceProvider.getService<SystemTests>(name);
        // Assert
        const passed: boolean = (service === this);
        // Message
        if (passed) {
            await this.alertMessageAsync(`Test passed, service name = ${name}.`);
        } else {
            await this.alertErrorAsync(`Test failed, service name = ${name}.`);
        }
    }

    public getTitle(): string {
        return nameof(SystemTests);
    }

    public render(): React.ReactNode {

        return (
            <PageContainer className="tests-page">
                
                <PageRow>

                    <Button label={"Test: NameOf & ServiceProvider"}
                            icon={"fal fa-check"}
                            type={ButtonType.Primary}
                            onClick={() => this.testAsync()}
                    />

                </PageRow>
                
            </PageContainer>
        );
    }
}