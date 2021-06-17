"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const errors_1 = require("../errors");
const utils_1 = require("../utils");
const resolveConstValue_1 = require("./resolveConstValue");
const resolveIdentifierDefinition_1 = require("./resolveIdentifierDefinition");
function resolveNamespace(currentNamespace, namespaceMap) {
    const statements = Object.keys(currentNamespace.exports).map((next) => {
        return currentNamespace.exports[next];
    });
    const bodySize = statements.length;
    let currentIndex = 0;
    const errors = [];
    function resolveStatements() {
        const newBody = [];
        while (!isAtEnd()) {
            try {
                const statement = resolveStatement(statements[currentIndex]);
                if (statement !== null) {
                    newBody.push(statement);
                }
            }
            catch (err) {
                errors.push(errors_1.createValidationError(err.message, err.loc));
            }
            currentIndex += 1;
        }
        return newBody;
    }
    function isAtEnd() {
        return currentIndex >= bodySize;
    }
    function resolveStatement(statement) {
        switch (statement.type) {
            case thrift_parser_1.SyntaxType.TypedefDefinition:
                return {
                    type: thrift_parser_1.SyntaxType.TypedefDefinition,
                    name: statement.name,
                    definitionType: resolveFieldType(statement.definitionType),
                    annotations: statement.annotations,
                    comments: statement.comments,
                    loc: statement.loc,
                };
            case thrift_parser_1.SyntaxType.ConstDefinition:
                return {
                    type: thrift_parser_1.SyntaxType.ConstDefinition,
                    name: statement.name,
                    fieldType: resolveFieldType(statement.fieldType),
                    initializer: resolveValue(statement.initializer, statement.fieldType),
                    comments: statement.comments,
                    annotations: statement.annotations,
                    loc: statement.loc,
                };
            case thrift_parser_1.SyntaxType.EnumDefinition:
                return {
                    type: thrift_parser_1.SyntaxType.EnumDefinition,
                    name: statement.name,
                    members: resolveEnumMembers(statement.members),
                    comments: statement.comments,
                    annotations: statement.annotations,
                    loc: statement.loc,
                };
            case thrift_parser_1.SyntaxType.StructDefinition:
                return {
                    type: thrift_parser_1.SyntaxType.StructDefinition,
                    name: statement.name,
                    fields: resolveFields(statement.fields),
                    comments: statement.comments,
                    annotations: statement.annotations,
                    loc: statement.loc,
                };
            case thrift_parser_1.SyntaxType.UnionDefinition:
                return {
                    type: thrift_parser_1.SyntaxType.UnionDefinition,
                    name: statement.name,
                    fields: resolveFields(statement.fields),
                    comments: statement.comments,
                    annotations: statement.annotations,
                    loc: statement.loc,
                };
            case thrift_parser_1.SyntaxType.ExceptionDefinition:
                return {
                    type: thrift_parser_1.SyntaxType.ExceptionDefinition,
                    name: statement.name,
                    fields: resolveFields(statement.fields),
                    comments: statement.comments,
                    annotations: statement.annotations,
                    loc: statement.loc,
                };
            case thrift_parser_1.SyntaxType.ServiceDefinition:
                return {
                    type: thrift_parser_1.SyntaxType.ServiceDefinition,
                    name: statement.name,
                    functions: resolveFunctions(statement.functions),
                    extends: statement.extends === null
                        ? null
                        : resolveIdentifier(statement.extends),
                    comments: statement.comments,
                    annotations: statement.annotations,
                    loc: statement.loc,
                };
            default:
                const msg = statement;
                throw new Error(`Non-exhaustive match for ${msg}`);
        }
    }
    function resolveIdentifier(id) {
        return {
            type: thrift_parser_1.SyntaxType.Identifier,
            value: resolveName(id.value),
            annotations: id.annotations,
            loc: id.loc,
        };
    }
    function resolveName(name) {
        const [head, ...tail] = name.split('.');
        if (currentNamespace.exports[head] !== undefined) {
            return name;
        }
        else if (currentNamespace.includedNamespaces[head] !== undefined) {
            const namespacePath = currentNamespace.includedNamespaces[head];
            return [namespacePath.accessor, ...tail].join('.');
        }
        else if (currentNamespace.namespaceIncludes[head]) {
            const namespaceAccessor = currentNamespace.namespaceIncludes[head];
            return [namespaceAccessor, ...tail].join('.');
        }
        else {
            return name;
        }
    }
    function resolveFunctionType(fieldType) {
        switch (fieldType.type) {
            case thrift_parser_1.SyntaxType.VoidKeyword:
                return fieldType;
            default:
                return resolveFieldType(fieldType);
        }
    }
    function isBaseType(fieldType) {
        switch (fieldType.type) {
            case thrift_parser_1.SyntaxType.I8Keyword:
            case thrift_parser_1.SyntaxType.I16Keyword:
            case thrift_parser_1.SyntaxType.I32Keyword:
            case thrift_parser_1.SyntaxType.I64Keyword:
            case thrift_parser_1.SyntaxType.StringKeyword:
            case thrift_parser_1.SyntaxType.BinaryKeyword:
                return true;
            default:
                return false;
        }
    }
    function resolveFieldType(fieldType) {
        switch (fieldType.type) {
            case thrift_parser_1.SyntaxType.Identifier:
                const result = resolveIdentifierDefinition_1.resolveIdentifierDefinition(fieldType, {
                    currentNamespace,
                    namespaceMap,
                });
                const definition = result.definition;
                if (definition.type === thrift_parser_1.SyntaxType.TypedefDefinition &&
                    isBaseType(definition.definitionType)) {
                    return definition.definitionType;
                }
                else {
                    return resolveIdentifier(fieldType);
                }
            case thrift_parser_1.SyntaxType.ListType:
                return {
                    type: thrift_parser_1.SyntaxType.ListType,
                    valueType: resolveFieldType(fieldType.valueType),
                    annotations: fieldType.annotations,
                    loc: fieldType.loc,
                };
            case thrift_parser_1.SyntaxType.SetType:
                return {
                    type: thrift_parser_1.SyntaxType.SetType,
                    valueType: resolveFieldType(fieldType.valueType),
                    annotations: fieldType.annotations,
                    loc: fieldType.loc,
                };
            case thrift_parser_1.SyntaxType.MapType:
                return {
                    type: thrift_parser_1.SyntaxType.MapType,
                    valueType: resolveFieldType(fieldType.valueType),
                    keyType: resolveFieldType(fieldType.keyType),
                    annotations: fieldType.annotations,
                    loc: fieldType.loc,
                };
            default:
                return fieldType;
        }
    }
    function resolveEnumMembers(enumMembers) {
        let previousValue = -1;
        return enumMembers.map((next) => {
            let initializer;
            if (next.initializer !== null) {
                previousValue = parseInt(next.initializer.value.value, 10);
                initializer = next.initializer;
            }
            else {
                initializer = {
                    type: thrift_parser_1.SyntaxType.IntConstant,
                    value: {
                        type: thrift_parser_1.SyntaxType.IntegerLiteral,
                        value: `${++previousValue}`,
                        loc: utils_1.emptyLocation(),
                    },
                    loc: utils_1.emptyLocation(),
                };
            }
            return {
                type: thrift_parser_1.SyntaxType.EnumMember,
                name: next.name,
                initializer,
                comments: next.comments,
                annotations: next.annotations,
                loc: next.loc,
            };
        });
    }
    function resolveValue(value, fieldType) {
        const resolvedValue = resolveConstValue_1.resolveConstValue(value, fieldType, {
            currentNamespace,
            namespaceMap,
        });
        if (resolvedValue.type === thrift_parser_1.SyntaxType.Identifier) {
            return resolveIdentifier(resolvedValue);
        }
        else {
            return resolvedValue;
        }
    }
    function resolveFields(fields) {
        let generatedFieldID = 0;
        const usedFieldIDs = [];
        function resolveFieldID(fieldID) {
            if (fieldID === null) {
                return {
                    type: thrift_parser_1.SyntaxType.FieldID,
                    value: --generatedFieldID,
                    loc: utils_1.emptyLocation(),
                };
            }
            else if (fieldID.value < 0) {
                throw new errors_1.ValidationError(`Field IDs should be positive integers, found ${fieldID.value}`, fieldID.loc);
            }
            else if (usedFieldIDs.indexOf(fieldID.value) > -1) {
                throw new errors_1.ValidationError(`Found duplicate usage of fieldID: ${fieldID.value}`, fieldID.loc);
            }
            else {
                usedFieldIDs.push(fieldID.value);
                return fieldID;
            }
        }
        return fields.map((field) => {
            return {
                type: thrift_parser_1.SyntaxType.FieldDefinition,
                name: field.name,
                fieldID: resolveFieldID(field.fieldID),
                fieldType: resolveFunctionType(field.fieldType),
                requiredness: field.requiredness,
                defaultValue: field.defaultValue === null
                    ? null
                    : resolveValue(field.defaultValue, field.fieldType),
                comments: field.comments,
                annotations: field.annotations,
                loc: field.loc,
            };
        });
    }
    function resolveFunctions(funcs) {
        return funcs.map((func) => {
            return {
                type: thrift_parser_1.SyntaxType.FunctionDefinition,
                name: func.name,
                oneway: func.oneway,
                returnType: resolveFunctionType(func.returnType),
                fields: resolveFields(func.fields.map((next) => {
                    next.requiredness =
                        next.requiredness === 'optional'
                            ? 'optional'
                            : 'required';
                    return next;
                })),
                throws: resolveFields(func.throws.map((next) => {
                    next.requiredness =
                        next.requiredness === 'optional'
                            ? 'optional'
                            : 'required';
                    return next;
                })),
                modifiers: func.modifiers,
                comments: func.comments,
                annotations: func.annotations,
                loc: func.loc,
            };
        });
    }
    const newNamespace = {
        type: 'Namespace',
        namespace: currentNamespace.namespace,
        exports: {},
        includedNamespaces: currentNamespace.includedNamespaces,
        namespaceIncludes: currentNamespace.namespaceIncludes,
        errors: [],
        constants: [],
        enums: [],
        typedefs: [],
        structs: [],
        unions: [],
        exceptions: [],
        services: [],
    };
    resolveStatements().forEach((next) => {
        newNamespace.exports[next.name.value] = next;
        switch (next.type) {
            case thrift_parser_1.SyntaxType.ConstDefinition:
                newNamespace.constants.push(next);
                break;
            case thrift_parser_1.SyntaxType.TypedefDefinition:
                newNamespace.typedefs.push(next);
                break;
            case thrift_parser_1.SyntaxType.EnumDefinition:
                newNamespace.enums.push(next);
                break;
            case thrift_parser_1.SyntaxType.StructDefinition:
                newNamespace.structs.push(next);
                break;
            case thrift_parser_1.SyntaxType.UnionDefinition:
                newNamespace.unions.push(next);
                break;
            case thrift_parser_1.SyntaxType.ExceptionDefinition:
                newNamespace.exceptions.push(next);
                break;
            case thrift_parser_1.SyntaxType.ServiceDefinition:
                newNamespace.services.push(next);
                break;
        }
    });
    newNamespace.errors = errors;
    return newNamespace;
}
exports.resolveNamespace = resolveNamespace;
//# sourceMappingURL=resolveNamespace.js.map