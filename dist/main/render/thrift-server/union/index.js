"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("../struct/interface");
const toolkit_1 = require("./toolkit");
const class_1 = require("./class");
const union_fields_1 = require("./union-fields");
function renderUnion(node, state, isExported = true) {
    return [
        ...interface_1.renderInterface(node, state, isExported),
        toolkit_1.renderToolkit(node, state, isExported),
        class_1.renderClass(node, state, isExported),
    ];
}
exports.renderUnion = renderUnion;
function renderStrictUnion(node, state, isExported = true) {
    return [
        union_fields_1.renderUnionTypes(node, state, isExported),
        ...union_fields_1.renderUnionsForFields(node, state, isExported, true),
        ...union_fields_1.renderUnionsForFields(node, state, isExported, false),
        toolkit_1.renderToolkit(node, state, isExported),
    ];
}
exports.renderStrictUnion = renderStrictUnion;
//# sourceMappingURL=index.js.map