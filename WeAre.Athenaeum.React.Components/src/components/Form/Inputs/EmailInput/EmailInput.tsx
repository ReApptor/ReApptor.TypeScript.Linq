import TextInput from "../TextInput/TextInput";
import { BaseInputType } from "@/models/Enums";
import { EmailValidator, ValidatorCallback } from "../BaseInput";

export default class EmailInput extends TextInput {
    protected getType(): BaseInputType {
        return BaseInputType.Email;
    }

    public getValidators(): ValidatorCallback<string>[] {
        return [EmailValidator.validator];
    }
}