"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const identifiers_1 = require("../shared/identifiers");
function renderInt64Import() {
    return ts.createImportEqualsDeclaration(undefined, undefined, identifiers_1.COMMON_IDENTIFIERS.Node_Int64, ts.createExternalModuleReference(ts.createLiteral('node-int64')));
}
exports.renderInt64Import = renderInt64Import;
//# sourceMappingURL=includes.js.map