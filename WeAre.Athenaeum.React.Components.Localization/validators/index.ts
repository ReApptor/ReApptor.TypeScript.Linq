import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { checkForRedundantLocalizerPlaceHolders } from './actions/redundantLocalizerPlaceHolderCheck';
import { checkForLocalizationWithoutComponent } from './actions/localizationWithoutComponentCheck';
import { checkForComponentWithoutLocalization } from './actions/componentWithoutLocalizationCheck';
import { checkForUnUsedLocalizations } from './actions/componentUnUsedLocalizationCheck';
import { ResxUtilities } from './utilities/resxUtilities';
import { ArgsUtilities } from './utilities/argsUtilities';
import { checkForUnUsedLocalizationsGlobally } from './actions/globalLocalizationUsageCheck';

async function main(componentsPath: string, resxPath: string, global: boolean) {
  const localizationMap = await ResxUtilities.convertResxFileToMap(fs.readFileSync(resxPath));
  const warnings = [];

  if (global) {
    const globalUnUsedLocalizationsWarnings = await checkForUnUsedLocalizationsGlobally(
      componentsPath,
      localizationMap,
    );

    if (globalUnUsedLocalizationsWarnings.length > 0) {
      console.log(chalk.red('Global Unused localizations: '));
      globalUnUsedLocalizationsWarnings.map((x) => console.log(x));
    }
    warnings.push(...globalUnUsedLocalizationsWarnings);
  } else {
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

    warnings.push(...redundantWarnings);
    warnings.push(...localizationWithoutComponentWarnings);
    warnings.push(...componentsWithoutLocalizationWarnings);
    warnings.push(...componentUnUsedLocalizationWarnings);
  }

  if (warnings.length === 0) {
    console.log(chalk.green('No Warnings! Good to go.'));
  } else {
    console.log(chalk.red(`Total of ${warnings.length} warnings to fix.`));
  }
}

console.log();
const { resxPath, componentsPath, globalCheck } = ArgsUtilities.read();
console.log({ resxPath, componentsPath, globalCheck });
if (!resxPath || !componentsPath) {
  throw new Error('Missing argument --resxPath=x or --componentsPath=y');
}

const resxPathAsAbsolute = resxPath.startsWith('.') ? path.resolve(process.cwd(), resxPath) : resxPath;
const componentsPathAsAbsolute = componentsPath.startsWith('.')
  ? path.resolve(process.cwd(), componentsPath)
  : componentsPath;

console.log('resx path:');
console.log(resxPathAsAbsolute);
console.log('components directory path:');
console.log(componentsPathAsAbsolute);

main(componentsPathAsAbsolute, resxPathAsAbsolute, globalCheck === 'true').then();
