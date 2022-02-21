import TextInput from "../TextInput/TextInput";
import {BaseInputType} from "@weare/reapptor-react-common";
import { EmailValidator, ValidatorCallback } from "../BaseInput/BaseInput";

export default class EmailInput extends TextInput {
    protected getType(): BaseInputType {
        return BaseInputType.Email;
    }

    public getValidators(): ValidatorCallback<string>[] {
        return [EmailValidator.validator];
    }
}
