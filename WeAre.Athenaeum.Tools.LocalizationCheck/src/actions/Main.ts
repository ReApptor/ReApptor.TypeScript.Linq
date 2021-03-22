import fs from "fs";
import chalk from "chalk";
import { checkForUnUsedLocalizationsGlobally } from "./GlobalLocalizationUsageCheck";
import { ResxUtilities } from "../utilities/ResxUtilities";
import { TypescriptLocalizationPrefix } from "../types";

export async function main(input: { typescriptDirectories: string[]; cSharpDirectories: string[]; resourcePaths: string[]; localizationPrefix: TypescriptLocalizationPrefix; logSearchStrings: boolean; prefixesToExclude: string[]; postfixesToExclude: string[] }) {
    const resources: Map<string, string[]>[] = [];
    for (const resourcePath of input.resourcePaths) {
        resources.push(await ResxUtilities.convertResxFileToMap(fs.readFileSync(resourcePath)));
    }
    let globalUnUsedLocalizationsWarnings: string[] = [];
    globalUnUsedLocalizationsWarnings = await checkForUnUsedLocalizationsGlobally({ ...input, resources });

    if (globalUnUsedLocalizationsWarnings.length > 0) {
        console.log(chalk.red("Global Unused localizations: "));
        globalUnUsedLocalizationsWarnings.map((x) => console.log(x));
    }

    const total = [...globalUnUsedLocalizationsWarnings];
    if (total.length === 0) {
        console.log(chalk.green("No Warnings! Good to go."));
    } else {
        console.log(chalk.red(`Total of ${total.length} warnings to fix.`));
    }
}
