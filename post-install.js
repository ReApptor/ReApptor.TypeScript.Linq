const fs = require("fs");
//const pl = require("date-fns/locale/pl");

//const fileToEditPath = './node_modules/@nrwl/web/src/executors/package/package.impl.js';
const fileToEditPath = './node_modules/@nrwl/rollup/src/executors/rollup/rollup.impl.js';

const indent = '                    ';

//const typescriptImport = 'const typescript = require(\'rollup-plugin-typescript2\');';
//const typescriptImport = 'require(\'rollup-plugin-typescript2\')';

//const tsNameOfImport = 'const tsNameOf = require(\'ts-nameof\');';

const tsNameOfPluginName = `require('ts-nameof')`;
//const defaultImport = `${typescriptImport}`
//const replaceImport = `${typescriptImport}\n${tsNameOfImport}`

const tsNameOfRollupOption = `transformers: [() => ({ before: [ ${tsNameOfPluginName} ], after: [  ] })]`;

const defaultCode = `tsconfig: options.tsConfig,\n${indent}tsconfigOverride`;
const replaceCode = `tsconfig: options.tsConfig,\n${indent}${tsNameOfRollupOption},\n${indent}tsconfigOverride`

if (!fs.existsSync(fileToEditPath)) {
    console.error(`cannot check for ts-nameof plugin installation. ${fileToEditPath} cannot be found. is node_modules correctly installed?`);
    return;
}

console.error(`File = ${fileToEditPath}.`);


let fileToEdit = fs.readFileSync(fileToEditPath).toString();

const hasNameOfPlugin = fileToEdit.includes(tsNameOfPluginName);
//const hasNameOfImport = fileToEdit.includes(tsNameOfImport);

// if (hasNameOfImport) {
//     console.log('ts-nameof import is already in place');
// }

// if (!hasNameOfImport) {
//     const hasTypescriptImport = fileToEdit.includes(typescriptImport);
//
//     if (!hasTypescriptImport) {
//         console.warn(`Can not find the import for rollup-plugin-typescript2 to add ts-nameof import, 
//         try reinstalling node_modules and if that didn't work it means this script needs some update`);
//
//         return;
//     }
//
//     fileToEdit = fileToEdit.replace(defaultImport, replaceImport);
//
//     console.log('ts-nameof import added');
//
//     fs.writeFileSync(fileToEditPath, fileToEdit);
// }


if (hasNameOfPlugin) {
    console.log('ts-nameof plugin is already in place');
}

if (!hasNameOfPlugin) {
    const hasNameOfPlaceHolder = fileToEdit.includes(defaultCode);

    if (!hasNameOfPlaceHolder) {
        console.warn(`Can not find the placeholder for nameof plugin, 
        try reinstalling node_modules and if that didn't work it means this script needs some update`);
        return;
    }
    fileToEdit = fileToEdit.replace(defaultCode, replaceCode);

    console.log('ts-nameof plugin added');

    fs.writeFileSync(fileToEditPath, fileToEdit);
}
