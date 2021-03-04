import { FsUtilities } from '../utilities/fsUtilities';
import { createTaskVersionConstantName } from '../setting';
import fs from 'fs';
import { LogUtilities } from '../utilities/logUtilities';

export async function checkForUnUsedLocalizationsGlobally(
  componentsPath: string,
  localizationMap: Map<string, string[]>,
): Promise<string[]> {
  const output: string[] = [];
  const unUsedGlobalLocalizations: { key: string; searchString: string }[] = [];

  const files = FsUtilities.listAllTsAndTsxFiles(componentsPath);

  const filesData = files.map((x) => fs.readFileSync(x).toString());

  const localizations = Array.from(localizationMap.keys()).reduce((prev, curr) => {
    const key = curr;
    const values: string[] = localizationMap.get(curr) as string[];
    const stringsToSearch = values.map((x) => [key, x].join('.'));
    return [...prev, ...stringsToSearch];
  }, [] as string[]);

  localizations.map((key) => {
    const searchStr = createTaskVersionConstantName(key);
    const isNotUsed = !filesData.find((x) => x.includes(searchStr));
    if (isNotUsed) {
      unUsedGlobalLocalizations.push({ key: key, searchString: searchStr });
    }
  });

  unUsedGlobalLocalizations.map((warnings) => {
    const space = LogUtilities.logSpace(
      unUsedGlobalLocalizations.map((x) => x.key),
      warnings.key,
    );
    const staticString = 'is not used in components directory and can be removed';
    output.push(`️"${warnings.key}"  ${space} ${staticString}  (${warnings.searchString})`);
  });

  return output;
}
