"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const initializers_1 = require("./initializers");
const utils_1 = require("./utils");
const identifiers_1 = require("./identifiers");
__export(require("../shared/utils"));
function coerceType(valueName, fieldType) {
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.I64Keyword:
            return ts.createParen(ts.createConditional(ts.createBinary(ts.createTypeOf(valueName), ts.SyntaxKind.EqualsEqualsEqualsToken, ts.createLiteral('number')), ts.createNew(identifiers_1.COMMON_IDENTIFIERS.Int64, undefined, [
                valueName,
            ]), ts.createConditional(ts.createBinary(ts.createTypeOf(valueName), ts.SyntaxKind.EqualsEqualsEqualsToken, ts.createLiteral('string')), ts.createCall(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.Int64, ts.createIdentifier('fromDecimalString')), undefined, [valueName]), valueName)));
        case thrift_parser_1.SyntaxType.BinaryKeyword:
            return ts.createParen(ts.createConditional(ts.createBinary(ts.createTypeOf(valueName), ts.SyntaxKind.EqualsEqualsEqualsToken, ts.createLiteral('string')), ts.createCall(ts.createIdentifier('Buffer.from'), undefined, [valueName]), valueName));
        default:
            return valueName;
    }
}
exports.coerceType = coerceType;
function getInitializerForField(objName, field, state, withDefault = true, loose = false) {
    const valueName = ts.createPropertyAccess(objName, ts.createIdentifier(field.name.value));
    if (withDefault &&
        field.defaultValue !== null &&
        field.defaultValue !== undefined) {
        return ts.createParen(ts.createConditional(utils_1.createNotNullCheck(valueName), loose === true
            ? coerceType(valueName, field.fieldType)
            : valueName, initializers_1.renderValue(field.fieldType, field.defaultValue, state)));
    }
    else {
        return loose === true
            ? coerceType(valueName, field.fieldType)
            : valueName;
    }
}
exports.getInitializerForField = getInitializerForField;
function isNotVoid(field) {
    return field.fieldType.type !== thrift_parser_1.SyntaxType.VoidKeyword;
}
exports.isNotVoid = isNotVoid;
function createProtocolException(type, message) {
    const errCtor = identifiers_1.THRIFT_IDENTIFIERS.TProtocolException;
    const errType = identifiers_1.PROTOCOL_EXCEPTION[type];
    const errArgs = [errType, ts.createLiteral(message)];
    return ts.createNew(errCtor, undefined, errArgs);
}
exports.createProtocolException = createProtocolException;
function throwProtocolException(type, message) {
    return ts.createThrow(createProtocolException(type, message));
}
exports.throwProtocolException = throwProtocolException;
function createApplicationException(type, message) {
    const errCtor = identifiers_1.THRIFT_IDENTIFIERS.TApplicationException;
    const errType = identifiers_1.APPLICATION_EXCEPTION[type];
    const errArgs = [
        errType,
        typeof message === 'string' ? ts.createLiteral(message) : message,
    ];
    return ts.createNew(errCtor, undefined, errArgs);
}
exports.createApplicationException = createApplicationException;
function throwApplicationException(type, message) {
    return ts.createThrow(createApplicationException(type, message));
}
exports.throwApplicationException = throwApplicationException;
//# sourceMappingURL=utils.js.map