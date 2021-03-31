import resx, { ObjectOfStrings } from "resx";
import fs from "fs";

export abstract class ResxUtilities {
    public static async convertResxFileToMap(resxFile: Buffer): Promise<Map<string, string[]>> {
        const resxJsFile = await ResxUtilities.convertResxToJs(resxFile.toString());

        const localizationKeys = Object.keys(resxJsFile).map((x) => x.split("."));

        const collected = localizationKeys.map((x) => {
            const [coName, ...restOfKeys] = x;
            return { [coName]: restOfKeys.join(".") };
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

    public static deleteLocalizationFromResourceFile(resourcePath: string, keyToRemove: string): void {
        const trimmedKey = keyToRemove.replace('"', '').replace('"', '')
        
        const dataTag = `<data name="${trimmedKey}"` 
        const dataCloseTag = "</data>";

        const resource = fs.readFileSync(resourcePath).toString();

        const startIndex = resource.indexOf(dataTag);
        const stopIndex = resource.indexOf(dataCloseTag, startIndex) + dataCloseTag.length;
        
        if (startIndex === -1) {
            console.log(`Could not find "${trimmedKey}" in ${resourcePath.substring(resourcePath.lastIndexOf('/') + 1)}`);
            return;
        }


        console.log("removing: ", trimmedKey);

        const slice = resource.slice(startIndex, stopIndex);
        let updated = resource.replace(slice, "");

        const nextStartTag = updated.indexOf('<data', startIndex);

        if (nextStartTag !== -1) {
            console.log('removing empty space');
            updated = updated.slice(0, startIndex) + updated.slice(nextStartTag)
        }

        fs.writeFileSync(resourcePath, updated);
    }

    public static convertJsToResx() {}
}
