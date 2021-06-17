"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const identifiers_1 = require("./identifiers");
const resolver_1 = require("../../resolver");
const types_1 = require("../shared/types");
__export(require("../shared/types"));
function protocolException(exceptionType) {
    switch (exceptionType) {
        case 'UNKNOWN':
            return identifiers_1.PROTOCOL_EXCEPTION.UNKNOWN;
        case 'INVALID_DATA':
            return identifiers_1.PROTOCOL_EXCEPTION.INVALID_DATA;
        case 'NEGATIVE_SIZE':
            return identifiers_1.PROTOCOL_EXCEPTION.NEGATIVE_SIZE;
        case 'SIZE_LIMIT':
            return identifiers_1.PROTOCOL_EXCEPTION.SIZE_LIMIT;
        case 'BAD_VERSION':
            return identifiers_1.PROTOCOL_EXCEPTION.BAD_VERSION;
        case 'NOT_IMPLEMENTED':
            return identifiers_1.PROTOCOL_EXCEPTION.NOT_IMPLEMENTED;
        case 'DEPTH_LIMIT':
            return identifiers_1.PROTOCOL_EXCEPTION.DEPTH_LIMIT;
        default:
            const msg = exceptionType;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
exports.protocolException = protocolException;
function applicationException(exceptionType) {
    switch (exceptionType) {
        case 'UNKNOWN':
            return identifiers_1.APPLICATION_EXCEPTION.UNKNOWN;
        case 'UNKNOWN_METHOD':
            return identifiers_1.APPLICATION_EXCEPTION.UNKNOWN_METHOD;
        case 'INVALID_MESSAGE_TYPE':
            return identifiers_1.APPLICATION_EXCEPTION.INVALID_MESSAGE_TYPE;
        case 'WRONG_METHOD_NAME':
            return identifiers_1.APPLICATION_EXCEPTION.WRONG_METHOD_NAME;
        case 'BAD_SEQUENCE_ID':
            return identifiers_1.APPLICATION_EXCEPTION.BAD_SEQUENCE_ID;
        case 'MISSING_RESULT':
            return identifiers_1.APPLICATION_EXCEPTION.MISSING_RESULT;
        case 'INTERNAL_ERROR':
            return identifiers_1.APPLICATION_EXCEPTION.INTERNAL_ERROR;
        case 'PROTOCOL_ERROR':
            return identifiers_1.APPLICATION_EXCEPTION.PROTOCOL_ERROR;
        case 'INVALID_TRANSFORM':
            return identifiers_1.APPLICATION_EXCEPTION.INVALID_TRANSFORM;
        case 'INVALID_PROTOCOL':
            return identifiers_1.APPLICATION_EXCEPTION.INVALID_PROTOCOL;
        case 'UNSUPPORTED_CLIENT_TYPE':
            return identifiers_1.APPLICATION_EXCEPTION.UNSUPPORTED_CLIENT_TYPE;
        default:
            const msg = exceptionType;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
exports.applicationException = applicationException;
function thriftTypeForIdentifier(definition, state) {
    switch (definition.type) {
        case thrift_parser_1.SyntaxType.ConstDefinition:
            throw new TypeError(`Identifier ${definition.name.value} is a value being used as a type`);
        case thrift_parser_1.SyntaxType.ServiceDefinition:
            throw new TypeError(`Service ${definition.name.value} is being used as a type`);
        case thrift_parser_1.SyntaxType.StructDefinition:
        case thrift_parser_1.SyntaxType.UnionDefinition:
        case thrift_parser_1.SyntaxType.ExceptionDefinition:
            return identifiers_1.THRIFT_TYPES.STRUCT;
        case thrift_parser_1.SyntaxType.EnumDefinition:
            return identifiers_1.THRIFT_TYPES.I32;
        case thrift_parser_1.SyntaxType.TypedefDefinition:
            return thriftTypeForFieldType(definition.definitionType, state);
        default:
            const msg = definition;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
function thriftTypeForFieldType(fieldType, state) {
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.Identifier:
            const result = resolver_1.Resolver.resolveIdentifierDefinition(fieldType, {
                currentNamespace: state.currentNamespace,
                namespaceMap: state.project.namespaces,
            });
            return thriftTypeForIdentifier(result.definition, state);
        case thrift_parser_1.SyntaxType.SetType:
            return identifiers_1.THRIFT_TYPES.SET;
        case thrift_parser_1.SyntaxType.MapType:
            return identifiers_1.THRIFT_TYPES.MAP;
        case thrift_parser_1.SyntaxType.ListType:
            return identifiers_1.THRIFT_TYPES.LIST;
        case thrift_parser_1.SyntaxType.BinaryKeyword:
        case thrift_parser_1.SyntaxType.StringKeyword:
            return identifiers_1.THRIFT_TYPES.STRING;
        case thrift_parser_1.SyntaxType.BoolKeyword:
            return identifiers_1.THRIFT_TYPES.BOOL;
        case thrift_parser_1.SyntaxType.DoubleKeyword:
            return identifiers_1.THRIFT_TYPES.DOUBLE;
        case thrift_parser_1.SyntaxType.I8Keyword:
        case thrift_parser_1.SyntaxType.ByteKeyword:
            return identifiers_1.THRIFT_TYPES.BYTE;
        case thrift_parser_1.SyntaxType.I16Keyword:
            return identifiers_1.THRIFT_TYPES.I16;
        case thrift_parser_1.SyntaxType.I32Keyword:
            return identifiers_1.THRIFT_TYPES.I32;
        case thrift_parser_1.SyntaxType.I64Keyword:
            return identifiers_1.THRIFT_TYPES.I64;
        case thrift_parser_1.SyntaxType.VoidKeyword:
            return identifiers_1.THRIFT_TYPES.VOID;
        default:
            const msg = fieldType;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
exports.thriftTypeForFieldType = thriftTypeForFieldType;
function typeNodeForFieldType(fieldType, state, loose = false) {
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.Identifier:
            return ts.createTypeReferenceNode(resolver_1.Resolver.resolveIdentifierName(fieldType.value, {
                currentNamespace: state.currentNamespace,
                currentDefinitions: state.currentDefinitions,
                namespaceMap: state.project.namespaces,
            }).fullName, undefined);
        case thrift_parser_1.SyntaxType.SetType:
            return ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Set, [
                typeNodeForFieldType(fieldType.valueType, state, loose),
            ]);
        case thrift_parser_1.SyntaxType.MapType:
            return ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Map, [
                typeNodeForFieldType(fieldType.keyType, state, loose),
                typeNodeForFieldType(fieldType.valueType, state, loose),
            ]);
        case thrift_parser_1.SyntaxType.ListType:
            return types_1.createArrayType(typeNodeForFieldType(fieldType.valueType, state, loose));
        case thrift_parser_1.SyntaxType.StringKeyword:
            return types_1.createStringType();
        case thrift_parser_1.SyntaxType.BoolKeyword:
            return types_1.createBooleanType();
        case thrift_parser_1.SyntaxType.I64Keyword:
            if (loose === true) {
                return ts.createUnionTypeNode([
                    types_1.createNumberType(),
                    ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Node_Int64, undefined),
                ]);
            }
            else {
                return ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Node_Int64, undefined);
            }
        case thrift_parser_1.SyntaxType.BinaryKeyword:
            return types_1.createBufferType();
        case thrift_parser_1.SyntaxType.DoubleKeyword:
        case thrift_parser_1.SyntaxType.I8Keyword:
        case thrift_parser_1.SyntaxType.I16Keyword:
        case thrift_parser_1.SyntaxType.I32Keyword:
        case thrift_parser_1.SyntaxType.ByteKeyword:
            return types_1.createNumberType();
        case thrift_parser_1.SyntaxType.VoidKeyword:
            return types_1.createVoidType();
        default:
            const msg = fieldType;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
exports.typeNodeForFieldType = typeNodeForFieldType;
//# sourceMappingURL=types.js.map