"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const resolver_1 = require("../../resolver");
function renderTypeDefForIdentifier(id, node) {
    return [
        ts.createImportEqualsDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], ts.createIdentifier(node.name.value), ts.createIdentifier(id.fullName)),
    ];
}
function renderTypeDef(node, typeMapping, state) {
    switch (node.definitionType.type) {
        case thrift_parser_1.SyntaxType.Identifier:
            return renderTypeDefForIdentifier(resolver_1.Resolver.resolveIdentifierName(node.definitionType.value, {
                currentNamespace: state.currentNamespace,
                currentDefinitions: state.currentDefinitions,
                namespaceMap: state.project.namespaces,
            }), node);
        default:
            return [
                ts.createTypeAliasDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], node.name.value, undefined, typeMapping(node.definitionType, state)),
            ];
    }
}
exports.renderTypeDef = renderTypeDef;
//# sourceMappingURL=typedef.js.map