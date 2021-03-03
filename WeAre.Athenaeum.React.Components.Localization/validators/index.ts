import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { convertResxFileToMap, getArguments } from './tools';
import { checkForRedundantLocalizerPlaceHolders } from './actions/redundantLocalizerPlaceHolderCheck';
import { checkForLocalizationWithoutComponent } from './actions/localizationWithoutComponentCheck';
import { checkForComponentWithoutLocalization } from './actions/componentWithoutLocalizationCheck';
import { checkForUnUsedLocalizations } from './actions/componentUnUsedLocalizationCheck';

async function main(componentsPath: string, resxPath: string) {
  const localizationMap = await convertResxFileToMap(fs.readFileSync(resxPath));

  console.log(chalk.green("Checking for RedundantLocalizerPlaceHolders"))
  const redundantWarnings = checkForRedundantLocalizerPlaceHolders(localizationMap);
  
  console.log(chalk.green("Checking for localizationWithoutComponentWarnings"))
  const localizationWithoutComponentWarnings = await checkForLocalizationWithoutComponent(
      componentsPath,
      localizationMap,
  );
  
  console.log(chalk.green("Checking for componentsWithoutLocalizationWarnings"))
  const componentsWithoutLocalizationWarnings = await checkForComponentWithoutLocalization(
      componentsPath,
      localizationMap,
  );
  
  console.log(chalk.green("Checking for componentUnUsedLocalizationWarnings"))
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

console.log();
const { resxPath, componentsPath } = getArguments();

if (!resxPath || !componentsPath) {
  throw new Error("Missing argument --resxPath=x or --componentsPath=y")
}

const resxPathAsAbsolute = resxPath.startsWith('.') ? path.resolve(process.cwd(), resxPath) : resxPath;
const componentsPathAsAbsolute = componentsPath.startsWith('.')
    ? path.resolve(process.cwd(), componentsPath)
    : componentsPath;

console.log('resx path:');
console.log(resxPathAsAbsolute);
console.log('components directory path:');
console.log(componentsPathAsAbsolute);

try {
  main(componentsPathAsAbsolute, resxPathAsAbsolute).then();

} catch (e){
  console.log('Error while running Checks');
  console.log(e)
}