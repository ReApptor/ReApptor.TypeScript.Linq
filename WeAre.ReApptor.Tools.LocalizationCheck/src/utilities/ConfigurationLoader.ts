import rechoir from "rechoir";
import interpret from "interpret";
import getopts from "getopts";
import path from "path";
import { existsSync } from "fs";
import escaladeSync from "escalade/sync";
import { Configuration } from "../types";

export default abstract class ConfigurationLoader {
    static filetypes = ["js", "ts"];
    static configurationFileName = "config";

    static loadConfiguration(): Configuration {
        const argv = getopts(process.argv.slice(2));
        const cwd = argv.config ? path.dirname(path.resolve(argv.config)) : process.cwd();
        console.log("cwd:        ", cwd);

        const configPath = argv.config && existsSync(argv.config) ? path.resolve(argv.config) : this.findUpConfig(cwd, this.configurationFileName, this.filetypes);
        console.log("configPath: ", configPath);

        if (configPath) {
            const autoloads = rechoir.prepare(interpret.jsVariants, configPath, cwd);
            console.log("autoloads:  ", autoloads);

            if (autoloads) {
                console.log("Loading config file at: ", configPath);
                return require(configPath).default;
            } else {
                throw new Error(`Config file ${configPath} could not be loaded.`);
            }
        }

        if (!argv.config) {
            throw new Error(`Config file ${this.configurationFileName} could not be found please pass argument --config [configFilePath]`);
        } else {
            throw new Error(`Config file ${configPath} could not be found`);
        }
    }

    static findUpConfig(cwd: string, name: string, extensions: string[]) {
        return escaladeSync(cwd, (dir, names) => {
            for (const ext of extensions) {
                const filename = `${name}.${ext}`;
                if (names.includes(filename)) {
                    return filename;
                }
            }
            return false;
        });
    }
}
