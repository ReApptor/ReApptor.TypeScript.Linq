export enum TypescriptLocalizationPrefix {
    COMPONENT_NAME,
    LOCALIZER,
}

export interface Configuration {
    logSearchStrings: boolean;
    deleteOnFound?: boolean
    resources: string[];
    typescriptLocalizationPrefix: TypescriptLocalizationPrefix;
    typescriptComponentsDirectories: string[];
    cSharpDirectories: string[];
    prefixesToExclude: string[],
    postfixesToExclude: string[]
}
