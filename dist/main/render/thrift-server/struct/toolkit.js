"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const utils_1 = require("../utils");
const identifiers_1 = require("../identifiers");
const encode_1 = require("./encode");
const decode_1 = require("./decode");
const utils_2 = require("./utils");
function renderToolkit(node, state, isExported) {
    return ts.createVariableStatement(utils_2.tokens(isExported), utils_1.createConst(utils_2.toolkitNameForStruct(node, state), ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IStructCodec, [
        ts.createTypeReferenceNode(utils_2.looseNameForStruct(node, state), undefined),
        ts.createTypeReferenceNode(utils_2.strictNameForStruct(node, state), undefined),
    ]), ts.createObjectLiteral([
        encode_1.createEncodeMethod(node, state),
        decode_1.createDecodeMethod(node, state),
    ], true)));
}
exports.renderToolkit = renderToolkit;
//# sourceMappingURL=toolkit.js.map