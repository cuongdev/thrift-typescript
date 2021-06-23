"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const initializers_1 = require("./initializers");
const utils_1 = require("./utils");
function renderConst(node, typeMapping, state) {
    return ts.createVariableStatement([ts.createToken(ts.SyntaxKind.ExportKeyword)], utils_1.createConst(node.name.value, typeMapping(node.fieldType, state), initializers_1.renderValue(node.fieldType, node.initializer, state)));
}
exports.renderConst = renderConst;
//# sourceMappingURL=const.js.map