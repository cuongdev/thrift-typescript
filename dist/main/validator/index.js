"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const errors_1 = require("../errors");
const resolver_1 = require("../resolver");
const utils_1 = require("./utils");
function typeMismatch(expected, actual, loc) {
    const expectedType = utils_1.fieldTypeToString(expected);
    const actualType = utils_1.constToTypeString(actual);
    return new errors_1.ValidationError(`Expected type ${expectedType} but found type ${actualType}`, loc);
}
function validateNamespace(currentNamespace, namespaceMap) {
    const statements = Object.keys(currentNamespace.exports).map((next) => {
        return currentNamespace.exports[next];
    });
    const bodySize = statements.length;
    let currentIndex = 0;
    const errors = [];
    function validateStatements() {
        while (!isAtEnd()) {
            try {
                validateStatement(statements[currentIndex]);
            }
            catch (e) {
                errors.push(errors_1.createValidationError(e.message, e.loc));
            }
            currentIndex += 1;
        }
    }
    function isAtEnd() {
        return currentIndex >= bodySize;
    }
    function validateStatement(statement) {
        switch (statement.type) {
            case thrift_parser_1.SyntaxType.EnumDefinition:
            case thrift_parser_1.SyntaxType.TypedefDefinition:
                break;
            case thrift_parser_1.SyntaxType.ConstDefinition:
                validateValue(statement.fieldType, statement.initializer);
                break;
            case thrift_parser_1.SyntaxType.StructDefinition:
            case thrift_parser_1.SyntaxType.UnionDefinition:
            case thrift_parser_1.SyntaxType.ExceptionDefinition:
                validateFields(statement.fields);
                break;
            case thrift_parser_1.SyntaxType.ServiceDefinition:
                validateExtends(statement.extends);
                break;
            default:
                const msg = statement;
                throw new Error(`Non-exhaustive match for ${msg}`);
        }
    }
    function validateExtends(id) {
        if (id !== null) {
            const result = resolver_1.Resolver.resolveIdentifierDefinition(id, {
                currentNamespace,
                namespaceMap,
            });
            const definition = result.definition;
            if (definition.type !== thrift_parser_1.SyntaxType.ServiceDefinition) {
                throw new errors_1.ValidationError(`Service type expected but found type ${definition.type}`, id.loc);
            }
        }
    }
    function validateFields(fields) {
        fields.forEach((field) => {
            if (field.defaultValue !== null) {
                validateValue(field.fieldType, field.defaultValue);
            }
        });
    }
    function validateEnum(enumDef, constValue) {
        if (constValue.type !== thrift_parser_1.SyntaxType.Identifier &&
            constValue.type !== thrift_parser_1.SyntaxType.IntConstant) {
            throw new errors_1.ValidationError(`Value of type ${utils_1.constToTypeString(constValue)} cannot be assigned to type ${enumDef.name.value}`, constValue.loc);
        }
    }
    function validateTypeForIdentifier(id, resolvedValue, rawValue) {
        const result = resolver_1.Resolver.resolveIdentifierDefinition(id, {
            currentNamespace,
            namespaceMap,
        });
        const definition = result.definition;
        switch (definition.type) {
            case thrift_parser_1.SyntaxType.ServiceDefinition:
                throw new errors_1.ValidationError(`Service ${definition.name.value} is being used as a value`, rawValue.loc);
            case thrift_parser_1.SyntaxType.EnumDefinition:
                validateEnum(definition, resolvedValue);
                break;
            case thrift_parser_1.SyntaxType.TypedefDefinition:
                validateValue(definition.definitionType, resolvedValue);
                break;
            case thrift_parser_1.SyntaxType.ConstDefinition:
                validateValue(definition.fieldType, resolvedValue);
                break;
            case thrift_parser_1.SyntaxType.StructDefinition:
            case thrift_parser_1.SyntaxType.UnionDefinition:
            case thrift_parser_1.SyntaxType.ExceptionDefinition:
                throw new errors_1.ValidationError(`Cannot assign value to type ${definition.name.value}`, rawValue.loc);
            default:
                const msg = definition;
                throw new Error(`Non-exhaustive match for ${msg}`);
        }
    }
    function validateValue(expectedType, value, rawValue = value) {
        const resolvedValue = resolver_1.Resolver.resolveConstValue(value, expectedType, {
            currentNamespace,
            namespaceMap,
        });
        switch (expectedType.type) {
            case thrift_parser_1.SyntaxType.VoidKeyword:
                throw new errors_1.ValidationError(`Cannot assign value to type void`, rawValue.loc);
            case thrift_parser_1.SyntaxType.Identifier:
                validateTypeForIdentifier(expectedType, resolvedValue, rawValue);
                break;
            case thrift_parser_1.SyntaxType.StringKeyword:
                if (resolvedValue.type !== thrift_parser_1.SyntaxType.StringLiteral) {
                    throw typeMismatch(expectedType, rawValue, rawValue.loc);
                }
                break;
            case thrift_parser_1.SyntaxType.BoolKeyword:
                if (resolvedValue.type !== thrift_parser_1.SyntaxType.BooleanLiteral) {
                    throw typeMismatch(expectedType, rawValue, rawValue.loc);
                }
                break;
            case thrift_parser_1.SyntaxType.DoubleKeyword:
                if (resolvedValue.type !== thrift_parser_1.SyntaxType.DoubleConstant &&
                    resolvedValue.type !== thrift_parser_1.SyntaxType.IntConstant) {
                    throw typeMismatch(expectedType, rawValue, rawValue.loc);
                }
                break;
            case thrift_parser_1.SyntaxType.BinaryKeyword:
                if (resolvedValue.type !== thrift_parser_1.SyntaxType.StringLiteral) {
                    throw typeMismatch(expectedType, rawValue, rawValue.loc);
                }
                break;
            case thrift_parser_1.SyntaxType.ByteKeyword:
            case thrift_parser_1.SyntaxType.I8Keyword:
            case thrift_parser_1.SyntaxType.I16Keyword:
            case thrift_parser_1.SyntaxType.I32Keyword:
                if (resolvedValue.type !== thrift_parser_1.SyntaxType.IntConstant) {
                    throw typeMismatch(expectedType, rawValue, rawValue.loc);
                }
                break;
            case thrift_parser_1.SyntaxType.I64Keyword:
                if (resolvedValue.type !== thrift_parser_1.SyntaxType.IntConstant) {
                    throw typeMismatch(expectedType, rawValue, rawValue.loc);
                }
                break;
            case thrift_parser_1.SyntaxType.SetType:
                if (resolvedValue.type === thrift_parser_1.SyntaxType.ConstList) {
                    resolvedValue.elements.forEach((next) => {
                        validateValue(expectedType.valueType, next);
                    });
                }
                else {
                    throw typeMismatch(expectedType, rawValue, rawValue.loc);
                }
                break;
            case thrift_parser_1.SyntaxType.ListType:
                if (resolvedValue.type === thrift_parser_1.SyntaxType.ConstList) {
                    resolvedValue.elements.forEach((next) => {
                        validateValue(expectedType.valueType, next);
                    });
                }
                else {
                    throw typeMismatch(expectedType, rawValue, rawValue.loc);
                }
                break;
            case thrift_parser_1.SyntaxType.MapType:
                if (resolvedValue.type === thrift_parser_1.SyntaxType.ConstMap) {
                    resolvedValue.properties.forEach((next) => {
                        validateValue(expectedType.keyType, next.name);
                        validateValue(expectedType.valueType, next.initializer);
                    });
                }
                else {
                    throw typeMismatch(expectedType, rawValue, rawValue.loc);
                }
                break;
            default:
                const msg = expectedType;
                throw new Error(`Non-exhaustive match for ${msg}`);
        }
    }
    validateStatements();
    return {
        type: 'Namespace',
        namespace: currentNamespace.namespace,
        exports: currentNamespace.exports,
        includedNamespaces: currentNamespace.includedNamespaces,
        namespaceIncludes: currentNamespace.namespaceIncludes,
        errors,
        constants: currentNamespace.constants,
        enums: currentNamespace.enums,
        typedefs: currentNamespace.typedefs,
        structs: currentNamespace.structs,
        unions: currentNamespace.unions,
        exceptions: currentNamespace.exceptions,
        services: currentNamespace.services,
    };
}
exports.validateNamespace = validateNamespace;
//# sourceMappingURL=index.js.map