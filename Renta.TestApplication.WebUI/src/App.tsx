import React from 'react';
import { Alert } from "@weare/athenaeum-react-components";
import {AlertType, BaseComponent, AlertModel} from "@weare/athenaeum-react-common";
import "@/localization/Localizer";

class App extends BaseComponent {
    
    get alertModel(): AlertModel {
        return {
            alertType: AlertType.Success, autoClose: false, autoCloseDelay: 0, dismissible: true, flyout: false, isAlertModel: false, messageParams: [],
            message : "Test 123"
        };
    }
    
    render(): React.ReactNode {
        return (
            <div className="App">
                <Alert model={this.alertModel} />
            </div>
        );
    }
    
}

export default App;
