import { FsUtilities } from '../utilities/fsUtilities';
import { PathUtilities } from '../utilities/pathUtilities';
import { LogUtilities } from '../utilities/logUtilities';

export async function checkForComponentWithoutLocalization(
  componentsPath: string,
  localizationMap: Map<string, string[]>,
): Promise<string[]> {
  const output: string[] = [];
  const componentDirectories = FsUtilities.readDirectory(componentsPath);

  //  handling when component folder exists but localization could not be found.
  const componentsWithoutLocalization: string[] = [];
  for (const componentDirectory of componentDirectories) {
    const coName = PathUtilities.componentAbsolutePathToComponentName(componentDirectory);
    if (!localizationMap.has(coName)) {
      componentsWithoutLocalization.push(coName);
    }
  }

  componentsWithoutLocalization.map((coName) => {
    const staticMessage = 'exists in component folder but localization could not be found, please add a placeholder';
    const space = LogUtilities.logSpace(Array.from(localizationMap.keys()) as string[], coName);
    output.push(`️"${coName}" ${space} ${staticMessage} `);
  });

  return output;
}
