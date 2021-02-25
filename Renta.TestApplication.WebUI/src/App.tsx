import React from 'react';
import { BaseComponent } from "@weare/athenaeum-react-common";
import styles from './App.module.scss';
import Tests from "@/pages/Tests/Tests";

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
