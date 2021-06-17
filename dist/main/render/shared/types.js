"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const identifiers_1 = require("./identifiers");
function createErrorType() {
    return ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Error, undefined);
}
exports.createErrorType = createErrorType;
function createUndefinedType() {
    return ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.undefined, undefined);
}
exports.createUndefinedType = createUndefinedType;
function createBufferType() {
    return ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Buffer, undefined);
}
exports.createBufferType = createBufferType;
function createPromiseType(typeArgument) {
    return ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Promise, [
        typeArgument,
    ]);
}
exports.createPromiseType = createPromiseType;
function createArrayType(typeArgument) {
    return ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Array, [typeArgument]);
}
exports.createArrayType = createArrayType;
function createVoidType() {
    return ts.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword);
}
exports.createVoidType = createVoidType;
function createAnyType() {
    return ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
}
exports.createAnyType = createAnyType;
function createStringType() {
    return ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
}
exports.createStringType = createStringType;
function createNumberType() {
    return ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
}
exports.createNumberType = createNumberType;
function createBooleanType() {
    return ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
}
exports.createBooleanType = createBooleanType;
function createTypeProperty(name, type) {
    return ts.createPropertySignature(undefined, name, undefined, type, undefined);
}
exports.createTypeProperty = createTypeProperty;
function constructorNameForFieldType(fieldType, className, state) {
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.Identifier:
            return ts.createIdentifier(className(fieldType.value, state));
        case thrift_parser_1.SyntaxType.SetType:
            return identifiers_1.COMMON_IDENTIFIERS.Set;
        case thrift_parser_1.SyntaxType.MapType:
            return identifiers_1.COMMON_IDENTIFIERS.Map;
        case thrift_parser_1.SyntaxType.ListType:
            return identifiers_1.COMMON_IDENTIFIERS.Array;
        case thrift_parser_1.SyntaxType.StringKeyword:
            return identifiers_1.COMMON_IDENTIFIERS.String;
        case thrift_parser_1.SyntaxType.BoolKeyword:
            return identifiers_1.COMMON_IDENTIFIERS.Boolean;
        case thrift_parser_1.SyntaxType.I64Keyword:
            return identifiers_1.COMMON_IDENTIFIERS.Int64;
        case thrift_parser_1.SyntaxType.BinaryKeyword:
            return identifiers_1.COMMON_IDENTIFIERS.Buffer;
        case thrift_parser_1.SyntaxType.DoubleKeyword:
        case thrift_parser_1.SyntaxType.I8Keyword:
        case thrift_parser_1.SyntaxType.I16Keyword:
        case thrift_parser_1.SyntaxType.I32Keyword:
        case thrift_parser_1.SyntaxType.ByteKeyword:
            return identifiers_1.COMMON_IDENTIFIERS.Number;
        case thrift_parser_1.SyntaxType.VoidKeyword:
            return identifiers_1.COMMON_IDENTIFIERS.void;
        default:
            const msg = fieldType;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
exports.constructorNameForFieldType = constructorNameForFieldType;
//# sourceMappingURL=types.js.map