"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
function exportsForFile(fileBody) {
    return fileBody.reduce((acc, next) => {
        switch (next.type) {
            case thrift_parser_1.SyntaxType.TypedefDefinition:
            case thrift_parser_1.SyntaxType.ConstDefinition:
            case thrift_parser_1.SyntaxType.EnumDefinition:
            case thrift_parser_1.SyntaxType.UnionDefinition:
            case thrift_parser_1.SyntaxType.ExceptionDefinition:
            case thrift_parser_1.SyntaxType.StructDefinition:
            case thrift_parser_1.SyntaxType.ServiceDefinition:
                acc[next.name.value] = next;
                break;
            default:
                break;
        }
        return acc;
    }, {});
}
exports.exportsForFile = exportsForFile;
//# sourceMappingURL=exportsForFile.js.map