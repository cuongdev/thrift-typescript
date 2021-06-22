"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("./interface");
const toolkit_1 = require("./toolkit");
const class_1 = require("./class");
function renderStruct(node, state, extendError = false) {
    return [
        ...interface_1.renderInterface(node, state, true),
        toolkit_1.renderToolkit(node, state, true),
        class_1.renderClass(node, state, true, extendError),
    ];
}
exports.renderStruct = renderStruct;
//# sourceMappingURL=index.js.map