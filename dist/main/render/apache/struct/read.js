"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const types_1 = require("../types");
const utils_1 = require("../utils");
const utils_2 = require("../../shared/utils");
const identifiers_1 = require("../../shared/identifiers");
const types_2 = require("../types");
const identifiers_2 = require("../identifiers");
const resolver_1 = require("../../../resolver");
const methods_1 = require("./methods");
function createReadMethod(struct, state) {
    const inputParameter = createInputParameter();
    const tempVariable = createTempVariable(struct);
    const ret = utils_2.createConstStatement('ret', ts.createTypeReferenceNode(identifiers_2.THRIFT_IDENTIFIERS.TField, undefined), readFieldBegin());
    const fieldType = utils_2.createConstStatement('fieldType', ts.createTypeReferenceNode(identifiers_2.THRIFT_IDENTIFIERS.Thrift_Type, undefined), utils_2.propertyAccessForIdentifier('ret', 'ftype'));
    const fieldId = utils_2.createConstStatement('fieldId', types_2.createNumberType(), utils_2.propertyAccessForIdentifier('ret', 'fid'));
    const checkStop = ts.createIf(utils_2.createEqualsCheck(identifiers_1.COMMON_IDENTIFIERS.fieldType, identifiers_2.THRIFT_TYPES.STOP), ts.createBlock([ts.createBreak()], true));
    const whileLoop = ts.createWhile(ts.createLiteral(true), ts.createBlock([
        ret,
        fieldType,
        fieldId,
        checkStop,
        ts.createSwitch(identifiers_1.COMMON_IDENTIFIERS.fieldId, ts.createCaseBlock([
            ...struct.fields.map((next) => {
                return createCaseForField(next, state);
            }),
            ts.createDefaultClause([createSkipBlock()]),
        ])),
        readFieldEnd(),
    ], true));
    return ts.createMethod(undefined, [
        ts.createToken(ts.SyntaxKind.PublicKeyword),
        ts.createToken(ts.SyntaxKind.StaticKeyword),
    ], undefined, identifiers_1.COMMON_IDENTIFIERS.read, undefined, undefined, [inputParameter], ts.createTypeReferenceNode(ts.createIdentifier(struct.name.value), undefined), ts.createBlock([
        readStructBegin(),
        ...tempVariable,
        whileLoop,
        readStructEnd(),
        createReturnForStruct(struct),
    ], true));
}
exports.createReadMethod = createReadMethod;
function createTempVariable(struct) {
    if (struct.fields.length > 0) {
        return [
            utils_2.createLetStatement(identifiers_1.COMMON_IDENTIFIERS._args, types_2.createAnyType(), ts.createObjectLiteral()),
        ];
    }
    else {
        return [];
    }
}
function createCheckForFields(fields) {
    return fields
        .filter((next) => {
        return next.requiredness === 'required';
    })
        .map((next) => {
        return ts.createBinary(ts.createIdentifier(`_args.${next.name.value}`), ts.SyntaxKind.ExclamationEqualsEqualsToken, identifiers_1.COMMON_IDENTIFIERS.undefined);
    })
        .reduce((acc, next) => {
        return ts.createBinary(acc, ts.SyntaxKind.AmpersandAmpersandToken, next);
    });
}
function createReturnForStruct(struct) {
    if (utils_2.hasRequiredField(struct)) {
        return ts.createIf(createCheckForFields(struct.fields), ts.createBlock([createReturnValue(struct)], true), ts.createBlock([
            utils_1.throwProtocolException('UNKNOWN', `Unable to read ${struct.name.value} from input`),
        ], true));
    }
    else {
        return createReturnValue(struct);
    }
}
function createReturnValue(struct) {
    return ts.createReturn(ts.createNew(ts.createIdentifier(struct.name.value), undefined, createReturnArgs(struct)));
}
function createReturnArgs(struct) {
    if (struct.fields.length > 0) {
        return [identifiers_1.COMMON_IDENTIFIERS._args];
    }
    else {
        return [];
    }
}
function createInputParameter() {
    return utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.input, ts.createTypeReferenceNode(identifiers_2.THRIFT_IDENTIFIERS.TProtocol, undefined));
}
exports.createInputParameter = createInputParameter;
function createCaseForField(field, state) {
    const fieldAlias = ts.createUniqueName('value');
    const checkType = ts.createIf(utils_2.createEqualsCheck(identifiers_1.COMMON_IDENTIFIERS.fieldType, types_1.thriftTypeForFieldType(field.fieldType, state)), ts.createBlock([
        ...readValueForFieldType(field.fieldType, fieldAlias, state),
        ...endReadForField(fieldAlias, field),
    ], true), createSkipBlock());
    if (field.fieldID !== null) {
        return ts.createCaseClause(ts.createLiteral(field.fieldID.value), [
            checkType,
            ts.createBreak(),
        ]);
    }
    else {
        throw new Error(`FieldID on line ${field.loc.start.line} is null`);
    }
}
exports.createCaseForField = createCaseForField;
function endReadForField(fieldName, field) {
    switch (field.fieldType.type) {
        case thrift_parser_1.SyntaxType.VoidKeyword:
            return [];
        default:
            return [
                utils_2.createAssignmentStatement(ts.createIdentifier(`_args.${field.name.value}`), fieldName),
            ];
    }
}
exports.endReadForField = endReadForField;
function metadataTypeForFieldType(fieldType) {
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.MapType:
            return ts.createTypeReferenceNode(identifiers_2.THRIFT_IDENTIFIERS.TMap, undefined);
        case thrift_parser_1.SyntaxType.SetType:
            return ts.createTypeReferenceNode(identifiers_2.THRIFT_IDENTIFIERS.TSet, undefined);
        case thrift_parser_1.SyntaxType.ListType:
            return ts.createTypeReferenceNode(identifiers_2.THRIFT_IDENTIFIERS.TList, undefined);
        default:
            const msg = fieldType;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
exports.metadataTypeForFieldType = metadataTypeForFieldType;
function readBeginForFieldType(fieldType) {
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.MapType:
            return readMapBegin();
        case thrift_parser_1.SyntaxType.SetType:
            return readSetBegin();
        case thrift_parser_1.SyntaxType.ListType:
            return readListBegin();
        default:
            const msg = fieldType;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
function readEndForFieldType(fieldType) {
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.MapType:
            return readMapEnd();
        case thrift_parser_1.SyntaxType.SetType:
            return readSetEnd();
        case thrift_parser_1.SyntaxType.ListType:
            return readListEnd();
        default:
            const msg = fieldType;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
function loopBody(fieldType, fieldName, state) {
    const value = ts.createUniqueName('value');
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.MapType:
            const key = ts.createUniqueName('key');
            return [
                ...readValueForFieldType(fieldType.keyType, key, state),
                ...readValueForFieldType(fieldType.valueType, value, state),
                utils_2.createMethodCallStatement(fieldName, 'set', [key, value]),
            ];
        case thrift_parser_1.SyntaxType.ListType:
            return [
                ...readValueForFieldType(fieldType.valueType, value, state),
                utils_2.createMethodCallStatement(fieldName, 'push', [value]),
            ];
        case thrift_parser_1.SyntaxType.SetType:
            return [
                ...readValueForFieldType(fieldType.valueType, value, state),
                utils_2.createMethodCallStatement(fieldName, 'add', [value]),
            ];
    }
}
function loopOverContainer(fieldType, fieldName, state) {
    const incrementer = ts.createUniqueName('i');
    const metadata = ts.createUniqueName('metadata');
    const size = ts.createUniqueName('size');
    return [
        utils_2.createConstStatement(metadata, metadataTypeForFieldType(fieldType), readBeginForFieldType(fieldType)),
        utils_2.createConstStatement(size, types_2.createNumberType(), utils_2.propertyAccessForIdentifier(metadata, 'size')),
        ts.createFor(utils_2.createLet(incrementer, types_2.createNumberType(), ts.createLiteral(0)), ts.createLessThan(incrementer, size), ts.createPostfixIncrement(incrementer), ts.createBlock(loopBody(fieldType, fieldName, state), true)),
        ts.createStatement(readEndForFieldType(fieldType)),
    ];
}
function readValueForIdentifier(baseName, definition, fieldType, fieldName, state) {
    switch (definition.type) {
        case thrift_parser_1.SyntaxType.ConstDefinition:
            throw new TypeError(`Identifier ${baseName} is a value being used as a type`);
        case thrift_parser_1.SyntaxType.ServiceDefinition:
            throw new TypeError(`Service ${baseName} is being used as a type`);
        case thrift_parser_1.SyntaxType.StructDefinition:
        case thrift_parser_1.SyntaxType.UnionDefinition:
        case thrift_parser_1.SyntaxType.ExceptionDefinition:
            return [
                utils_2.createConstStatement(fieldName, types_1.typeNodeForFieldType(fieldType, state), ts.createCall(ts.createPropertyAccess(ts.createIdentifier(resolver_1.Resolver.resolveIdentifierName(baseName, {
                    currentNamespace: state.currentNamespace,
                    currentDefinitions: state.currentDefinitions,
                    namespaceMap: state.project.namespaces,
                }).fullName), identifiers_1.COMMON_IDENTIFIERS.read), undefined, [identifiers_1.COMMON_IDENTIFIERS.input])),
            ];
        case thrift_parser_1.SyntaxType.EnumDefinition:
            return [
                utils_2.createConstStatement(fieldName, types_1.typeNodeForFieldType(fieldType, state), utils_2.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, methods_1.READ_METHODS[thrift_parser_1.SyntaxType.I32Keyword])),
            ];
        case thrift_parser_1.SyntaxType.TypedefDefinition:
            return readValueForFieldType(definition.definitionType, fieldName, state);
        default:
            const msg = definition;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
exports.readValueForIdentifier = readValueForIdentifier;
function readValueForFieldType(fieldType, fieldName, state) {
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.Identifier:
            const result = resolver_1.Resolver.resolveIdentifierDefinition(fieldType, {
                currentNamespace: state.currentNamespace,
                namespaceMap: state.project.namespaces,
            });
            return readValueForIdentifier(fieldType.value, result.definition, fieldType, fieldName, state);
        case thrift_parser_1.SyntaxType.BoolKeyword:
        case thrift_parser_1.SyntaxType.ByteKeyword:
        case thrift_parser_1.SyntaxType.BinaryKeyword:
        case thrift_parser_1.SyntaxType.StringKeyword:
        case thrift_parser_1.SyntaxType.DoubleKeyword:
        case thrift_parser_1.SyntaxType.I8Keyword:
        case thrift_parser_1.SyntaxType.I16Keyword:
        case thrift_parser_1.SyntaxType.I32Keyword:
        case thrift_parser_1.SyntaxType.I64Keyword:
            return [
                utils_2.createConstStatement(fieldName, types_1.typeNodeForFieldType(fieldType, state), utils_2.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, methods_1.READ_METHODS[fieldType.type])),
            ];
        case thrift_parser_1.SyntaxType.MapType:
            return [
                utils_2.createConstStatement(fieldName, types_1.typeNodeForFieldType(fieldType, state), ts.createNew(identifiers_1.COMMON_IDENTIFIERS.Map, [
                    types_1.typeNodeForFieldType(fieldType.keyType, state),
                    types_1.typeNodeForFieldType(fieldType.valueType, state),
                ], [])),
                ...loopOverContainer(fieldType, fieldName, state),
            ];
        case thrift_parser_1.SyntaxType.ListType:
            return [
                utils_2.createConstStatement(fieldName, types_1.typeNodeForFieldType(fieldType, state), ts.createNew(identifiers_1.COMMON_IDENTIFIERS.Array, [types_1.typeNodeForFieldType(fieldType.valueType, state)], [])),
                ...loopOverContainer(fieldType, fieldName, state),
            ];
        case thrift_parser_1.SyntaxType.SetType:
            return [
                utils_2.createConstStatement(fieldName, types_1.typeNodeForFieldType(fieldType, state), ts.createNew(identifiers_1.COMMON_IDENTIFIERS.Set, [types_1.typeNodeForFieldType(fieldType.valueType, state)], [])),
                ...loopOverContainer(fieldType, fieldName, state),
            ];
        case thrift_parser_1.SyntaxType.VoidKeyword:
            return [
                utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, 'skip', [
                    identifiers_1.COMMON_IDENTIFIERS.fieldType,
                ]),
            ];
        default:
            const msg = fieldType;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
exports.readValueForFieldType = readValueForFieldType;
function readStructBegin() {
    return utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, identifiers_1.COMMON_IDENTIFIERS.readStructBegin);
}
exports.readStructBegin = readStructBegin;
function readStructEnd() {
    return utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, identifiers_1.COMMON_IDENTIFIERS.readStructEnd);
}
exports.readStructEnd = readStructEnd;
function readFieldBegin() {
    return utils_2.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, 'readFieldBegin');
}
exports.readFieldBegin = readFieldBegin;
function readFieldEnd() {
    return utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, 'readFieldEnd');
}
exports.readFieldEnd = readFieldEnd;
function readMapBegin() {
    return utils_2.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, 'readMapBegin');
}
exports.readMapBegin = readMapBegin;
function readMapEnd() {
    return utils_2.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, 'readMapEnd');
}
exports.readMapEnd = readMapEnd;
function readListBegin() {
    return utils_2.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, 'readListBegin');
}
exports.readListBegin = readListBegin;
function readListEnd() {
    return utils_2.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, 'readListEnd');
}
exports.readListEnd = readListEnd;
function readSetBegin() {
    return utils_2.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, 'readSetBegin');
}
exports.readSetBegin = readSetBegin;
function readSetEnd() {
    return utils_2.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, 'readSetEnd');
}
exports.readSetEnd = readSetEnd;
function createSkipBlock() {
    return ts.createBlock([createSkipStatement()], true);
}
exports.createSkipBlock = createSkipBlock;
function createSkipStatement() {
    return utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, 'skip', [
        identifiers_1.COMMON_IDENTIFIERS.fieldType,
    ]);
}
//# sourceMappingURL=read.js.map