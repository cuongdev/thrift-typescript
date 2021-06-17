"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const resolveIdentifierDefinition_1 = require("./resolveIdentifierDefinition");
function identifiersForFieldType(fieldType, results, context, resolveTypedefs = false) {
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.Identifier:
            if (resolveTypedefs) {
                const result = resolveIdentifierDefinition_1.resolveIdentifierDefinition(fieldType, {
                    currentNamespace: context.currentNamespace,
                    namespaceMap: context.namespaceMap,
                });
                const definition = result.definition;
                if (definition.type === thrift_parser_1.SyntaxType.TypedefDefinition) {
                    identifiersForFieldType(definition.definitionType, results, context);
                }
            }
            results.add(fieldType.value);
            break;
        case thrift_parser_1.SyntaxType.MapType:
            identifiersForFieldType(fieldType.keyType, results, context);
            identifiersForFieldType(fieldType.valueType, results, context);
            break;
        case thrift_parser_1.SyntaxType.SetType:
        case thrift_parser_1.SyntaxType.ListType:
            identifiersForFieldType(fieldType.valueType, results, context);
            break;
    }
}
function identifiersForConstValue(constValue, results) {
    if (constValue !== null) {
        switch (constValue.type) {
            case thrift_parser_1.SyntaxType.Identifier:
                results.add(constValue.value);
                break;
            case thrift_parser_1.SyntaxType.ConstList:
                constValue.elements.forEach((next) => {
                    identifiersForConstValue(next, results);
                });
                break;
            case thrift_parser_1.SyntaxType.ConstMap:
                constValue.properties.forEach((next) => {
                    identifiersForConstValue(next.name, results);
                    identifiersForConstValue(next.initializer, results);
                });
        }
    }
}
function identifiersForStatements(statements, context) {
    const results = new Set();
    statements.forEach((next) => {
        switch (next.type) {
            case thrift_parser_1.SyntaxType.IncludeDefinition:
            case thrift_parser_1.SyntaxType.CppIncludeDefinition:
            case thrift_parser_1.SyntaxType.NamespaceDefinition:
            case thrift_parser_1.SyntaxType.EnumDefinition:
                break;
            case thrift_parser_1.SyntaxType.ConstDefinition:
                identifiersForFieldType(next.fieldType, results, context);
                identifiersForConstValue(next.initializer, results);
                break;
            case thrift_parser_1.SyntaxType.TypedefDefinition:
                identifiersForFieldType(next.definitionType, results, context);
                break;
            case thrift_parser_1.SyntaxType.StructDefinition:
            case thrift_parser_1.SyntaxType.UnionDefinition:
            case thrift_parser_1.SyntaxType.ExceptionDefinition:
                next.fields.forEach((field) => {
                    identifiersForFieldType(field.fieldType, results, context, true);
                    identifiersForConstValue(field.defaultValue, results);
                });
                break;
            case thrift_parser_1.SyntaxType.ServiceDefinition:
                if (next.extends) {
                    results.add(next.extends.value);
                }
                next.functions.forEach((func) => {
                    func.fields.forEach((field) => {
                        identifiersForFieldType(field.fieldType, results, context, true);
                        identifiersForConstValue(field.defaultValue, results);
                    });
                    func.throws.forEach((field) => {
                        identifiersForFieldType(field.fieldType, results, context, true);
                        identifiersForConstValue(field.defaultValue, results);
                    });
                    identifiersForFieldType(func.returnType, results, context, true);
                });
                break;
            default:
                const _exhaustiveCheck = next;
                throw new Error(`Non-exhaustive match for ${_exhaustiveCheck}`);
        }
    });
    return Array.from(results);
}
exports.identifiersForStatements = identifiersForStatements;
//# sourceMappingURL=identifiersForStatements.js.map