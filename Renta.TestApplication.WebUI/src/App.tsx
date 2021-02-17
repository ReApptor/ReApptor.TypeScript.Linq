import React from 'react';
import { BaseComponent } from "@weare/athenaeum-react-common";
import "@/localization/Localizer";
import Tests from "@/pages/Tests/Tests";
import styles from './App.module.scss';
class App extends BaseComponent {

    
    render(): React.ReactNode {
        return (
            <div className={styles.page}>
                <Tests routeName={"Tests"}/>
            </div>
        );
    }
    
}

export default App;
