import BasePageParameters from "./BasePageParameters";
import ServerError from "./ServerError";

export default interface IErrorPageParameters extends BasePageParameters {
    error: ServerError | null;
}