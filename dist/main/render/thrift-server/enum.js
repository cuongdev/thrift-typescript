"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const initializers_1 = require("./initializers");
function renderEnum(node) {
    return ts.createEnumDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], node.name.value, node.members.map((field) => {
        return ts.createEnumMember(field.name.value, field.initializer !== null
            ? initializers_1.renderIntConstant(field.initializer)
            : undefined);
    }));
}
exports.renderEnum = renderEnum;
//# sourceMappingURL=enum.js.map