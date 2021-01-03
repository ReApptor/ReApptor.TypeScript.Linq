import { TextAlignProperty, VerticalAlignProperty } from "csstype";
import {TextAlign, VerticalAlign} from "./Enums";

export default class StylesUtility {
    
    public static textAlign(value: TextAlign | null | undefined): TextAlignProperty {
        switch(value) {
            case TextAlign.Left:
                return "left";
                
            case TextAlign.Center:
                return "center";
                
            case TextAlign.Right:
                return "right";
                
            default:
                return "initial"
        }
    }
    
    public static verticalAlign(value: VerticalAlign | null | undefined): VerticalAlignProperty<0> {
        switch(value) {
            case VerticalAlign.Top:
                return "top";

            case VerticalAlign.Middle:
                return "middle";

            case VerticalAlign.Bottom:
                return "bottom";

            default:
                return "initial"
        }
    }
    
}