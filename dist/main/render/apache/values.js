"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const identifiers_1 = require("./identifiers");
const resolver_1 = require("../../resolver");
const utils_1 = require("./utils");
function renderValue(fieldType, node, state) {
    switch (node.type) {
        case thrift_parser_1.SyntaxType.Identifier:
            return ts.createIdentifier(resolver_1.Resolver.resolveIdentifierName(node.value, {
                currentNamespace: state.currentNamespace,
                currentDefinitions: state.currentDefinitions,
                namespaceMap: state.project.namespaces,
            }).fullName);
        case thrift_parser_1.SyntaxType.IntConstant:
            return renderIntConstant(node, fieldType);
        case thrift_parser_1.SyntaxType.DoubleConstant:
            return renderDoubleConstant(node);
        case thrift_parser_1.SyntaxType.BooleanLiteral:
            return ts.createLiteral(node.value);
        case thrift_parser_1.SyntaxType.StringLiteral:
            if (fieldType.type === thrift_parser_1.SyntaxType.BinaryKeyword) {
                return renderBuffer(node);
            }
            else {
                return ts.createLiteral(node.value);
            }
        case thrift_parser_1.SyntaxType.ConstList:
            if (fieldType.type === thrift_parser_1.SyntaxType.ListType) {
                return renderList(fieldType, node, state);
            }
            else if (fieldType.type === thrift_parser_1.SyntaxType.SetType) {
                return renderSet(fieldType, node, state);
            }
            else {
                throw new TypeError(`Type list | set expected`);
            }
        case thrift_parser_1.SyntaxType.ConstMap:
            if (fieldType.type === thrift_parser_1.SyntaxType.MapType) {
                return renderMap(fieldType, node, state);
            }
            else {
                throw new TypeError(`Type map expected`);
            }
        default:
            const msg = node;
            throw new Error(`Non-exhaustive match for ${msg}`);
    }
}
exports.renderValue = renderValue;
function renderIntConstant(node, fieldType) {
    switch (node.value.type) {
        case thrift_parser_1.SyntaxType.IntegerLiteral:
            if (fieldType && fieldType.type === thrift_parser_1.SyntaxType.I64Keyword) {
                return ts.createNew(identifiers_1.COMMON_IDENTIFIERS.Node_Int64, undefined, [
                    ts.createLiteral(parseInt(node.value.value, 10)),
                ]);
            }
            else {
                return ts.createLiteral(parseInt(node.value.value, 10));
            }
        case thrift_parser_1.SyntaxType.HexLiteral:
            if (fieldType && fieldType.type === thrift_parser_1.SyntaxType.I64Keyword) {
                return ts.createNew(identifiers_1.COMMON_IDENTIFIERS.Node_Int64, undefined, [
                    ts.createLiteral(node.value.value),
                ]);
            }
            else {
                return ts.createLiteral(parseInt(node.value.value, 10));
            }
        default:
            const msg = node.value;
            throw new Error(`Non-exhaustive match for ${msg}`);
    }
}
exports.renderIntConstant = renderIntConstant;
function renderDoubleConstant(node) {
    switch (node.value.type) {
        case thrift_parser_1.SyntaxType.FloatLiteral:
        case thrift_parser_1.SyntaxType.ExponentialLiteral:
            return ts.createLiteral(parseFloat(node.value.value));
        default:
            const msg = node.value;
            throw new Error(`Non-exhaustive match for ${msg}`);
    }
}
exports.renderDoubleConstant = renderDoubleConstant;
function renderMap(fieldType, node, state) {
    const values = node.properties.map(({ name, initializer }) => {
        return ts.createArrayLiteral([
            renderValue(fieldType.keyType, name, state),
            renderValue(fieldType.valueType, initializer, state),
        ]);
    });
    return ts.createNew(identifiers_1.COMMON_IDENTIFIERS.Map, undefined, [
        ts.createArrayLiteral(values),
    ]);
}
function renderSet(fieldType, node, state) {
    const values = node.elements.map((val) => {
        return renderValue(fieldType.valueType, val, state);
    });
    return ts.createNew(identifiers_1.COMMON_IDENTIFIERS.Set, undefined, [
        ts.createArrayLiteral(values),
    ]);
}
function renderList(fieldType, node, state) {
    const values = node.elements.map((val) => {
        return renderValue(fieldType.valueType, val, state);
    });
    return ts.createArrayLiteral(values);
}
function renderBuffer(node) {
    return ts.createCall(utils_1.propertyAccessForIdentifier(identifiers_1.COMMON_IDENTIFIERS.Buffer, 'from'), undefined, [ts.createLiteral(node.value)]);
}
//# sourceMappingURL=values.js.map