import resx, { ObjectOfStrings } from 'resx';
import fs from 'fs';
import path from 'path';

export function convertResxToJs(resxFile: string): Promise<ObjectOfStrings> {
  return new Promise((resolve, reject) => {
    resx.resx2js(resxFile, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

export function readDirectory(directory: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err);
      }
      resolve(files);
    });
  });
}

export async function listAllNestedFiles(directory: string): Promise<string[]> {
  const finalized = [];
  const directoryData = await readDirectory(directory);

  for (const data of directoryData) {
    try {
      const nestedDir = path.resolve(directory, data);
      const nestedData = await listAllNestedFiles(nestedDir);
      finalized.push(...nestedData.map((x) => path.resolve(nestedDir, x)));
    } catch (e) {
      const nestedDir = path.resolve(directory, data);
      finalized.push(nestedDir);
    }
  }
  return finalized;
}

export async function listAllTsAndTsxFiles(directory: string, exclude?: string): Promise<string[]> {
  const allFiles = await listAllNestedFiles(directory);
  return allFiles
      .filter((x) => (x.endsWith('.ts') || x.endsWith('.tsx')) && !x.endsWith('.d.ts'))
      .filter((x) => (exclude ? !x.endsWith(exclude) : x));
}

export function pascalToCamelCase(str: string) {
  const [first, ...rest] = str;
  return [first.toLowerCase(), ...rest].join('');
}

export function logSpace(arr: string[], str: string): string {
  const longestLength = arr.reduce((a, b) => {
    return b.length > a ? b.length : a;
  }, 0);
  const length = str.length;
  const spaceLength = longestLength - length >= 0 ? longestLength - length : 1;
  return new Array(spaceLength).join(' ');
}

export async function convertResxFileToMap(resxFile: Buffer): Promise<Map<string, string[]>> {
  const resxJsFile = await convertResxToJs(resxFile.toString());

  const localizationKeys = Object.keys(resxJsFile).map((x) => x.split('.'));

  const collected = localizationKeys.map((x) => {
    const [coName, ...restOfKeys] = x;
    return { [coName]: restOfKeys.join('.') };
  });

  return collected.reduce((previousValue, currentValue, currentIndex) => {
    const key = Object.keys(currentValue)[0];
    if (!previousValue.has(key)) {
      const all = collected.filter((x) => Object.keys(x).includes(key)).map((x) => x[key]);
      previousValue.set(key, all);
      return previousValue;
    }
    return previousValue;
  }, new Map<string, string[]>());
}

export function getArguments() {
  const args: Record<string, string> = {};
  process.argv.slice(2, process.argv.length).forEach((arg) => {
    // long arg
    if (arg.slice(0, 2) === '--') {
      const longArg = arg.split('=');
      const longArgFlag = longArg[0].slice(2, longArg[0].length);
      args[longArgFlag] = longArg.length > 1 ? longArg[1] : 'true';
    }
  });
  return args;
}
