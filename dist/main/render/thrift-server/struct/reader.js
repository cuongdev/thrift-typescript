"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const ts = require("typescript");
const utils_1 = require("../utils");
const utils_2 = require("./utils");
const resolver_1 = require("../../../resolver");
const utils_3 = require("../../shared/utils");
const identifiers_1 = require("../identifiers");
const types_1 = require("../types");
function defaultValueAssignment(valueName, field) {
    return ts.createStatement(ts.createAssignment(ts.createIdentifier(`this.${field.name.value}`), valueName));
}
function assignmentForField(field, state, valueAssignment = defaultValueAssignment) {
    const valueName = ts.createUniqueName('value');
    return [
        ...assignmentForFieldType(field, field.fieldType, valueName, ts.createIdentifier(`args.${field.name.value}`), state),
        valueAssignment(valueName, field),
    ];
}
exports.assignmentForField = assignmentForField;
function defaultAssignment(saveName, readName, fieldType, state) {
    return utils_1.createConstStatement(saveName, types_1.typeNodeForFieldType(fieldType, state), utils_1.coerceType(readName, fieldType));
}
exports.defaultAssignment = defaultAssignment;
function assignmentForIdentifier(id, field, definition, fieldType, saveName, readName, state) {
    switch (definition.type) {
        case thrift_parser_1.SyntaxType.ConstDefinition:
            throw new TypeError(`Identifier ${definition.name.value} is a value being used as a type`);
        case thrift_parser_1.SyntaxType.ServiceDefinition:
            throw new TypeError(`Service ${definition.name.value} is being used as a type`);
        case thrift_parser_1.SyntaxType.UnionDefinition:
            if (state.options.strictUnions) {
                return [
                    utils_1.createConstStatement(saveName, types_1.typeNodeForFieldType(fieldType, state), utils_3.createMethodCall(utils_2.toolkitName(id, state), 'create', [
                        readName,
                    ])),
                ];
            }
            else {
            }
        case thrift_parser_1.SyntaxType.StructDefinition:
        case thrift_parser_1.SyntaxType.ExceptionDefinition:
            return [
                utils_1.createConstStatement(saveName, types_1.typeNodeForFieldType(fieldType, state), ts.createNew(ts.createIdentifier(utils_2.className(id, state)), undefined, [readName])),
            ];
        case thrift_parser_1.SyntaxType.EnumDefinition:
            return [defaultAssignment(saveName, readName, fieldType, state)];
        case thrift_parser_1.SyntaxType.TypedefDefinition:
            return assignmentForFieldType(field, definition.definitionType, saveName, readName, state);
        default:
            const msg = definition;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
exports.assignmentForIdentifier = assignmentForIdentifier;
function assignmentForFieldType(field, fieldType, saveName, readName, state) {
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.Identifier:
            const result = resolver_1.Resolver.resolveIdentifierDefinition(fieldType, {
                currentNamespace: state.currentNamespace,
                namespaceMap: state.project.namespaces,
            });
            return assignmentForIdentifier(fieldType.value, field, result.definition, fieldType, saveName, readName, state);
        case thrift_parser_1.SyntaxType.BoolKeyword:
        case thrift_parser_1.SyntaxType.ByteKeyword:
        case thrift_parser_1.SyntaxType.BinaryKeyword:
        case thrift_parser_1.SyntaxType.StringKeyword:
        case thrift_parser_1.SyntaxType.DoubleKeyword:
        case thrift_parser_1.SyntaxType.I8Keyword:
        case thrift_parser_1.SyntaxType.I16Keyword:
        case thrift_parser_1.SyntaxType.I32Keyword:
        case thrift_parser_1.SyntaxType.I64Keyword: {
            return [defaultAssignment(saveName, readName, fieldType, state)];
        }
        case thrift_parser_1.SyntaxType.MapType: {
            return [
                utils_1.createConstStatement(saveName, types_1.typeNodeForFieldType(fieldType, state), ts.createNew(identifiers_1.COMMON_IDENTIFIERS.Map, [
                    types_1.typeNodeForFieldType(fieldType.keyType, state),
                    types_1.typeNodeForFieldType(fieldType.valueType, state),
                ], [])),
                ...loopOverContainer(field, fieldType, saveName, readName, state),
            ];
        }
        case thrift_parser_1.SyntaxType.ListType: {
            return [
                utils_1.createConstStatement(saveName, types_1.typeNodeForFieldType(fieldType, state), ts.createNew(identifiers_1.COMMON_IDENTIFIERS.Array, [types_1.typeNodeForFieldType(fieldType.valueType, state)], [])),
                ...loopOverContainer(field, fieldType, saveName, readName, state),
            ];
        }
        case thrift_parser_1.SyntaxType.SetType: {
            return [
                utils_1.createConstStatement(saveName, types_1.typeNodeForFieldType(fieldType, state), ts.createNew(identifiers_1.COMMON_IDENTIFIERS.Set, [types_1.typeNodeForFieldType(fieldType.valueType, state)], [])),
                ...loopOverContainer(field, fieldType, saveName, readName, state),
            ];
        }
        case thrift_parser_1.SyntaxType.VoidKeyword:
            return [
                utils_1.createConstStatement(saveName, types_1.createVoidType(), identifiers_1.COMMON_IDENTIFIERS.undefined),
            ];
        default:
            const msg = fieldType;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
exports.assignmentForFieldType = assignmentForFieldType;
function loopOverContainer(field, fieldType, saveName, readName, state) {
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.MapType: {
            const valueParam = ts.createUniqueName('value');
            const valueConst = ts.createUniqueName('value');
            const keyName = ts.createUniqueName('key');
            const keyConst = ts.createUniqueName('key');
            return [
                ts.createStatement(ts.createCall(ts.createPropertyAccess(readName, ts.createIdentifier('forEach')), undefined, [
                    ts.createArrowFunction(undefined, undefined, [
                        utils_1.createFunctionParameter(valueParam, types_1.typeNodeForFieldType(fieldType.valueType, state, true), undefined),
                        utils_1.createFunctionParameter(keyName, types_1.typeNodeForFieldType(fieldType.keyType, state, true), undefined),
                    ], types_1.createVoidType(), ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken), ts.createBlock([
                        ...assignmentForFieldType(field, fieldType.valueType, valueConst, valueParam, state),
                        ...assignmentForFieldType(field, fieldType.keyType, keyConst, keyName, state),
                        utils_1.createMethodCallStatement(saveName, 'set', [keyConst, valueConst]),
                    ], true)),
                ])),
            ];
        }
        case thrift_parser_1.SyntaxType.ListType: {
            const valueParam = ts.createUniqueName('value');
            const valueConst = ts.createUniqueName('value');
            return [
                ts.createStatement(ts.createCall(ts.createPropertyAccess(readName, ts.createIdentifier('forEach')), undefined, [
                    ts.createArrowFunction(undefined, undefined, [
                        utils_1.createFunctionParameter(valueParam, types_1.typeNodeForFieldType(fieldType.valueType, state, true), undefined),
                    ], types_1.createVoidType(), ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken), ts.createBlock([
                        ...assignmentForFieldType(field, fieldType.valueType, valueConst, valueParam, state),
                        utils_1.createMethodCallStatement(saveName, 'push', [valueConst]),
                    ], true)),
                ])),
            ];
        }
        case thrift_parser_1.SyntaxType.SetType: {
            const valueParam = ts.createUniqueName('value');
            const valueConst = ts.createUniqueName('value');
            return [
                ts.createStatement(ts.createCall(ts.createPropertyAccess(readName, ts.createIdentifier('forEach')), undefined, [
                    ts.createArrowFunction(undefined, undefined, [
                        utils_1.createFunctionParameter(valueParam, types_1.typeNodeForFieldType(fieldType.valueType, state, true), undefined),
                    ], types_1.createVoidType(), ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken), ts.createBlock([
                        ...assignmentForFieldType(field, fieldType.valueType, valueConst, valueParam, state),
                        utils_1.createMethodCallStatement(saveName, 'add', [valueConst]),
                    ], true)),
                ])),
            ];
        }
    }
}
exports.loopOverContainer = loopOverContainer;
//# sourceMappingURL=reader.js.map