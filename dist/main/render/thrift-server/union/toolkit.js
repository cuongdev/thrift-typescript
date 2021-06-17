"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const utils_1 = require("../utils");
const identifiers_1 = require("../identifiers");
const encode_1 = require("./encode");
const decode_1 = require("./decode");
const create_1 = require("./create");
const utils_2 = require("../struct/utils");
function renderMethodsForCodec(node, state) {
    if (state.options.strictUnions) {
        return [
            create_1.createCreateMethod(node, state),
            encode_1.createEncodeMethod(node, state),
            decode_1.createDecodeMethod(node, state),
        ];
    }
    else {
        return [
            encode_1.createEncodeMethod(node, state),
            decode_1.createDecodeMethod(node, state),
        ];
    }
}
function toolkitBaseClass(state) {
    if (state.options.strictUnions) {
        return identifiers_1.THRIFT_IDENTIFIERS.IStructToolkit;
    }
    else {
        return identifiers_1.THRIFT_IDENTIFIERS.IStructCodec;
    }
}
function renderToolkitTypeNode(node, state) {
    return ts.createTypeReferenceNode(toolkitBaseClass(state), [
        ts.createTypeReferenceNode(ts.createIdentifier(utils_2.looseNameForStruct(node, state)), undefined),
        ts.createTypeReferenceNode(ts.createIdentifier(utils_2.strictNameForStruct(node, state)), undefined),
    ]);
}
function renderToolkit(node, state, isExported) {
    return ts.createVariableStatement(utils_2.tokens(isExported), utils_1.createConst(ts.createIdentifier(utils_2.toolkitNameForStruct(node, state)), renderToolkitTypeNode(node, state), ts.createObjectLiteral(renderMethodsForCodec(node, state), true)));
}
exports.renderToolkit = renderToolkit;
//# sourceMappingURL=toolkit.js.map