import { logSpace, readDirectory } from '../tools';

export async function checkForLocalizationWithoutComponent(
  componentsPath: string,
  localizationMap: Map<string, string[]>,
): Promise<string[]> {
  const output: string[] = [];
  const componentFolders = await readDirectory(componentsPath);

  //  handling when localization exist but component folder can not be found.
  const localizationsWithoutComponent: string[] = [];
  for (const [coName, localizations] of localizationMap) {
    if (!componentFolders.includes(coName)) {
      localizationsWithoutComponent.push(coName);
    }
  }

  localizationsWithoutComponent.map((coName) => {
    const staticMessage = 'exists in localizations but component folder could not be found';
    const space = logSpace(Array.from(localizationMap.keys()) as string[], coName);
    output.push(`️"${coName}" ${space} ${staticMessage} `);
  });

  return output;
}
