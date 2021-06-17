"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const types_1 = require("../types");
const utils_1 = require("../utils");
const types_2 = require("../../shared/types");
const identifiers_1 = require("../identifiers");
exports.TProtocolType = ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TProtocol, undefined);
function createProtocolType() {
    return ts.createConstructorTypeNode([], [
        utils_1.createFunctionParameter('trans', ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TTransport, undefined)),
    ], exports.TProtocolType);
}
exports.createProtocolType = createProtocolType;
function createReqType() {
    return ts.createTypeLiteralNode([
        ts.createIndexSignature(undefined, undefined, [
            ts.createParameter(undefined, undefined, undefined, 'name', undefined, types_1.createNumberType()),
        ], ts.createFunctionTypeNode(undefined, [
            utils_1.createFunctionParameter('err', ts.createUnionTypeNode([
                types_2.createErrorType(),
                ts.createTypeReferenceNode('object', undefined),
                types_2.createUndefinedType(),
            ])),
            utils_1.createFunctionParameter('val', ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword), undefined, true),
        ], types_1.createVoidType())),
    ]);
}
exports.createReqType = createReqType;
//# sourceMappingURL=types.js.map