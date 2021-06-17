"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
exports.READ_METHODS = {
    [thrift_parser_1.SyntaxType.BoolKeyword]: 'readBool',
    [thrift_parser_1.SyntaxType.BinaryKeyword]: 'readBinary',
    [thrift_parser_1.SyntaxType.StringKeyword]: 'readString',
    [thrift_parser_1.SyntaxType.DoubleKeyword]: 'readDouble',
    [thrift_parser_1.SyntaxType.I8Keyword]: 'readByte',
    [thrift_parser_1.SyntaxType.ByteKeyword]: 'readByte',
    [thrift_parser_1.SyntaxType.I16Keyword]: 'readI16',
    [thrift_parser_1.SyntaxType.I32Keyword]: 'readI32',
    [thrift_parser_1.SyntaxType.I64Keyword]: 'readI64',
};
exports.WRITE_METHODS = {
    [thrift_parser_1.SyntaxType.BoolKeyword]: 'writeBool',
    [thrift_parser_1.SyntaxType.BinaryKeyword]: 'writeBinary',
    [thrift_parser_1.SyntaxType.StringKeyword]: 'writeString',
    [thrift_parser_1.SyntaxType.DoubleKeyword]: 'writeDouble',
    [thrift_parser_1.SyntaxType.I8Keyword]: 'writeByte',
    [thrift_parser_1.SyntaxType.ByteKeyword]: 'writeByte',
    [thrift_parser_1.SyntaxType.I16Keyword]: 'writeI16',
    [thrift_parser_1.SyntaxType.I32Keyword]: 'writeI32',
    [thrift_parser_1.SyntaxType.I64Keyword]: 'writeI64',
};
//# sourceMappingURL=methods.js.map