"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const resolver_1 = require("../../resolver");
const identifiers_1 = require("./identifiers");
function fieldTypeUsesThrift(fieldType) {
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.I64Keyword:
            return true;
        case thrift_parser_1.SyntaxType.MapType:
            return (fieldTypeUsesThrift(fieldType.keyType) ||
                fieldTypeUsesThrift(fieldType.valueType));
        case thrift_parser_1.SyntaxType.ListType:
        case thrift_parser_1.SyntaxType.SetType:
            return fieldTypeUsesThrift(fieldType.valueType);
        default:
            return false;
    }
}
function statementUsesThrift(statement) {
    switch (statement.type) {
        case thrift_parser_1.SyntaxType.StructDefinition:
        case thrift_parser_1.SyntaxType.UnionDefinition:
        case thrift_parser_1.SyntaxType.ExceptionDefinition:
        case thrift_parser_1.SyntaxType.ServiceDefinition:
            return true;
        case thrift_parser_1.SyntaxType.NamespaceDefinition:
        case thrift_parser_1.SyntaxType.IncludeDefinition:
        case thrift_parser_1.SyntaxType.CppIncludeDefinition:
        case thrift_parser_1.SyntaxType.EnumDefinition:
            return false;
        case thrift_parser_1.SyntaxType.ConstDefinition:
            return fieldTypeUsesThrift(statement.fieldType);
        case thrift_parser_1.SyntaxType.TypedefDefinition:
            return fieldTypeUsesThrift(statement.definitionType);
        default:
            const msg = statement;
            throw new Error(`Non-exhaustive match for ${msg}`);
    }
}
function statementUsesInt64(statement) {
    switch (statement.type) {
        case thrift_parser_1.SyntaxType.ServiceDefinition:
            return statement.functions.some((func) => {
                if (func.returnType.type === thrift_parser_1.SyntaxType.I64Keyword) {
                    return true;
                }
                for (const field of func.fields) {
                    if (field.fieldType.type === thrift_parser_1.SyntaxType.I64Keyword) {
                        return true;
                    }
                }
                return false;
            });
        case thrift_parser_1.SyntaxType.StructDefinition:
        case thrift_parser_1.SyntaxType.UnionDefinition:
        case thrift_parser_1.SyntaxType.ExceptionDefinition:
            return statement.fields.some((field) => {
                return field.fieldType.type === thrift_parser_1.SyntaxType.I64Keyword;
            });
        case thrift_parser_1.SyntaxType.NamespaceDefinition:
        case thrift_parser_1.SyntaxType.IncludeDefinition:
        case thrift_parser_1.SyntaxType.CppIncludeDefinition:
        case thrift_parser_1.SyntaxType.EnumDefinition:
            return false;
        case thrift_parser_1.SyntaxType.ConstDefinition:
            return fieldTypeUsesThrift(statement.fieldType);
        case thrift_parser_1.SyntaxType.TypedefDefinition:
            return fieldTypeUsesThrift(statement.definitionType);
        default:
            const msg = statement;
            throw new Error(`Non-exhaustive match for ${msg}`);
    }
}
function statementsUseThrift(statements) {
    for (const statement of statements) {
        if (statementUsesThrift(statement)) {
            return true;
        }
    }
    return false;
}
exports.statementsUseThrift = statementsUseThrift;
function statementsUseInt64(statements) {
    for (const statement of statements) {
        if (statementUsesInt64(statement)) {
            return true;
        }
    }
    return false;
}
exports.statementsUseInt64 = statementsUseInt64;
function renderThriftImports(thriftLib) {
    return ts.createImportDeclaration(undefined, undefined, ts.createImportClause(undefined, ts.createNamespaceImport(identifiers_1.COMMON_IDENTIFIERS.thrift)), ts.createLiteral(thriftLib));
}
exports.renderThriftImports = renderThriftImports;
function renderIncludes(statements, state) {
    const importedNamespaces = new Set();
    const imports = [];
    const identifiers = resolver_1.Resolver.identifiersForStatements(statements, {
        currentNamespace: state.currentNamespace,
        currentDefinitions: state.currentDefinitions,
        namespaceMap: state.project.namespaces,
    });
    const importedIdentifiers = new Set();
    identifiers.forEach((next) => {
        const [head] = next.split('.');
        if (state.currentNamespace.exports[head] &&
            state.currentDefinitions[head] === undefined &&
            importedIdentifiers.has(head) === false) {
            importedIdentifiers.add(head);
            const def = state.currentNamespace.exports[head];
            let importPath = ts.createLiteral(`./${head}`);
            let importName = head;
            if (def.type === thrift_parser_1.SyntaxType.ConstDefinition) {
                importPath = ts.createLiteral('./constants');
                importName = '__CONSTANTS__';
            }
            imports.push(ts.createImportDeclaration(undefined, undefined, ts.createImportClause(undefined, ts.createNamespaceImport(ts.createIdentifier(importName))), importPath));
        }
        else if (state.currentNamespace.includedNamespaces[head] !== undefined) {
            if (!importedNamespaces.has(head)) {
                importedNamespaces.add(head);
                const includedNamespace = state.currentNamespace.includedNamespaces[head];
                imports.push(ts.createImportDeclaration(undefined, undefined, ts.createImportClause(undefined, ts.createNamespaceImport(ts.createIdentifier(head))), ts.createLiteral(`./${path.relative(path.resolve(state.project.outDir, state.currentNamespace.namespace.path), path.resolve(state.project.outDir, includedNamespace.path))}`)));
            }
        }
    });
    return imports;
}
exports.renderIncludes = renderIncludes;
//# sourceMappingURL=includes.js.map