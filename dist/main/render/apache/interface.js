"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const types_1 = require("./types");
const utils_1 = require("./utils");
function interfaceNameForClass(statement) {
    return `I${statement.name.value}Args`;
}
exports.interfaceNameForClass = interfaceNameForClass;
function renderInterface(statement, state) {
    const signatures = statement.fields.map((field) => {
        return ts.createPropertySignature(undefined, field.name.value, utils_1.renderOptional(field.requiredness), types_1.typeNodeForFieldType(field.fieldType, state, true), undefined);
    });
    return ts.createInterfaceDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], interfaceNameForClass(statement), [], [], signatures);
}
exports.renderInterface = renderInterface;
//# sourceMappingURL=interface.js.map