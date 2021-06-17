"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const identifiers_1 = require("../identifiers");
exports.TProtocolType = ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TProtocol, undefined);
exports.ContextType = ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Context, undefined);
function createConnectionType() {
    return ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IThriftConnection, [
        ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Context, undefined),
    ]);
}
exports.createConnectionType = createConnectionType;
//# sourceMappingURL=types.js.map