import {BaseInputType} from "@weare/reapptor-react-common";
import TextInput from "../TextInput/TextInput";

export default class PasswordInput extends TextInput {
    protected getType() {
        return BaseInputType.Password;
    }
}