import TextInput from "../TextInput/TextInput";
import { EmailValidator, ValidatorCallback } from "../BaseInput/BaseInput";
import { BaseInputType } from "../../models/Enums";

export default class EmailInput extends TextInput {
    protected getType(): BaseInputType {
        return BaseInputType.Email;
    }

    public getValidators(): ValidatorCallback<string>[] {
        return [EmailValidator.validator];
    }
}
