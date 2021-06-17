"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const identifiers_1 = require("./identifiers");
__export(require("../shared/utils"));
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