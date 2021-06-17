"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const identifiers_1 = require("../identifiers");
const methods_1 = require("./methods");
const resolver_1 = require("../../../resolver");
const utils_1 = require("../utils");
const types_1 = require("../types");
const utils_2 = require("./utils");
function createTempVariables(node, state, withDefault = true) {
    const structFields = node.fields.filter((next) => {
        return next.fieldType.type !== thrift_parser_1.SyntaxType.VoidKeyword;
    });
    if (structFields.length > 0) {
        return [
            utils_1.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.obj, types_1.createAnyType(), ts.createObjectLiteral(node.fields.map((next) => {
                return ts.createPropertyAssignment(next.name.value, utils_1.getInitializerForField(identifiers_1.COMMON_IDENTIFIERS.args, next, state, withDefault, true));
            }), true)),
        ];
    }
    else {
        return [];
    }
}
exports.createTempVariables = createTempVariables;
function createEncodeMethod(node, state) {
    const tempVariables = createTempVariables(node, state);
    return ts.createMethod(undefined, undefined, undefined, identifiers_1.COMMON_IDENTIFIERS.encode, undefined, undefined, [
        utils_1.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.args, ts.createTypeReferenceNode(ts.createIdentifier(utils_2.looseNameForStruct(node, state)), undefined)),
        utils_1.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.output, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TProtocol, undefined)),
    ], types_1.createVoidType(), ts.createBlock([
        ...tempVariables,
        writeStructBegin(node.name.value),
        ...node.fields.filter(utils_1.isNotVoid).map((field) => {
            return createWriteForField(node, field, state);
        }),
        writeFieldStop(),
        writeStructEnd(),
        ts.createReturn(),
    ], true));
}
exports.createEncodeMethod = createEncodeMethod;
function createWriteForField(node, field, state) {
    const isFieldNull = utils_1.createNotNullCheck(`obj.${field.name.value}`);
    const thenWrite = createWriteForFieldType(node, field, ts.createIdentifier(`obj.${field.name.value}`), state);
    const elseThrow = utils_2.throwForField(field);
    return ts.createIf(isFieldNull, thenWrite, elseThrow === undefined ? undefined : ts.createBlock([elseThrow], true));
}
exports.createWriteForField = createWriteForField;
function createWriteForFieldType(node, field, fieldName, state) {
    return ts.createBlock([
        writeFieldBegin(field, state),
        ...writeValueForField(node, field.fieldType, fieldName, state),
        writeFieldEnd(),
    ]);
}
exports.createWriteForFieldType = createWriteForFieldType;
function writeValueForIdentifier(id, definition, node, fieldName, state) {
    switch (definition.type) {
        case thrift_parser_1.SyntaxType.ConstDefinition:
            throw new TypeError(`Identifier[${definition.name.value}] is a value being used as a type`);
        case thrift_parser_1.SyntaxType.ServiceDefinition:
            throw new TypeError(`Service[${definition.name.value}] is being used as a type`);
        case thrift_parser_1.SyntaxType.StructDefinition:
        case thrift_parser_1.SyntaxType.UnionDefinition:
        case thrift_parser_1.SyntaxType.ExceptionDefinition:
            return [
                utils_1.createMethodCall(ts.createIdentifier(utils_2.toolkitName(id, state)), 'encode', [fieldName, identifiers_1.COMMON_IDENTIFIERS.output]),
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
function writeValueForType(node, fieldType, fieldName, state) {
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.Identifier:
            const result = resolver_1.Resolver.resolveIdentifierDefinition(fieldType, {
                currentNamespace: state.currentNamespace,
                namespaceMap: state.project.namespaces,
            });
            return writeValueForIdentifier(fieldType.value, result.definition, node, fieldName, state);
        case thrift_parser_1.SyntaxType.SetType:
            return [
                writeSetBegin(fieldType, fieldName, state),
                forEach(node, fieldType, fieldName, state),
                writeSetEnd(),
            ];
        case thrift_parser_1.SyntaxType.MapType:
            return [
                writeMapBegin(fieldType, fieldName, state),
                forEach(node, fieldType, fieldName, state),
                writeMapEnd(),
            ];
        case thrift_parser_1.SyntaxType.ListType:
            return [
                writeListBegin(fieldType, fieldName, state),
                forEach(node, fieldType, fieldName, state),
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
            return [
                writeMethodForName(methods_1.WRITE_METHODS[fieldType.type], fieldName),
            ];
        case thrift_parser_1.SyntaxType.I64Keyword:
            return [
                writeMethodForName(methods_1.WRITE_METHODS[fieldType.type], utils_1.coerceType(fieldName, fieldType)),
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
function writeValueForField(node, fieldType, fieldName, state) {
    return writeValueForType(node, fieldType, fieldName, state).map(ts.createStatement);
}
exports.writeValueForField = writeValueForField;
function forEach(node, fieldType, fieldName, state) {
    const value = ts.createUniqueName('value');
    const forEachParameters = [
        utils_1.createFunctionParameter(value, types_1.typeNodeForFieldType(fieldType.valueType, state, true)),
    ];
    const forEachStatements = [
        ...writeValueForField(node, fieldType.valueType, value, state),
    ];
    if (fieldType.type === thrift_parser_1.SyntaxType.MapType) {
        const key = ts.createUniqueName('key');
        forEachParameters.push(utils_1.createFunctionParameter(key, types_1.typeNodeForFieldType(fieldType.keyType, state, true)));
        forEachStatements.unshift(...writeValueForField(node, fieldType.keyType, key, state));
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
exports.writeStructBegin = writeStructBegin;
function writeStructEnd() {
    return utils_1.createMethodCallStatement('output', 'writeStructEnd');
}
exports.writeStructEnd = writeStructEnd;
function writeMapBegin(fieldType, fieldName, state) {
    return utils_1.createMethodCall('output', 'writeMapBegin', [
        types_1.thriftTypeForFieldType(fieldType.keyType, state),
        types_1.thriftTypeForFieldType(fieldType.valueType, state),
        utils_1.propertyAccessForIdentifier(fieldName, 'size'),
    ]);
}
exports.writeMapBegin = writeMapBegin;
function writeMapEnd() {
    return utils_1.createMethodCall('output', 'writeMapEnd');
}
exports.writeMapEnd = writeMapEnd;
function writeListBegin(fieldType, fieldName, state) {
    return utils_1.createMethodCall('output', 'writeListBegin', [
        types_1.thriftTypeForFieldType(fieldType.valueType, state),
        utils_1.propertyAccessForIdentifier(fieldName, 'length'),
    ]);
}
exports.writeListBegin = writeListBegin;
function writeListEnd() {
    return utils_1.createMethodCall('output', 'writeListEnd');
}
exports.writeListEnd = writeListEnd;
function writeSetBegin(fieldType, fieldName, state) {
    return utils_1.createMethodCall('output', 'writeSetBegin', [
        types_1.thriftTypeForFieldType(fieldType.valueType, state),
        utils_1.propertyAccessForIdentifier(fieldName, 'size'),
    ]);
}
exports.writeSetBegin = writeSetBegin;
function writeSetEnd() {
    return utils_1.createMethodCall('output', 'writeSetEnd');
}
exports.writeSetEnd = writeSetEnd;
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
exports.writeFieldBegin = writeFieldBegin;
function writeFieldEnd() {
    return utils_1.createMethodCallStatement('output', 'writeFieldEnd');
}
exports.writeFieldEnd = writeFieldEnd;
function writeFieldStop() {
    return utils_1.createMethodCallStatement('output', 'writeFieldStop');
}
exports.writeFieldStop = writeFieldStop;
//# sourceMappingURL=encode.js.map