import TextInput from "../TextInput/TextInput";
import { BaseInputType } from "@weare/athenaeum-react-components/models/Enums";
import { EmailValidator, ValidatorCallback } from "@weare/athenaeum-react-components/components/BaseInput/BaseInput";

export default class EmailInput extends TextInput {
    protected getType(): BaseInputType {
        return BaseInputType.Email;
    }

    public getValidators(): ValidatorCallback<string>[] {
        return [EmailValidator.validator];
    }
}
