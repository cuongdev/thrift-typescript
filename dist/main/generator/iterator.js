"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
function renderStatement(statement, state, renderer) {
    switch (statement.type) {
        case thrift_parser_1.SyntaxType.ConstDefinition:
            return renderer.renderConst(statement, state);
        case thrift_parser_1.SyntaxType.EnumDefinition:
            return renderer.renderEnum(statement, state);
        case thrift_parser_1.SyntaxType.TypedefDefinition:
            return renderer.renderTypeDef(statement, state);
        case thrift_parser_1.SyntaxType.StructDefinition:
            return renderer.renderStruct(statement, state);
        case thrift_parser_1.SyntaxType.UnionDefinition:
            return renderer.renderUnion(statement, state);
        case thrift_parser_1.SyntaxType.ExceptionDefinition:
            return renderer.renderException(statement, state);
        case thrift_parser_1.SyntaxType.ServiceDefinition:
            return renderer.renderService(statement, state);
        case thrift_parser_1.SyntaxType.NamespaceDefinition:
        case thrift_parser_1.SyntaxType.CppIncludeDefinition:
        case thrift_parser_1.SyntaxType.IncludeDefinition:
            return [];
        default:
            const msg = statement;
            throw new Error(`Non-exhaustive match for statement: ${msg}`);
    }
}
exports.renderStatement = renderStatement;
function processStatements(statements, state, renderer) {
    return statements.reduce((acc, next) => {
        return [...acc, ...renderStatement(next, state, renderer)];
    }, []);
}
exports.processStatements = processStatements;
//# sourceMappingURL=iterator.js.map