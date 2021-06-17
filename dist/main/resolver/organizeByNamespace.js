"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const namespaceForInclude_1 = require("./namespaceForInclude");
function organizeByNamespace(parsedFiles, sourceDir, fallbackNamespace) {
    const parsedFileMap = parsedFiles.reduce((acc, next) => {
        acc[next.sourceFile.fullPath] = next;
        return acc;
    }, {});
    return parsedFiles.reduce((acc, parsedFile) => {
        const namespaceAccessor = parsedFile.namespace.accessor;
        let namespace = acc[namespaceAccessor];
        if (namespace === undefined) {
            namespace = {
                type: 'Namespace',
                namespace: parsedFile.namespace,
                includedNamespaces: {},
                namespaceIncludes: {},
                errors: [],
                exports: {},
                constants: [],
                enums: [],
                typedefs: [],
                structs: [],
                unions: [],
                exceptions: [],
                services: [],
            };
            acc[namespaceAccessor] = namespace;
        }
        Object.keys(parsedFile.includes).forEach((includeName) => {
            const includePath = parsedFile.includes[includeName];
            const namesapcePath = namespaceForInclude_1.namespaceForInclude(includePath, parsedFileMap, sourceDir, fallbackNamespace);
            namespace.includedNamespaces[namesapcePath.accessor] = namesapcePath;
            namespace.namespaceIncludes[includeName] =
                namesapcePath.accessor;
        });
        parsedFile.body.forEach((statement) => {
            switch (statement.type) {
                case thrift_parser_1.SyntaxType.ConstDefinition:
                    namespace.constants.push(statement);
                    namespace.exports[statement.name.value] = statement;
                    break;
                case thrift_parser_1.SyntaxType.EnumDefinition:
                    namespace.enums.push(statement);
                    namespace.exports[statement.name.value] = statement;
                    break;
                case thrift_parser_1.SyntaxType.TypedefDefinition:
                    namespace.typedefs.push(statement);
                    namespace.exports[statement.name.value] = statement;
                    break;
                case thrift_parser_1.SyntaxType.StructDefinition:
                    namespace.structs.push(statement);
                    namespace.exports[statement.name.value] = statement;
                    break;
                case thrift_parser_1.SyntaxType.UnionDefinition:
                    namespace.unions.push(statement);
                    namespace.exports[statement.name.value] = statement;
                    break;
                case thrift_parser_1.SyntaxType.ExceptionDefinition:
                    namespace.exceptions.push(statement);
                    namespace.exports[statement.name.value] = statement;
                    break;
                case thrift_parser_1.SyntaxType.ServiceDefinition:
                    namespace.services.push(statement);
                    namespace.exports[statement.name.value] = statement;
                    break;
            }
        });
        return acc;
    }, {});
}
exports.organizeByNamespace = organizeByNamespace;
//# sourceMappingURL=organizeByNamespace.js.map