"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const defaults_1 = require("../defaults");
const utils_1 = require("../utils");
function resolveOptions(args) {
    const len = args.length;
    let index = 0;
    const options = utils_1.deepCopy(defaults_1.DEFAULT_OPTIONS);
    while (index < len) {
        const next = args[index];
        switch (next) {
            case '--rootDir':
                options.rootDir = args[index + 1];
                try {
                    if (fs_1.lstatSync(options.rootDir).isDirectory()) {
                        index += 2;
                        break;
                    }
                    else {
                        throw new Error(`Provided root directory "${options.rootDir}" isn't a directory`);
                    }
                }
                catch (e) {
                    throw new Error(`Provided root directory "${options.rootDir}" doesn't exist`);
                }
            case '--sourceDir':
                options.sourceDir = args[index + 1];
                index += 2;
                break;
            case '--outDir':
                options.outDir = args[index + 1];
                index += 2;
                break;
            case '--target':
                const option = args[index + 1];
                if (option === 'apache' || option === 'thrift-server') {
                    options.target = option;
                }
                else {
                    throw new Error(`Unsupported target: ${option}`);
                }
                index += 2;
                break;
            case '--library':
                options.library = args[index + 1];
                index += 2;
            case '--fallbackNamespace':
                options.fallbackNamespace = args[index + 1];
                index += 2;
                break;
            case '--strictUnions':
                options.strictUnions = true;
                index += 1;
                break;
            case '--strictUnionsComplexNames':
                options.strictUnionsComplexNames = true;
                index += 1;
                break;
            case '--withNameField':
                options.withNameField = true;
                index += 1;
                break;
            default:
                if (next.startsWith('--')) {
                    throw new Error(`Unknown option provided to generator "${next}"`);
                }
                else {
                    options.files.push(next);
                    index += 1;
                }
        }
    }
    return utils_1.deepMerge(options, {
        library: defaults_1.defaultLibrary(options),
    });
}
exports.resolveOptions = resolveOptions;
//# sourceMappingURL=resolveOptions.js.map