"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const utils_1 = require("../utils");
const types_1 = require("../types");
const identifiers_1 = require("../identifiers");
const resolver_1 = require("../../../resolver");
const methods_1 = require("./methods");
function isNotVoid(field) {
    return field.fieldType.type !== thrift_parser_1.SyntaxType.VoidKeyword;
}
function createWriteMethod(struct, state) {
    const fieldWrites = struct.fields
        .filter(isNotVoid)
        .map((field) => {
        return createWriteForField(struct, field, state);
    });
    const inputParameter = utils_1.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.output, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TProtocol, undefined));
    return utils_1.createPublicMethod(identifiers_1.COMMON_IDENTIFIERS.write, [inputParameter], types_1.createVoidType(), [
        writeStructBegin(struct.name.value),
        ...fieldWrites,
        writeFieldStop(),
        writeStructEnd(),
        ts.createReturn(),
    ]);
}
exports.createWriteMethod = createWriteMethod;
function createWriteForField(struct, field, state) {
    return ts.createIf(utils_1.createNotNullCheck(`this.${field.name.value}`), createWriteForFieldType(struct, field, ts.createIdentifier(`this.${field.name.value}`), state), undefined);
}
exports.createWriteForField = createWriteForField;
function createWriteForFieldType(struct, field, fieldName, state) {
    return ts.createBlock([
        writeFieldBegin(field, state),
        ...writeValueForField(struct, field.fieldType, fieldName, state),
        writeFieldEnd(),
    ]);
}
exports.createWriteForFieldType = createWriteForFieldType;
function writeValueForIdentifier(definition, node, fieldName, state) {
    switch (definition.type) {
        case thrift_parser_1.SyntaxType.ConstDefinition:
            throw new TypeError(`Identifier ${definition.name.value} is a value being used as a type`);
        case thrift_parser_1.SyntaxType.ServiceDefinition:
            throw new TypeError(`Service ${definition.name.value} is being used as a type`);
        case thrift_parser_1.SyntaxType.StructDefinition:
        case thrift_parser_1.SyntaxType.UnionDefinition:
        case thrift_parser_1.SyntaxType.ExceptionDefinition:
            return [
                utils_1.createMethodCall(fieldName, identifiers_1.COMMON_IDENTIFIERS.write, [
                    identifiers_1.COMMON_IDENTIFIERS.output,
                ]),
            ];
        case thrift_parser_1.SyntaxType.EnumDefinition:
            return [
                writeMethodForName(methods_1.WRITE_METHODS[thrift_parser_1.SyntaxType.I32Keyword], fieldName),
            ];
        case thrift_parser_1.SyntaxType.TypedefDefinition:
            return writeValueForType(node, definition.definitionType, fieldName, state);
        default:
            const msg = definition;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
exports.writeValueForIdentifier = writeValueForIdentifier;
function writeValueForType(struct, fieldType, fieldName, state) {
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.Identifier:
            const result = resolver_1.Resolver.resolveIdentifierDefinition(fieldType, {
                currentNamespace: state.currentNamespace,
                namespaceMap: state.project.namespaces,
            });
            return writeValueForIdentifier(result.definition, struct, fieldName, state);
        case thrift_parser_1.SyntaxType.SetType:
            return [
                writeSetBegin(fieldType, fieldName, state),
                forEach(struct, fieldType, fieldName, state),
                writeSetEnd(),
            ];
        case thrift_parser_1.SyntaxType.MapType:
            return [
                writeMapBegin(fieldType, fieldName, state),
                forEach(struct, fieldType, fieldName, state),
                writeMapEnd(),
            ];
        case thrift_parser_1.SyntaxType.ListType:
            return [
                writeListBegin(fieldType, fieldName, state),
                forEach(struct, fieldType, fieldName, state),
                writeListEnd(),
            ];
        case thrift_parser_1.SyntaxType.BoolKeyword:
        case thrift_parser_1.SyntaxType.BinaryKeyword:
        case thrift_parser_1.SyntaxType.StringKeyword:
        case thrift_parser_1.SyntaxType.DoubleKeyword:
        case thrift_parser_1.SyntaxType.I8Keyword:
        case thrift_parser_1.SyntaxType.ByteKeyword:
        case thrift_parser_1.SyntaxType.I16Keyword:
        case thrift_parser_1.SyntaxType.I32Keyword:
        case thrift_parser_1.SyntaxType.I64Keyword:
            return [
                writeMethodForName(methods_1.WRITE_METHODS[fieldType.type], fieldName),
            ];
        case thrift_parser_1.SyntaxType.VoidKeyword:
            return [];
        default:
            const msg = fieldType;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
exports.writeValueForType = writeValueForType;
function writeMethodForName(methodName, fieldName) {
    return utils_1.createMethodCall('output', methodName, [fieldName]);
}
function writeValueForField(struct, fieldType, fieldName, state) {
    return writeValueForType(struct, fieldType, fieldName, state).map(ts.createStatement);
}
function forEach(struct, fieldType, fieldName, state) {
    const value = ts.createUniqueName('value');
    const forEachParameters = [
        utils_1.createFunctionParameter(value, types_1.typeNodeForFieldType(fieldType.valueType, state)),
    ];
    const forEachStatements = [
        ...writeValueForField(struct, fieldType.valueType, value, state),
    ];
    if (fieldType.type === thrift_parser_1.SyntaxType.MapType) {
        const key = ts.createUniqueName('key');
        forEachParameters.push(utils_1.createFunctionParameter(key, types_1.typeNodeForFieldType(fieldType.keyType, state)));
        forEachStatements.unshift(...writeValueForField(struct, fieldType.keyType, key, state));
    }
    return utils_1.createMethodCall(fieldName, 'forEach', [
        ts.createArrowFunction(undefined, undefined, forEachParameters, types_1.createVoidType(), ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken), ts.createBlock(forEachStatements, true)),
    ]);
}
function writeStructBegin(structName) {
    return utils_1.createMethodCallStatement('output', 'writeStructBegin', [
        ts.createLiteral(structName),
    ]);
}
function writeStructEnd() {
    return utils_1.createMethodCallStatement('output', 'writeStructEnd');
}
function writeMapBegin(fieldType, fieldName, state) {
    return utils_1.createMethodCall('output', 'writeMapBegin', [
        types_1.thriftTypeForFieldType(fieldType.keyType, state),
        types_1.thriftTypeForFieldType(fieldType.valueType, state),
        utils_1.propertyAccessForIdentifier(fieldName, 'size'),
    ]);
}
function writeMapEnd() {
    return utils_1.createMethodCall('output', 'writeMapEnd');
}
function writeListBegin(fieldType, fieldName, state) {
    return utils_1.createMethodCall('output', 'writeListBegin', [
        types_1.thriftTypeForFieldType(fieldType.valueType, state),
        utils_1.propertyAccessForIdentifier(fieldName, 'length'),
    ]);
}
function writeListEnd() {
    return utils_1.createMethodCall('output', 'writeListEnd');
}
function writeSetBegin(fieldType, fieldName, state) {
    return utils_1.createMethodCall('output', 'writeSetBegin', [
        types_1.thriftTypeForFieldType(fieldType.valueType, state),
        utils_1.propertyAccessForIdentifier(fieldName, 'size'),
    ]);
}
function writeSetEnd() {
    return utils_1.createMethodCall('output', 'writeSetEnd');
}
function writeFieldBegin(field, state) {
    if (field.fieldID !== null) {
        return utils_1.createMethodCallStatement('output', 'writeFieldBegin', [
            ts.createLiteral(field.name.value),
            types_1.thriftTypeForFieldType(field.fieldType, state),
            ts.createLiteral(field.fieldID.value),
        ]);
    }
    else {
        throw new Error(`FieldID on line ${field.loc.start.line} is null`);
    }
}
function writeFieldEnd() {
    return utils_1.createMethodCallStatement('output', 'writeFieldEnd');
}
function writeFieldStop() {
    return utils_1.createMethodCallStatement('output', 'writeFieldStop');
}
//# sourceMappingURL=write.js.map