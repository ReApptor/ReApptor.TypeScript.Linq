import TextInput from "../TextInput/TextInput";
import { BaseInputType } from "@weare/athenaeum-react-components/models/Enums";

export default class PasswordInput extends TextInput {
    protected getType() {
        return BaseInputType.Password;
    }
}