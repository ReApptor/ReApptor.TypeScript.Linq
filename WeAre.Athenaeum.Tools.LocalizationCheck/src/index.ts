import ConfigurationLoader from "./utilities/ConfigurationLoader";
import { TypescriptLocalizationPrefix, Configuration } from "./types";
import { EntryChecks } from "./actions/EntryChecks";
import { main } from "./actions/Main";

const config = ConfigurationLoader.loadConfiguration();

if (config.typescriptLocalizationPrefix === TypescriptLocalizationPrefix.COMPONENT_NAME) {
    console.log('TypescriptLocalizationPrefix.COMPONENT_NAME is not supported in this version.');
    process.exit(0);
}

const { cSharpDirectories, typescriptDirectories } = EntryChecks.checkDirectories(config);
const { resourcePaths } = EntryChecks.checkFiles(config);

main({
    resourcePaths,
    typescriptDirectories,
    cSharpDirectories,
    localizationPrefix: config.typescriptLocalizationPrefix,
    logSearchStrings: config.logSearchStrings,
    enumsToKeep: config.enumsToKeep,
}).then();

export { TypescriptLocalizationPrefix, Configuration };
