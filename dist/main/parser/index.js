"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const resolver_1 = require("../resolver");
function parseThriftString(source) {
    const thrift = thrift_parser_1.parse(source);
    switch (thrift.type) {
        case thrift_parser_1.SyntaxType.ThriftDocument:
            return thrift;
        default:
            throw new Error('Unable to parse source: ');
    }
}
function parseFromSource(source, fallbackNamespace) {
    const sourceFile = {
        type: 'SourceFile',
        name: '',
        path: '',
        fullPath: '',
        source,
    };
    return parseThriftFile(sourceFile, fallbackNamespace);
}
function parseThriftFile(file, fallbackNamespace) {
    const thriftDoc = parseThriftString(file.source);
    const exports = resolver_1.Resolver.exportsForFile(thriftDoc.body);
    const namespace = resolver_1.Resolver.namespaceForFile(thriftDoc.body, fallbackNamespace);
    const includes = resolver_1.Resolver.includesForFile(thriftDoc.body, file);
    return {
        type: 'ParsedFile',
        sourceFile: file,
        namespace,
        includes,
        exports,
        body: thriftDoc.body,
        errors: [],
    };
}
exports.Parser = {
    parseFromSource,
    parseThriftString,
    parseThriftFile,
};
//# sourceMappingURL=index.js.map