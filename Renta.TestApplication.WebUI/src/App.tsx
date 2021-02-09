import React from 'react';

import {Alert} from '@weare/athenaeum-react-components';
import {AlertModel, AlertType} from "@weare/athenaeum-react-common";

class App extends React.Component {
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
