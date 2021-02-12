import React from 'react';
import {AlertModel, AlertType, BaseComponent} from "@weare/athenaeum-react-common";
import {Alert} from "@weare/athenaeum-react-components";
import Localizer from "@/localization/Localizer";

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
                <span>{Localizer.topNavAccount}</span>
                <Alert model={this.alertModel} />
            </div>
        );
    }
    
}
export default App;
