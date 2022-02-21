import {Configuration} from "../types";
import path from "path";
import FsUtilities from "../utilities/FsUtilities";
import {ResxUtilities} from "../utilities/ResxUtilities";

export async function DeleteLocalizations(config: Configuration, idsToRemove: string[]) {
    config.resources.map(x => {
        
        const resourceDirectory = path.dirname(x);
        
        const resourceCulturesPaths = FsUtilities.listAllResourceCultures(resourceDirectory);
        
        idsToRemove.map(localization => {
            console.log(`Removing : "${localization}"`);
            resourceCulturesPaths.map(x => ResxUtilities.deleteLocalizationFromResourceFile(x, localization));
        });
    });

}