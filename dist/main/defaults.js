"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.DEFAULT_APACHE_LIB = 'thrift';
exports.DEFAULT_THRIFT_SERVER_LIB = '@creditkarma/thrift-server-core';
exports.DEFAULT_OPTIONS = {
    rootDir: '.',
    outDir: './codegen',
    sourceDir: './thrift',
    target: 'apache',
    library: exports.DEFAULT_APACHE_LIB,
    files: [],
    strictUnions: false,
    strictUnionsComplexNames: false,
    fallbackNamespace: 'java',
    withNameField: false,
};
function defaultLibrary(options) {
    if (options.target === 'thrift-server' &&
        (!options.library || options.library === exports.DEFAULT_APACHE_LIB)) {
        return exports.DEFAULT_THRIFT_SERVER_LIB;
    }
    else if (options.library) {
        return options.library;
    }
    else {
        return exports.DEFAULT_APACHE_LIB;
    }
}
exports.defaultLibrary = defaultLibrary;
function mergeWithDefaults(options) {
    options.library = defaultLibrary(options);
    return utils_1.deepMerge(exports.DEFAULT_OPTIONS, options);
}
exports.mergeWithDefaults = mergeWithDefaults;
//# sourceMappingURL=defaults.js.map