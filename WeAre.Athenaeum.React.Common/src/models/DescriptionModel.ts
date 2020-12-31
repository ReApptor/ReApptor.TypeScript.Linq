import {Align, Justify} from "../Enums";

export default class DescriptionModel {

    public readonly: boolean = false;

    public className: string | null = null;

    public description: string = "";

    public align: Align = Align.Bottom;

    public justify: Justify = Justify.Left;

    onChange?(value: string): Promise<void>
}