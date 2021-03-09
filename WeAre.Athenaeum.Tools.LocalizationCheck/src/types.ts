export enum TypescriptLocalizationPrefix {
    COMPONENT_NAME,
    LOCALIZER,
}
export interface Configuration {
    logSearchStrings: boolean;
    resources: string[];
    typescriptLocalizationPrefix: TypescriptLocalizationPrefix;
    typescriptComponentsDirectories: string[];
    cSharpDirectories: string[];
    enumsToKeep: string[];
}
