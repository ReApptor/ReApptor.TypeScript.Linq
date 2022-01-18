import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {ButtonType, Form, OneColumn, QrInput, ThreeColumns, TwoColumns} from "@weare/athenaeum-react-components";




interface IQrInputTestsState {
}

export default class QrInputTests extends BaseComponent<{}, IQrInputTestsState> {

    public render(): React.ReactNode {

        return (
            <Form className={"col-md-6 mx-auto"}>
         
                <OneColumn>
                    <QrInput autoClose
                             buttonType={ButtonType.Orange}
                             label={"console.log(code)"}
                             onQr={async (code) => {console.log(code)}}
                    />
                </OneColumn>
        
                <TwoColumns>
                    <QrInput buttonType={ButtonType.Blue}
                             label={"Long Long Long LongLongLongLongLongLongLongLongLongLongLongLongLong"}
                    />
                    <div></div>
                </TwoColumns>
        
                <ThreeColumns>
                    <QrInput autoClose
                             label={"window.alert(code)"}
                             onQr={async (code) => {window.alert(code)}}
                    />
                    <div></div>
                    <div></div>
                </ThreeColumns>
            </Form>
            
        );
    }
}