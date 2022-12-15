import ServerError from "./ServerError";
import {BasePageParameters} from "../base/BasePage";

export default interface IErrorPageParameters extends BasePageParameters {
    error: ServerError | null;
}