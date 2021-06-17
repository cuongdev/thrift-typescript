"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
function nameForInclude(fullInclude) {
    const body = fullInclude.replace('.thrift', '');
    const parts = body.split('/');
    return parts[parts.length - 1];
}
function includesForFile(fileBody, sourceFile) {
    return fileBody.reduce((acc, next) => {
        if (next.type === thrift_parser_1.SyntaxType.IncludeDefinition) {
            const includeName = nameForInclude(next.path.value);
            acc[includeName] = {
                type: 'IncludePath',
                path: next.path.value,
                importedFrom: sourceFile.path,
            };
        }
        return acc;
    }, {});
}
exports.includesForFile = includesForFile;
//# sourceMappingURL=includesForFile.js.map