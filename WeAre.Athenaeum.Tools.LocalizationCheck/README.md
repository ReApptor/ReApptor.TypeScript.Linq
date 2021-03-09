# WeAreAthenaeum.Tools.LocalizationCheck


### See what localizations are unused in resources file.

##### create a npm package: 
    npm init -y

##### Install localization check package and it's dependencies: 
    npm i @weare/localization-check typescript ts-node 


##### Create a `config.ts` file: 
    import { Configuration, TypescriptLocalizationPrefix } from "@weare/localization-check";

    const configuration: Configuration = {
    logSearchStrings: false,
    resources: [],
    typescriptLocalizationPrefix: TypescriptLocalizationPrefix.LOCALIZER,
    cSharpDirectories: [],
    typescriptComponentsDirectories: [],
    enumsToKeep: [],
    };
    
    export default configuration;

##### Add check:localization script to package.json: 
    "scripts": {
        "check:localization": "weare-check-localization"
    }


##### And run `npm run check:localization` or `npx weare-localization-check` : 


if there was no warnings example below will be shown: 


    Listing files ...
    Reading files ...
    Checking files ...
     
    ------
    Example:
    Localization :  TopNav.Account
    TS Getter    :  Localizer.topNavAccount
    TS Constant  :  Localizer.topNavAccountLanguageItemName
    C# Constant  :  SharedResources.TopNavAccount
    ------
    
    No Warnings! Good to go.
