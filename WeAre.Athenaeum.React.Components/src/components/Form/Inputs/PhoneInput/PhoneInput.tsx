import TextInput from "../TextInput/TextInput";
import { BaseInputType } from "@/models/Enums";
import { PhoneValidator, ValidatorCallback } from "../BaseInput";

export default class PhoneInput extends TextInput {
    protected getType(): BaseInputType {
        return BaseInputType.Text;
    }

    public getValidators(): ValidatorCallback<string>[] {
        return [PhoneValidator.validator];
    }
}