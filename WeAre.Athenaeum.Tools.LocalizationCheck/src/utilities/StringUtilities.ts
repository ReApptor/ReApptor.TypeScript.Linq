//  Id: TopNav.Frontpage
//  topNavFrontpageLanguageItemName Typescript
//  topNavFrontpage Typescript
//  TopNavFrontpage C#
export abstract class StringUtilities {
    public static pascalToCamelCase(str: string) {
        const [first, ...rest] = str;
        return [first.toLowerCase(), ...rest].join("");
    }

    public static createCoLocalizerFileName(componentName: string) {
        return `${componentName}Localizer.ts`;
    }

    public static createLocalizerConstantName(coName: string, localization: string) {
        const removedDots = localization.replace(/\./g, "");
        const camelCase = StringUtilities.pascalToCamelCase(removedDots);
        return [`${coName}Localizer`, camelCase].join(".");
    }

    //  Example input:  TopNav.Frontpage
    //  Example output: Localizer.topNavFrontpage
    public static createTypescriptGetterName(localization: string) {
        const removedDots = localization.replace(/\./g, "");
        return ["Localizer", StringUtilities.pascalToCamelCase(removedDots)].join(".");
    }

    //  Example input:  TopNav.Frontpage
    //  Example output: Localizer.topNavFrontpageLanguageItemName
    public static createTypescriptConstantName(localization: string) {
        return [this.createTypescriptGetterName(localization), "LanguageItemName"].join("");
    }

    //  Example input:  TopNav.Frontpage
    //  Example output: TopNavFrontpage
    public static createCSharpConstantName(localization: string) {
        const removedDots = localization.replace(/\./g, "");
        return ["SharedResources", removedDots].join(".");
    }
    //  Example input:  Enum.*
    //  Example output: true
    public static isEnum(localization: string) {
        return localization.startsWith("Enum.");
    }
    //  Example input:  Enum.InvitationType.Invitation
    //  Example output: InvitationType
    public static getEnumName(localization: string) {
        return localization.split(".")[1];
    }
}
