"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const errors_1 = require("../errors");
const utils_1 = require("../utils");
function resolveIdentifierDefinition(id, context) {
    if (context.currentNamespace.exports[id.value]) {
        const definition = context.currentNamespace.exports[id.value];
        if (definition.type === thrift_parser_1.SyntaxType.TypedefDefinition) {
            if (definition.definitionType.type === thrift_parser_1.SyntaxType.Identifier) {
                return resolveIdentifierDefinition(definition.definitionType, context);
            }
            else {
                return {
                    definition,
                    namespace: context.currentNamespace,
                };
            }
        }
        else {
            return {
                definition,
                namespace: context.currentNamespace,
            };
        }
    }
    else {
        const [head, ...tail] = id.value.split('.');
        const namespace = context.currentNamespace.includedNamespaces[head];
        if (context.currentNamespace.includedNamespaces[head]) {
            const nextNamespace = context.namespaceMap[namespace.accessor];
            return resolveIdentifierDefinition(utils_1.stubIdentifier(tail.join('.')), {
                currentNamespace: nextNamespace,
                namespaceMap: context.namespaceMap,
            });
        }
        else if (context.currentNamespace.namespaceIncludes[head]) {
            const accessor = context.currentNamespace.namespaceIncludes[head];
            const nextNamespace = context.namespaceMap[accessor];
            return resolveIdentifierDefinition(utils_1.stubIdentifier(tail.join('.')), {
                currentNamespace: nextNamespace,
                namespaceMap: context.namespaceMap,
            });
        }
        else {
            throw new errors_1.ValidationError(`Unable to resolve identifier[${id.value}] in namespace[${context.currentNamespace.namespace.path}]`, id.loc);
        }
    }
}
exports.resolveIdentifierDefinition = resolveIdentifierDefinition;
//# sourceMappingURL=resolveIdentifierDefinition.js.map