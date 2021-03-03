import fs from 'fs';
import path from 'path';

export abstract class FsUtilities {
  public static listAllNestedFiles(directory: string): string[] {
    if (!FsUtilities.isDirectory(directory)) {
      return [directory];
    }

    return FsUtilities.readDirectory(directory)
      .map((nestedDir) => {
        return FsUtilities.listAllNestedFiles(nestedDir);
      })
      .reduce((prev, curr) => {
        return [...prev, ...curr];
      }, []);
  }

  public static listAllTsAndTsxFiles(directory: string, exclude?: string): string[] {
    const allFiles = FsUtilities.listAllNestedFiles(directory);
    return allFiles
      .filter((x) => (x.endsWith('.ts') || x.endsWith('.tsx')) && !x.endsWith('.d.ts'))
      .filter((x) => (exclude ? !x.endsWith(exclude) : x));
  }

  public static isDirectory(directory: string) {
    return fs.lstatSync(directory).isDirectory();
  }

  public static readDirectory(directory: string): string[] {
    try {
      const nested = fs.readdirSync(directory);
      return nested.map((x) => path.resolve(directory, x));
    } catch (e) {
      console.log('readDirectory: directory: ', directory);
      throw new Error('readDirectory: ' + e);
    }
  }
}
