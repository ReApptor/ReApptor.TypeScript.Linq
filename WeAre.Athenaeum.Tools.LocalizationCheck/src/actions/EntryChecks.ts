import path from "path";
import FsUtilities from "../utilities/FsUtilities";
import chalk from "chalk";
import { Configuration } from "../types";

export abstract class EntryChecks {
    static checkDirectories(config: Configuration): { typescriptDirectories: string[]; cSharpDirectories: string[] } {
        console.log("Process spawned at: ", process.cwd());

        const typescriptDirectories = config.typescriptComponentsDirectories.map((dir) => {
            return dir.startsWith(".") ? path.resolve(process.cwd(), dir) : dir;
        });

        const cSharpDirectories = config.cSharpDirectories.map((dir) => {
            return dir.startsWith(".") ? path.resolve(process.cwd(), dir) : dir;
        });

        console.log("typescriptDirectories: ", typescriptDirectories);
        console.log("cSharpDirectories:     ", cSharpDirectories);

        if (typescriptDirectories.map((dir) => FsUtilities.isDirectory(dir)).includes(false)) {
            console.log(chalk.red(`typescriptComponentsDirectories should be directories`));
            process.exit(1);
        }

        if (cSharpDirectories.map((dir) => FsUtilities.isDirectory(dir)).includes(false)) {
            console.log(chalk.red(`cSharpDirectories should be directories`));
            process.exit(1);
        }

        return { typescriptDirectories, cSharpDirectories };
    }

    static checkFiles(config: Configuration): { resourcePaths: string[] } {
        const resourcePaths = config.resources.map((dir) => {
            return dir.startsWith(".") ? path.resolve(process.cwd(), dir) : dir;
        });

        console.log("resources:             ", resourcePaths);

        if (resourcePaths.map((dir) => FsUtilities.isFile(dir)).includes(false)) {
            console.log(chalk.red(`resources should be files`));
            process.exit(1);
        }

        return { resourcePaths };
    }
}
