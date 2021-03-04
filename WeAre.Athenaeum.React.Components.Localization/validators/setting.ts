import { StringUtilities } from './utilities/stringUtilities';

export function createCoLocalizerFileName(componentName: string) {
  return `${componentName}Localizer.ts`;
}

export function createLocalizerConstantName(coName: string, localization: string) {
  const removedDots = localization.replace(/\./g, '');
  const camelCase = StringUtilities.pascalToCamelCase(removedDots);
  return [`${coName}Localizer`, camelCase].join('.');
}
export function createTaskVersionConstantName(localization: string) {
  const removedDots = localization.replace(/\./g, '');
  return ['Localizer', StringUtilities.pascalToCamelCase(removedDots)].join('.');
}
