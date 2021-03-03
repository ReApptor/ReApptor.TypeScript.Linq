import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { convertResxFileToMap } from './tools';
import { checkForRedundantLocalizerPlaceHolders } from './actions/redundantLocalizerPlaceHolderCheck';
import { checkForLocalizationWithoutComponent } from './actions/localizationWithoutComponentCheck';
import { checkForComponentWithoutLocalization } from './actions/componentWithoutLocalizationCheck';
import { checkForUnUsedLocalizations } from './actions/componentUnUsedLocalizationCheck';

const componentsPath =
  '/Users/ericaskari/Desktop/WEARE/RENTA/renta-components/WeAre.Athenaeum.React.Components/src/components';
async function main() {
  const resxPath = path.resolve(
    '/Users/ericaskari/Desktop/WEARE/RENTA/renta-components/WeAre.Athenaeum.React.Components.Localization/resources/SharedResources.resx',
  );

  const localizationMap = await convertResxFileToMap(fs.readFileSync(resxPath));

  const redundantWarnings = checkForRedundantLocalizerPlaceHolders(localizationMap);

  const localizationWithoutComponentWarnings = await checkForLocalizationWithoutComponent(
    componentsPath,
    localizationMap,
  );

  const componentsWithoutLocalizationWarnings = await checkForComponentWithoutLocalization(
    componentsPath,
    localizationMap,
  );

  const componentUnUsedLocalizationWarnings = await checkForUnUsedLocalizations(componentsPath, localizationMap);

  if (redundantWarnings.length > 0) {
    console.log(chalk.red('Redundant Localizer placeholders: '));
    redundantWarnings.map((x) => console.log(x));
  }

  if (localizationWithoutComponentWarnings.length > 0) {
    console.log(chalk.red('Localizations without component:'));
    localizationWithoutComponentWarnings.map((x) => console.log(x));
  }

  if (componentsWithoutLocalizationWarnings.length > 0) {
    console.log(chalk.red('Components without Localization:'));
    componentsWithoutLocalizationWarnings.map((x) => console.log(x));
  }

  if (componentUnUsedLocalizationWarnings.length > 0) {
    console.log(chalk.red('Unused Localizations:'));
    componentUnUsedLocalizationWarnings.map((x) => console.log(x));
  }

  const warnings = [
    ...redundantWarnings,
    ...localizationWithoutComponentWarnings,
    ...componentsWithoutLocalizationWarnings,
    ...componentUnUsedLocalizationWarnings,
  ];

  if (warnings.length === 0) {
    console.log(chalk.green('No Warnings! Good to go.'));
  } else {
    console.log(chalk.red(`Total of ${warnings.length} warnings to fix.`));
  }
}

main().then();
