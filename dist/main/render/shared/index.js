"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
function renderIndex(state) {
    const currentNamespace = state.currentNamespace;
    const results = [];
    if (currentNamespace.constants.length > 0) {
        results.push(ts.createExportDeclaration(undefined, undefined, undefined, ts.createLiteral(`./constants`)));
    }
    ;
    [
        ...currentNamespace.enums,
        ...currentNamespace.typedefs,
        ...currentNamespace.structs,
        ...currentNamespace.unions,
        ...currentNamespace.exceptions,
    ].forEach((next) => {
        results.push(ts.createExportDeclaration(undefined, undefined, undefined, ts.createLiteral(`./${next.name.value}`)));
    });
    currentNamespace.services.forEach((next) => {
        results.push(ts.createImportDeclaration(undefined, undefined, ts.createImportClause(undefined, ts.createNamespaceImport(ts.createIdentifier(next.name.value))), ts.createLiteral(`./${next.name.value}`)));
        results.push(ts.createExportDeclaration(undefined, undefined, ts.createNamedExports([
            ts.createExportSpecifier(next.name.value, next.name.value),
        ])));
    });
    return results;
}
exports.renderIndex = renderIndex;
//# sourceMappingURL=index.js.map