"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
function resolveIdentifierName(name, context) {
    const currentNamespace = context.currentNamespace;
    const [pathName, base, ...tail] = name.split('.');
    let baseName = pathName;
    if (base !== undefined) {
        baseName = [base, ...tail].join('.');
    }
    if (currentNamespace.exports[pathName]) {
        if (context.currentDefinitions &&
            context.currentDefinitions[pathName]) {
            return {
                rawName: name,
                name: pathName,
                baseName,
                pathName: undefined,
                fullName: name,
            };
        }
        else {
            const def = currentNamespace.exports[pathName];
            let rootName = pathName;
            if (def.type === thrift_parser_1.SyntaxType.ConstDefinition) {
                rootName = '__CONSTANTS__';
            }
            if (def.type === thrift_parser_1.SyntaxType.ServiceDefinition) {
                return {
                    rawName: name,
                    name: pathName,
                    baseName,
                    pathName: rootName,
                    fullName: `${rootName}`,
                };
            }
            return {
                rawName: name,
                name: pathName,
                baseName,
                pathName: rootName,
                fullName: `${rootName}.${name}`,
            };
        }
    }
    const namespace = currentNamespace.includedNamespaces[pathName];
    if (namespace !== undefined) {
        return {
            rawName: name,
            name: base,
            baseName,
            pathName,
            fullName: name,
        };
    }
    if (base === undefined) {
        return {
            rawName: name,
            name: pathName,
            baseName,
            pathName: undefined,
            fullName: name,
        };
    }
    throw new Error(`Unable to resolve identifier[${name}]`);
}
exports.resolveIdentifierName = resolveIdentifierName;
//# sourceMappingURL=resolveIdentifierName.js.map