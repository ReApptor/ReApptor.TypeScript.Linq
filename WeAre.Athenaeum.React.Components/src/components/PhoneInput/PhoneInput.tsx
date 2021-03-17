import TextInput from "../TextInput/TextInput";
import { PhoneValidator, ValidatorCallback } from "../BaseInput/BaseInput";
import { BaseInputType } from "../../models/Enums";

export default class PhoneInput extends TextInput {
    protected getType(): BaseInputType {
        return BaseInputType.Text;
    }

    public getValidators(): ValidatorCallback<string>[] {
        return [PhoneValidator.validator];
    }
}
