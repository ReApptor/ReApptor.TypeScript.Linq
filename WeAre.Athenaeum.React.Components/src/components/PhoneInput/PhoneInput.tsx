import TextInput from "../TextInput/TextInput";
import { BaseInputType } from "@weare/athenaeum-react-components/models/Enums";
import { PhoneValidator, ValidatorCallback } from "@weare/athenaeum-react-components/components/BaseInput/BaseInput";

export default class PhoneInput extends TextInput {
    protected getType(): BaseInputType {
        return BaseInputType.Text;
    }

    public getValidators(): ValidatorCallback<string>[] {
        return [PhoneValidator.validator];
    }
}
