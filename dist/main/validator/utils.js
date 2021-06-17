"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
function constToTypeString(constValue) {
    switch (constValue.type) {
        case thrift_parser_1.SyntaxType.Identifier:
            return constValue.value;
        case thrift_parser_1.SyntaxType.StringLiteral:
            return 'string';
        case thrift_parser_1.SyntaxType.IntConstant:
        case thrift_parser_1.SyntaxType.DoubleConstant:
            return 'number';
        case thrift_parser_1.SyntaxType.BooleanLiteral:
            return 'boolean';
        case thrift_parser_1.SyntaxType.ConstList:
            return `Array<${constToTypeString(constValue.elements[0])}>`;
        case thrift_parser_1.SyntaxType.ConstMap:
            return `Map<${constToTypeString(constValue.properties[0].name)},${constToTypeString(constValue.properties[0].initializer)}>`;
        default:
            const msg = constValue;
            throw new Error(`Non-exhaustive match for ${msg}`);
    }
}
exports.constToTypeString = constToTypeString;
function fieldTypeToString(fieldType) {
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.Identifier:
            return fieldType.value;
        case thrift_parser_1.SyntaxType.SetType:
            return `Set<${fieldTypeToString(fieldType.valueType)}>`;
        case thrift_parser_1.SyntaxType.MapType:
            return `Map<${fieldTypeToString(fieldType.keyType)},${fieldTypeToString(fieldType.valueType)}>`;
        case thrift_parser_1.SyntaxType.ListType:
            return `Array<${fieldTypeToString(fieldType.valueType)}>`;
        case thrift_parser_1.SyntaxType.StringKeyword:
        case thrift_parser_1.SyntaxType.BinaryKeyword:
            return 'string';
        case thrift_parser_1.SyntaxType.BoolKeyword:
            return 'boolean';
        case thrift_parser_1.SyntaxType.I64Keyword:
            return 'Int64';
        case thrift_parser_1.SyntaxType.DoubleKeyword:
        case thrift_parser_1.SyntaxType.I8Keyword:
        case thrift_parser_1.SyntaxType.I16Keyword:
        case thrift_parser_1.SyntaxType.I32Keyword:
        case thrift_parser_1.SyntaxType.ByteKeyword:
            return 'number';
        case thrift_parser_1.SyntaxType.VoidKeyword:
            return 'void';
        default:
            const msg = fieldType;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
exports.fieldTypeToString = fieldTypeToString;
//# sourceMappingURL=utils.js.map