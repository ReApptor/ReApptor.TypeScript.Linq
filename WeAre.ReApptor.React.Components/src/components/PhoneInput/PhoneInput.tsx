import {BaseInputType} from "@weare/reapptor-react-common";
import TextInput from "../TextInput/TextInput";
import { PhoneValidator, ValidatorCallback } from "../BaseInput/BaseInput";

export default class PhoneInput extends TextInput {
    protected getType(): BaseInputType {
        return BaseInputType.Text;
    }

    public getValidators(): ValidatorCallback<string>[] {
        return [PhoneValidator.validator];
    }
}
