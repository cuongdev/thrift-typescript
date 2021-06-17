"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const errors_1 = require("../errors");
const utils_1 = require("../utils");
function resolveConstValue(value, expectedType, context) {
    switch (value.type) {
        case thrift_parser_1.SyntaxType.IntConstant:
            if (expectedType.type === thrift_parser_1.SyntaxType.BoolKeyword) {
                if (value.value.value === '1' || value.value.value === '0') {
                    return thrift_parser_1.createBooleanLiteral(value.value.value === '1', value.loc);
                }
                else {
                    throw new errors_1.ValidationError(`Can only assign booleans to the int values '1' or '0'`, value.loc);
                }
            }
            else {
                return value;
            }
        case thrift_parser_1.SyntaxType.Identifier:
            const [head, ...tail] = value.value.split('.');
            if (context.currentNamespace.exports[head]) {
                const statement = context.currentNamespace.exports[head];
                if (statement.type === thrift_parser_1.SyntaxType.ConstDefinition) {
                    return resolveConstValue(statement.initializer, expectedType, context);
                }
                else {
                    return value;
                }
            }
            else {
                const nextNamespacePath = context.currentNamespace.includedNamespaces[head];
                if (nextNamespacePath !== undefined) {
                    const nextNamespace = context.namespaceMap[nextNamespacePath.accessor];
                    return resolveConstValue(utils_1.stubIdentifier(tail.join('.')), expectedType, {
                        currentNamespace: nextNamespace,
                        namespaceMap: context.namespaceMap,
                    });
                }
            }
            throw new errors_1.ValidationError(`Unable to resolve value of identifier[${value.value}]`, value.loc);
        case thrift_parser_1.SyntaxType.ConstMap:
            return {
                type: thrift_parser_1.SyntaxType.ConstMap,
                properties: value.properties.map((next) => {
                    return {
                        type: thrift_parser_1.SyntaxType.PropertyAssignment,
                        name: resolveConstValue(next.name, expectedType, context),
                        initializer: resolveConstValue(next.initializer, expectedType, context),
                        loc: next.loc,
                    };
                }),
                loc: value.loc,
            };
        case thrift_parser_1.SyntaxType.ConstList:
            return {
                type: thrift_parser_1.SyntaxType.ConstList,
                elements: value.elements.map((next) => {
                    return resolveConstValue(next, expectedType, context);
                }),
                loc: value.loc,
            };
        default:
            return value;
    }
}
exports.resolveConstValue = resolveConstValue;
//# sourceMappingURL=resolveConstValue.js.map