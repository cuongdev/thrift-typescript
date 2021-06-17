"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const utils_1 = require("./struct/utils");
const union_fields_1 = require("./union/union-fields");
const resolver_1 = require("../../resolver");
const utils_2 = require("../shared/utils");
function renderStrictInterfaceReexport(id, definition, node, state) {
    if (id.pathName !== undefined) {
        return ts.createTypeAliasDeclaration(undefined, utils_1.tokens(true), utils_1.strictName(node.name.value, definition.type, state), undefined, ts.createTypeReferenceNode(utils_1.strictName(id.rawName, definition.type, state), undefined));
    }
    else {
        return ts.createExportDeclaration([], [], ts.createNamedExports([
            ts.createExportSpecifier(ts.createIdentifier(`${utils_1.strictName(id.rawName, definition.type, state)}`), ts.createIdentifier(utils_1.strictName(node.name.value, definition.type, state))),
        ]), undefined);
    }
}
function renderLooseInterfaceReexport(id, definition, node, state) {
    if (id.pathName !== undefined) {
        return ts.createTypeAliasDeclaration(undefined, utils_1.tokens(true), utils_1.looseName(node.name.value, definition.type, state), undefined, ts.createTypeReferenceNode(utils_1.looseName(id.rawName, definition.type, state), undefined));
    }
    else {
        return ts.createExportDeclaration([], [], ts.createNamedExports([
            ts.createExportSpecifier(ts.createIdentifier(`${utils_1.looseName(id.rawName, definition.type, state)}`), ts.createIdentifier(utils_1.looseName(node.name.value, definition.type, state))),
        ]), undefined);
    }
}
function renderClassReexport(id, node, state) {
    if (id.pathName !== undefined) {
        return ts.createVariableStatement(utils_1.tokens(true), utils_2.createConst(utils_1.className(node.name.value, state), undefined, ts.createIdentifier(utils_1.className(id.rawName, state))));
    }
    else {
        return ts.createExportDeclaration([], [], ts.createNamedExports([
            ts.createExportSpecifier(ts.createIdentifier(`${utils_1.className(id.rawName, state)}`), ts.createIdentifier(utils_1.className(node.name.value, state))),
        ]), undefined);
    }
}
function renderUnionReexport(id, node, state) {
    if (id.pathName !== undefined) {
        return ts.createTypeAliasDeclaration(undefined, utils_1.tokens(true), utils_1.className(node.name.value, state), undefined, ts.createTypeReferenceNode(utils_1.className(id.rawName, state), undefined));
    }
    else {
        return ts.createExportDeclaration([], [], ts.createNamedExports([
            ts.createExportSpecifier(ts.createIdentifier(`${utils_1.className(id.rawName, state)}`), ts.createIdentifier(utils_1.className(node.name.value, state))),
        ]), undefined);
    }
}
function renderToolkitReexport(id, definition, node, state) {
    if (id.pathName !== undefined) {
        return ts.createVariableStatement(utils_1.tokens(true), utils_2.createConst(utils_1.toolkitName(node.name.value, state), undefined, ts.createIdentifier(utils_1.toolkitName(id.rawName, state))));
    }
    else {
        return ts.createExportDeclaration([], [], ts.createNamedExports([
            ts.createExportSpecifier(ts.createIdentifier(`${utils_1.toolkitName(id.rawName, state)}`), ts.createIdentifier(utils_1.toolkitName(node.name.value, state))),
        ]), undefined);
    }
}
function renderUnionTypeReexport(id, node, state) {
    if (id.pathName !== undefined) {
        return ts.createTypeAliasDeclaration(undefined, utils_1.tokens(true), union_fields_1.renderUnionTypeName(node.name.value, state), undefined, ts.createTypeReferenceNode(union_fields_1.renderUnionTypeName(id.rawName, state), undefined));
    }
    else {
        return ts.createExportDeclaration([], [], ts.createNamedExports([
            ts.createExportSpecifier(ts.createIdentifier(`${union_fields_1.renderUnionTypeName(id.rawName, state)}`), ts.createIdentifier(union_fields_1.renderUnionTypeName(node.name.value, state))),
        ]), undefined);
    }
}
function renderUnionInterfaceReexports(id, union, node, strict) {
    if (id.pathName !== undefined) {
        return union.fields.map((next) => {
            return ts.createTypeAliasDeclaration(undefined, utils_1.tokens(true), union_fields_1.fieldInterfaceName(node.name.value, next.name.value, strict), undefined, ts.createTypeReferenceNode(`${id.pathName}.${union_fields_1.fieldInterfaceName(union.name.value, next.name.value, strict)}`, undefined));
        });
    }
    else {
        return union.fields.map((next) => {
            return ts.createExportDeclaration([], [], ts.createNamedExports([
                ts.createExportSpecifier(ts.createIdentifier(`${union_fields_1.fieldInterfaceName(union.name.value, next.name.value, strict)}`), ts.createIdentifier(union_fields_1.fieldInterfaceName(node.name.value, next.name.value, strict))),
            ]));
        });
    }
}
function renderUnionArgsReexport(id, node, state) {
    if (id.pathName !== undefined) {
        return ts.createTypeAliasDeclaration(undefined, utils_1.tokens(true), union_fields_1.unionTypeName(node.name.value, state, false), undefined, ts.createTypeReferenceNode(union_fields_1.unionTypeName(id.rawName, state, false), undefined));
    }
    else {
        return ts.createExportDeclaration([], [], ts.createNamedExports([
            ts.createExportSpecifier(ts.createIdentifier(`${union_fields_1.unionTypeName(id.rawName, state, false)}`), ts.createIdentifier(union_fields_1.unionTypeName(node.name.value, state, false))),
        ]), undefined);
    }
}
function renderTypeDefForIdentifier(resolvedIdentifier, definition, node, typeMapping, state) {
    switch (definition.type) {
        case thrift_parser_1.SyntaxType.UnionDefinition:
            if (state.options.strictUnions) {
                return [
                    renderUnionTypeReexport(resolvedIdentifier, node, state),
                    renderUnionReexport(resolvedIdentifier, node, state),
                    ...renderUnionInterfaceReexports(resolvedIdentifier, definition, node, true),
                    renderUnionArgsReexport(resolvedIdentifier, node, state),
                    ...renderUnionInterfaceReexports(resolvedIdentifier, definition, node, false),
                    renderToolkitReexport(resolvedIdentifier, definition, node, state),
                ];
            }
            else {
            }
        case thrift_parser_1.SyntaxType.ExceptionDefinition:
        case thrift_parser_1.SyntaxType.StructDefinition:
            return [
                renderStrictInterfaceReexport(resolvedIdentifier, definition, node, state),
                renderLooseInterfaceReexport(resolvedIdentifier, definition, node, state),
                renderClassReexport(resolvedIdentifier, node, state),
                renderToolkitReexport(resolvedIdentifier, definition, node, state),
            ];
        case thrift_parser_1.SyntaxType.ConstDefinition:
            return [
                ts.createVariableStatement(utils_1.tokens(true), utils_2.createConst(node.name.value, undefined, ts.createIdentifier(resolvedIdentifier.fullName))),
            ];
        case thrift_parser_1.SyntaxType.EnumDefinition:
            return [
                ts.createVariableStatement(utils_1.tokens(true), utils_2.createConst(node.name.value, undefined, ts.createIdentifier(resolvedIdentifier.fullName))),
                ts.createTypeAliasDeclaration(undefined, utils_1.tokens(true), node.name.value, undefined, ts.createTypeReferenceNode(resolvedIdentifier.fullName, undefined)),
            ];
        default:
            return [
                ts.createTypeAliasDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], node.name.value, undefined, typeMapping(node.definitionType, state)),
            ];
    }
}
function renderTypeDef(node, typeMapping, state) {
    switch (node.definitionType.type) {
        case thrift_parser_1.SyntaxType.Identifier:
            const resolvedIdentifier = resolver_1.Resolver.resolveIdentifierName(node.definitionType.value, {
                currentNamespace: state.currentNamespace,
                currentDefinitions: state.currentDefinitions,
                namespaceMap: state.project.namespaces,
            });
            const result = resolver_1.Resolver.resolveIdentifierDefinition(node.definitionType, {
                currentNamespace: state.currentNamespace,
                namespaceMap: state.project.namespaces,
            });
            return renderTypeDefForIdentifier(resolvedIdentifier, result.definition, node, typeMapping, state);
        default:
            return [
                ts.createTypeAliasDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], node.name.value, undefined, typeMapping(node.definitionType, state)),
            ];
    }
}
exports.renderTypeDef = renderTypeDef;
//# sourceMappingURL=typedef.js.map