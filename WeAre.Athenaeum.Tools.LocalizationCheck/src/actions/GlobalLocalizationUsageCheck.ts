import fs from "fs";
import { StringUtilities } from "../utilities/StringUtilities";
import {Configuration} from "../types";
import FsUtilities from "../utilities/FsUtilities";

export async function checkForUnUsedLocalizationsGlobally(config: Configuration, input: {
    resources: Map<string, string[]>[];
    typescriptDirectories: string[];
    cSharpDirectories: string[];
}): Promise<{ key: string; searchString: string[] }[]> {
    const unUsedGlobalLocalizations: { key: string; searchString: string[] }[] = [];

    console.log("Listing files ...");
    const typeScriptFiles: string[] = [];
    const cSharpFiles: string[] = [];

    for (const tscDir of input.typescriptDirectories) {
        const dirFiles = FsUtilities.listAllTsAndTsxFiles(tscDir, "Localizer.ts");
        typeScriptFiles.push(...dirFiles);
    }

    for (const csDir of input.cSharpDirectories) {
        const dirFiles = FsUtilities.listAllCSharpFiles(csDir);
        cSharpFiles.push(...dirFiles);
    }

    console.log("Reading files ...");
    const typeScriptFilesData = typeScriptFiles.map((x) => fs.readFileSync(x).toString());
    const cSharpFilesData = cSharpFiles.map((x) => fs.readFileSync(x).toString());

    const localizationSet = input.resources.map((resource) => {
        return Array.from(resource.keys()).reduce((prev, curr) => {
            const key = curr;
            const values: string[] = resource.get(curr) as string[];
            
            const stringsToSearch = values.map((x) => {
                if (x) {
                    return [key, x].join(".");
                }
                return key;
            });
            
            return [...prev, ...stringsToSearch];
        }, [] as string[]);
    });

    localizationSet.map((localizations) => {
        localizations.map((localization) => {
            const prefixExcluded = config.prefixesToExclude.find(x => localization.startsWith(x));
            const postfixExcluded = config.postfixesToExclude.find(x => localization.endsWith(x));
            if (prefixExcluded || postfixExcluded) return;

            const tscGetterString = StringUtilities.createTypescriptGetterName(localization);
            const tscConstantString = StringUtilities.createTypescriptConstantName(localization);
            const cSharpConstantString = StringUtilities.createCSharpConstantName(localization);

            const tscFindFunc = (data: string) => data.includes(tscConstantString) || data.includes(tscGetterString);
            const cSharpFindFunc = (data: string) => data.includes(cSharpConstantString);

            const isUsedInTsc = !!typeScriptFilesData.find(tscFindFunc);
            const isUsedInCSharp = !!cSharpFilesData.find(cSharpFindFunc);

            const isUsed = isUsedInTsc || isUsedInCSharp;

            if (!isUsed) {
                unUsedGlobalLocalizations.push({
                    key: localization,
                    searchString: [tscGetterString, tscConstantString, cSharpConstantString],
                });
            }
        });
    });

    console.log("Checking files ...");

    const example = "TopNav.Account";
    console.log(" ");
    console.log("------");
    console.log("Example: ");
    console.log("Localization : ", example);
    console.log("TS Getter    : ", StringUtilities.createTypescriptGetterName(example));
    console.log("TS Constant  : ", StringUtilities.createTypescriptConstantName(example));
    console.log("C# Constant  : ", StringUtilities.createCSharpConstantName(example));
    console.log("------");
    console.log(" ");

    return unUsedGlobalLocalizations;
}
