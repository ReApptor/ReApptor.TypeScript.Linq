import path from 'path';
import fs from 'fs';
import { FsUtilities } from '../utilities/fsUtilities';
import { StringUtilities } from '../utilities/stringUtilities';
import { LogUtilities } from '../utilities/logUtilities';
import chalk from 'chalk';
import { PathUtilities } from '../utilities/pathUtilities';
import { createCoLocalizerFileName, createLocalizerConstantName } from '../setting';

export async function checkForUnUsedLocalizations(
  componentsPath: string,
  localizationMap: Map<string, string[]>,
): Promise<string[]> {
  try {
    const output: string[] = [];
    const skipped: string[] = [];
    const componentDirectories = FsUtilities.readDirectory(componentsPath);

    const notUsedItemsWarningsToShow: { searchString: string; key: string }[] = [];
    const skippedItemsWarningsToShow: string[] = [];

    for (const componentDirectory of componentDirectories) {
      const coName = PathUtilities.componentAbsolutePathToComponentName(componentDirectory);
      if (!localizationMap.has(coName)) {
        skippedItemsWarningsToShow.push(coName);
        continue;
      }
      const localizations = localizationMap.get(coName) as string[];
      const filteredLocalizations = localizations.filter((x) => x !== '');
      const stringsToSearch = filteredLocalizations.map((x) => {
        return createLocalizerConstantName(coName, x);
      });
      const componentPath = path.resolve(componentsPath, coName);
      const coLocalizerName = createCoLocalizerFileName(coName);
      const allNestedFilesOfComponent = FsUtilities.listAllTsAndTsxFiles(componentPath, coLocalizerName);
      for (const searchString of stringsToSearch) {
        const isUsed = allNestedFilesOfComponent
          .map((x) => {
            return fs.readFileSync(x).toString();
          })
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

    const lengthCalc = [...notUsedItemsWarningsToShow.map((x) => x.key), ...skippedItemsWarningsToShow];
    notUsedItemsWarningsToShow.map((warnings) => {
      const space = LogUtilities.logSpace(lengthCalc, warnings.key);
      const staticString = 'is not used in component directory and can be removed';
      output.push(`️"${warnings.key}"  ${space} ${staticString}  (${warnings.searchString})`);
    });

    skippedItemsWarningsToShow.map((warning) => {
      const space = LogUtilities.logSpace(lengthCalc, warning);
      const staticString = '[skipped] Localizer key could not be found for this component.';
      output.push(`️"${warning}"  ${space} ${staticString}`);
    });

    return output;
  } catch (e) {
    console.log(chalk.red('Error while running checkForUnUsedLocalizations'));
    console.log(e);
    return [];
  }
}
