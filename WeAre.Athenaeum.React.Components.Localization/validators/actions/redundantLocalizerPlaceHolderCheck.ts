import { logSpace } from '../tools';

export function checkForRedundantLocalizerPlaceHolders(localizationMap: Map<string, string[]>): string[] {
  const output: string[] = [];
  //  handling when placeholder exist and also it has other translations.
  const redundantLocalizerPlaceHoldersWarningsToShow: string[] = [];

  for (const [coName, localizations] of localizationMap) {
    if (localizations.length > 1 && localizations.includes('')) {
      redundantLocalizerPlaceHoldersWarningsToShow.push(coName);
    }
  }

  redundantLocalizerPlaceHoldersWarningsToShow.map((coName) => {
    const staticMessage = 'localizations placeholder can be removed from localizations.';
    const space = logSpace(Array.from(localizationMap.keys()) as string[], coName);
    output.push(`️"${coName}" ${space} ${staticMessage} `);
  });
  return output;
}
