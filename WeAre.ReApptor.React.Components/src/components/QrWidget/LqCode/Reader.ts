import {Dictionary} from "typescript-collections";
import Result from "./Result";
import {DecodeHintType} from "./Types";
import BinaryBitmap from "./BinaryBitmap";

export default interface Reader {
    decode(var1: BinaryBitmap, var2?: Dictionary<DecodeHintType, any> | null): Result;

    reset(): void;
}