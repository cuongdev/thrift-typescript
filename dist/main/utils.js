"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const glob = require("glob");
function valuesForObject(obj) {
    return Object.keys(obj).map((next) => {
        return obj[next];
    });
}
exports.valuesForObject = valuesForObject;
function deepCopy(obj) {
    const newObj = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === 'object') {
                if (value === null) {
                    newObj[key] = null;
                }
                else {
                    newObj[key] = deepCopy(value);
                }
            }
            else {
                newObj[key] = value;
            }
        }
    }
    return newObj;
}
exports.deepCopy = deepCopy;
function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}
function deepMerge(base, update) {
    const newObj = Array.isArray(base) ? [] : {};
    const baseKeys = Object.keys(base);
    const updateKeys = Object.keys(update);
    for (const key of updateKeys) {
        if (baseKeys.indexOf(key) === -1) {
            baseKeys.push(key);
        }
    }
    for (const key of baseKeys) {
        if (base.hasOwnProperty(key) || update.hasOwnProperty(key)) {
            const baseValue = base[key];
            const updateValue = update[key];
            if (isObject(baseValue) && isObject(updateValue)) {
                newObj[key] = deepMerge(baseValue, updateValue);
            }
            else if (updateValue !== undefined) {
                newObj[key] = updateValue;
            }
            else {
                newObj[key] = baseValue;
            }
        }
    }
    return newObj;
}
exports.deepMerge = deepMerge;
function collectSourceFiles(sourceDir, files) {
    if (files && files.length > 0) {
        return files;
    }
    else {
        return glob.sync(`${sourceDir}/**/*.thrift`);
    }
}
exports.collectSourceFiles = collectSourceFiles;
function stubIdentifier(value) {
    return {
        type: thrift_parser_1.SyntaxType.Identifier,
        value,
        annotations: undefined,
        loc: emptyLocation(),
    };
}
exports.stubIdentifier = stubIdentifier;
function emptyLocation() {
    return {
        start: { line: 0, column: 0, index: 0 },
        end: { line: 0, column: 0, index: 0 },
    };
}
exports.emptyLocation = emptyLocation;
//# sourceMappingURL=utils.js.map