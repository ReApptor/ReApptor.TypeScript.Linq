import { FsUtilities } from '../utilities/fsUtilities';
import { PathUtilities } from '../utilities/pathUtilities';
import { LogUtilities } from '../utilities/logUtilities';

export async function checkForLocalizationWithoutComponent(
  componentsPath: string,
  localizationMap: Map<string, string[]>,
): Promise<string[]> {
  const output: string[] = [];
  const componentsDirectory = FsUtilities.readDirectory(componentsPath);

  //  handling when localization exist but component folder can not be found.
  const localizationsWithoutComponent: string[] = [];
  for (const [coName, localizations] of localizationMap) {
    if (!componentsDirectory.map((x) => PathUtilities.componentAbsolutePathToComponentName(x)).includes(coName)) {
      localizationsWithoutComponent.push(coName);
    }
  }

  localizationsWithoutComponent.map((coName) => {
    const staticMessage = 'exists in localizations but component folder could not be found';
    const space = LogUtilities.logSpace(Array.from(localizationMap.keys()) as string[], coName);
    output.push(`️"${coName}" ${space} ${staticMessage} `);
  });

  return output;
}
