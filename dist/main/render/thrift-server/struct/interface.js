"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const types_1 = require("../types");
const identifiers_1 = require("../../shared/identifiers");
const utils_1 = require("./utils");
function strictInterface(node, state, isExported) {
    const signatures = state.options.withNameField
        ? [
            ts.createPropertySignature(undefined, identifiers_1.COMMON_IDENTIFIERS.__name, undefined, ts.createLiteralTypeNode(ts.createLiteral(node.name.value)), undefined),
            ...node.fields.map((field) => {
                return ts.createPropertySignature(undefined, field.name.value, utils_1.renderOptional(field), types_1.typeNodeForFieldType(field.fieldType, state), undefined);
            }),
        ]
        : [
            ...node.fields.map((field) => {
                return ts.createPropertySignature(undefined, field.name.value, utils_1.renderOptional(field), types_1.typeNodeForFieldType(field.fieldType, state), undefined);
            }),
        ];
    return ts.createInterfaceDeclaration(undefined, utils_1.tokens(isExported), utils_1.strictNameForStruct(node, state), [], [], signatures);
}
function looseInterface(node, state, isExported) {
    const signatures = node.fields.map((field) => {
        return ts.createPropertySignature(undefined, field.name.value, utils_1.renderOptional(field, true), types_1.typeNodeForFieldType(field.fieldType, state, true), undefined);
    });
    return ts.createInterfaceDeclaration(undefined, utils_1.tokens(isExported), utils_1.looseNameForStruct(node, state), [], [], signatures);
}
function renderInterface(node, state, isExported) {
    return [
        strictInterface(node, state, isExported),
        looseInterface(node, state, isExported),
    ];
}
exports.renderInterface = renderInterface;
//# sourceMappingURL=interface.js.map