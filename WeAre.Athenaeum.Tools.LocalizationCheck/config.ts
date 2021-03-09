import { Configuration, TypescriptLocalizationPrefix } from "./src/types";

const configuration: Configuration = {
    typescriptLocalizationPrefix: TypescriptLocalizationPrefix.COMPONENT_NAME,
    logSearchStrings: false,
    resources: ["../WeAre.Athenaeum.React.Components.Localization/resources/SharedResources.resx"],
    cSharpDirectories: [],
    typescriptComponentsDirectories: ["../WeAre.Athenaeum.React.Components/src/components"],
    enumsToKeep: [],
};

export default configuration;
