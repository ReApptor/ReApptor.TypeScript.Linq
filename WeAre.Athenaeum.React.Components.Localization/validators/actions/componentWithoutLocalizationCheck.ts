import { logSpace, readDirectory } from '../tools';

export async function checkForComponentWithoutLocalization(
  componentsPath: string,
  localizationMap: Map<string, string[]>,
): Promise<string[]> {
  const output: string[] = [];
  const componentFolders = await readDirectory(componentsPath);

  //  handling when component folder exists but localization could not be found.
  const componentsWithoutLocalization: string[] = [];
  for (const componentFolder of componentFolders) {
    if (!localizationMap.has(componentFolder)) {
      componentsWithoutLocalization.push(componentFolder);
    }
  }

  componentsWithoutLocalization.map((coName) => {
    const staticMessage = 'exists in component folder but localization could not be found, please add a placeholder';
    const space = logSpace(Array.from(localizationMap.keys()) as string[], coName);
    output.push(`️"${coName}" ${space} ${staticMessage} `);
  });

  return output;
}
