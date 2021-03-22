import {BaseInputType} from "@weare/athenaeum-react-common";
import TextInput from "../TextInput/TextInput";

export default class PasswordInput extends TextInput {
    protected getType() {
        return BaseInputType.Password;
    }
}