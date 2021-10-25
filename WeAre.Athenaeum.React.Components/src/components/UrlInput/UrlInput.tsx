import TextInput from "../TextInput/TextInput";
import {BaseInputType} from "@weare/athenaeum-react-common";
import { UrlValidator, ValidatorCallback } from "../BaseInput/BaseInput";

export default class UrlInput extends TextInput {
    protected getType(): BaseInputType {
        return BaseInputType.Url;
    }

    public getValidators(): ValidatorCallback<string>[] {
        return [UrlValidator.validator];
    }
}