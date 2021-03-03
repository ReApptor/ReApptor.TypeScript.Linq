import resx, { ObjectOfStrings } from 'resx';

export abstract class ResxUtilities {
  public static async convertResxFileToMap(resxFile: Buffer): Promise<Map<string, string[]>> {
    const resxJsFile = await ResxUtilities.convertResxToJs(resxFile.toString());

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

  public static convertResxToJs(resxFile: string): Promise<ObjectOfStrings> {
    return new Promise((resolve, reject) => {
      resx.resx2js(resxFile, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }
}
