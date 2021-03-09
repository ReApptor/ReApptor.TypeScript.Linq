import fs from "fs";
import { LogUtilities } from "../utilities/LogUtilities";
import { StringUtilities } from "../utilities/StringUtilities";
import { TypescriptLocalizationPrefix } from "../types";
import FsUtilities from "../utilities/FsUtilities";

export async function checkForUnUsedLocalizationsGlobally(input: {
    typescriptDirectories: string[];
    cSharpDirectories: string[];
    resources: Map<string, string[]>[];
    localizationPrefix: TypescriptLocalizationPrefix;
    logSearchStrings: boolean;
    enumsToKeep: string[];
}): Promise<string[]> {
    const output: string[] = [];
    const unUsedGlobalLocalizations: { key: string; searchString: string }[] = [];

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
            const stringsToSearch = values.map((x) => [key, x].join("."));
            return [...prev, ...stringsToSearch];
        }, [] as string[]);
    });

    localizationSet.map((localizations) => {
        localizations.map((localization) => {
            const isEnum = StringUtilities.isEnum(localization);
            if (isEnum) {
                const enumName = StringUtilities.getEnumName(localization);
                const isExcluded = input.enumsToKeep.includes(enumName);
                if (isExcluded) return;
            }

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
                    searchString: `${tscGetterString} | ${tscConstantString} | ${cSharpConstantString}`,
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

    unUsedGlobalLocalizations.map((warnings) => {
        const space = LogUtilities.logSpace(
            unUsedGlobalLocalizations.map((x) => x.key),
            warnings.key
        );
        const staticString = "";
        output.push(`️"${warnings.key}"  ${space} ${staticString}  ${input.logSearchStrings ? "(" + warnings.searchString + ")" : ""}`);
    });

    return output;
}
