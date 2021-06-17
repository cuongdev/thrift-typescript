"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const values_1 = require("./values");
function renderEnum(node) {
    return ts.createEnumDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], node.name.value, node.members.map((field) => {
        return ts.createEnumMember(field.name.value, field.initializer !== null
            ? values_1.renderIntConstant(field.initializer)
            : undefined);
    }));
}
exports.renderEnum = renderEnum;
//# sourceMappingURL=enum.js.map