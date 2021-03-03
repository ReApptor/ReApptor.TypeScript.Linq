import { listAllTsAndTsxFiles, logSpace, pascalToCamelCase } from '../tools';
import path from 'path';
import fs from 'fs';

export async function checkForUnUsedLocalizations(
  componentsPath: string,
  localizationMap: Map<string, string[]>,
): Promise<string[]> {
  const output: string[] = [];

  const notUsedItemsWarningsToShow: { searchString: string; key: string }[] = [];
  for (const [coName, localizations] of localizationMap) {
    const coLocalizerName = `${coName}Localizer.ts`;
    if (localizations.length === 1 && localizations[0] === '') {
      // console.log('coName: ', coName, '[skip]');
      continue;
    }

    const allNestedFilesOfComponent = await listAllTsAndTsxFiles(path.resolve(componentsPath, coName), coLocalizerName);

    const filteredLocalizations = localizations.filter((x) => x !== '');

    const stringsToSearch = filteredLocalizations.map((x) => {
      const removedDots = x.replace(/\./g, '');
      const camelCase = pascalToCamelCase(removedDots);
      return [`${coName}Localizer`, camelCase].join('.');
    });
    // console.log('coLocalizerName: ', coLocalizerName);
    // console.log('filteredLocalizations: ', filteredLocalizations);
    // console.log('stringsToSearch: ', stringsToSearch);
    // console.log('Files: ');
    // console.log(allNestedFilesOfComponent);

    for (const searchString of stringsToSearch) {
      const isUsed = allNestedFilesOfComponent
        .map((x) => fs.readFileSync(x).toString())
        .map((x) => x.includes(searchString))
        .reduce((prev, curr) => {
          return prev || curr;
        }, false);
      if (!isUsed) {
        const index = stringsToSearch.indexOf(searchString);
        notUsedItemsWarningsToShow.push({ searchString, key: `${coName}.${filteredLocalizations[index]}` });
      }
    }
  }

  notUsedItemsWarningsToShow.map((warnings) => {
    const keys = notUsedItemsWarningsToShow.map((x) => x.key);
    const space = logSpace(keys, warnings.key);
    const staticString = 'is not used in component directory and can be removed';
    output.push(`️"${warnings.key}"  ${space} ${staticString}  (${warnings.searchString})`);
  });

  return output;
}
