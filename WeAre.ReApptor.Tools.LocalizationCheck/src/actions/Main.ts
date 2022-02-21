import fs from "fs";
import chalk from "chalk";
import { checkForUnUsedLocalizationsGlobally } from "./GlobalLocalizationUsageCheck";
import { ResxUtilities } from "../utilities/ResxUtilities";
import {Configuration} from "../types";
import {LogUtilities} from "../utilities/LogUtilities";
import {DeleteLocalizations} from "./Delete";

export async function main(config: Configuration, input: 
    { 
        resourcePaths: string[];  
        typescriptDirectories: string[]; 
        cSharpDirectories: string[]; 
    }) {
    const resources: Map<string, string[]>[] = [];
    for (const resourcePath of input.resourcePaths) {
        resources.push(await ResxUtilities.convertResxFileToMap(fs.readFileSync(resourcePath)));
    }
    
    const globalUnUsedLocalizationsWarnings = await checkForUnUsedLocalizationsGlobally(config, { ...input, resources });
    
    if (globalUnUsedLocalizationsWarnings.length > 0) {
        console.log(chalk.red("Global Unused localizations: "));

        globalUnUsedLocalizationsWarnings.map((warnings) => {
            const space = LogUtilities.logSpace(globalUnUsedLocalizationsWarnings.map((x) => x.key),warnings.key);
            console.log(`️"${warnings.key}" ${space} ${config.logSearchStrings ? "(" + warnings.searchString.join(' | ') + ")" : ""}`);
        });
        
        console.log(chalk.red(`Total of ${globalUnUsedLocalizationsWarnings.length} warnings to fix.`));

        if (config.deleteOnFound) {
            console.log(chalk.red("Removing unused localizations..."));
            await DeleteLocalizations(config, globalUnUsedLocalizationsWarnings.map(x => x.key))
        }

        return;
    }

    console.log(chalk.green("No Warnings! Good to go."));
}
