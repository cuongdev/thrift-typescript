"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const identifiers_1 = require("../identifiers");
const types_1 = require("../types");
const utils_1 = require("../utils");
const methods_1 = require("./methods");
const resolver_1 = require("../../../resolver");
const utils_2 = require("./utils");
function createTempVariables(node) {
    if (node.fields.length > 0) {
        return [
            utils_1.createLetStatement(identifiers_1.COMMON_IDENTIFIERS._args, types_1.createAnyType(), ts.createObjectLiteral()),
        ];
    }
    else {
        return [];
    }
}
exports.createTempVariables = createTempVariables;
function createDecodeMethod(node, state) {
    const inputParameter = createInputParameter();
    const tempVariables = createTempVariables(node);
    const ret = utils_1.createConstStatement('ret', ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IThriftField, undefined), readFieldBegin());
    const fieldType = utils_1.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.fieldType, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.Thrift_Type, undefined), utils_1.propertyAccessForIdentifier(identifiers_1.COMMON_IDENTIFIERS.ret, identifiers_1.COMMON_IDENTIFIERS.fieldType));
    const fieldId = utils_1.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.fieldId, types_1.createNumberType(), utils_1.propertyAccessForIdentifier(identifiers_1.COMMON_IDENTIFIERS.ret, identifiers_1.COMMON_IDENTIFIERS.fieldId));
    const checkStop = ts.createIf(utils_1.createEqualsCheck(identifiers_1.COMMON_IDENTIFIERS.fieldType, identifiers_1.THRIFT_TYPES.STOP), ts.createBlock([ts.createBreak()], true));
    const whileLoop = ts.createWhile(ts.createLiteral(true), ts.createBlock([
        ret,
        fieldType,
        fieldId,
        checkStop,
        ts.createSwitch(identifiers_1.COMMON_IDENTIFIERS.fieldId, ts.createCaseBlock([
            ...node.fields.map((next) => {
                return createCaseForField(next, state);
            }),
            ts.createDefaultClause([createSkipBlock()]),
        ])),
        readFieldEnd(),
    ], true));
    return ts.createMethod(undefined, undefined, undefined, identifiers_1.COMMON_IDENTIFIERS.decode, undefined, undefined, [inputParameter], ts.createTypeReferenceNode(ts.createIdentifier(utils_2.strictNameForStruct(node, state)), undefined), ts.createBlock([
        ...tempVariables,
        readStructBegin(),
        whileLoop,
        readStructEnd(),
        createReturnForStruct(node, state),
    ], true));
}
exports.createDecodeMethod = createDecodeMethod;
function createInputParameter() {
    return utils_1.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.input, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TProtocol, undefined));
}
exports.createInputParameter = createInputParameter;
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
exports.createCheckForFields = createCheckForFields;
function createCaseForField(field, state) {
    const fieldAlias = ts.createUniqueName('value');
    const checkType = ts.createIf(utils_1.createEqualsCheck(identifiers_1.COMMON_IDENTIFIERS.fieldType, types_1.thriftTypeForFieldType(field.fieldType, state)), ts.createBlock([
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
                utils_1.createAssignmentStatement(ts.createIdentifier(`_args.${field.name.value}`), fieldName),
            ];
    }
}
exports.endReadForField = endReadForField;
function createReturnForStruct(node, state) {
    if (utils_1.hasRequiredField(node)) {
        return ts.createIf(createCheckForFields(node.fields), ts.createBlock([createReturnValue(node, state)], true), ts.createBlock([
            utils_1.throwProtocolException('UNKNOWN', `Unable to read ${node.name.value} from input`),
        ], true));
    }
    else {
        return createReturnValue(node, state);
    }
}
exports.createReturnForStruct = createReturnForStruct;
function createReturnValue(node, state) {
    if (state.options.withNameField) {
        return ts.createReturn(ts.createObjectLiteral([
            ts.createPropertyAssignment(identifiers_1.COMMON_IDENTIFIERS.__name, ts.createLiteral(node.name.value)),
            ...node.fields.map((next) => {
                return ts.createPropertyAssignment(next.name.value, utils_1.getInitializerForField(identifiers_1.COMMON_IDENTIFIERS._args, next, state));
            }),
        ], true));
    }
    else {
        return ts.createReturn(ts.createObjectLiteral(node.fields.map((next) => {
            return ts.createPropertyAssignment(next.name.value, utils_1.getInitializerForField(identifiers_1.COMMON_IDENTIFIERS._args, next, state));
        }), true));
    }
}
function readValueForIdentifier(id, definition, fieldType, fieldName, state) {
    switch (definition.type) {
        case thrift_parser_1.SyntaxType.ConstDefinition:
            throw new TypeError(`Identifier ${definition.name.value} is a value being used as a type`);
        case thrift_parser_1.SyntaxType.ServiceDefinition:
            throw new TypeError(`Service ${definition.name.value} is being used as a type`);
        case thrift_parser_1.SyntaxType.StructDefinition:
        case thrift_parser_1.SyntaxType.UnionDefinition:
        case thrift_parser_1.SyntaxType.ExceptionDefinition:
            return [
                utils_1.createConstStatement(fieldName, types_1.typeNodeForFieldType(fieldType, state), ts.createCall(ts.createPropertyAccess(ts.createIdentifier(utils_2.toolkitName(id, state)), identifiers_1.COMMON_IDENTIFIERS.decode), undefined, [identifiers_1.COMMON_IDENTIFIERS.input])),
            ];
        case thrift_parser_1.SyntaxType.EnumDefinition:
            return [
                utils_1.createConstStatement(fieldName, types_1.typeNodeForFieldType(fieldType, state), utils_1.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, methods_1.READ_METHODS[thrift_parser_1.SyntaxType.I32Keyword])),
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
                utils_1.createConstStatement(fieldName, types_1.typeNodeForFieldType(fieldType, state), utils_1.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, methods_1.READ_METHODS[fieldType.type])),
            ];
        case thrift_parser_1.SyntaxType.MapType:
            return [
                utils_1.createConstStatement(fieldName, types_1.typeNodeForFieldType(fieldType, state), ts.createNew(identifiers_1.COMMON_IDENTIFIERS.Map, [
                    types_1.typeNodeForFieldType(fieldType.keyType, state),
                    types_1.typeNodeForFieldType(fieldType.valueType, state),
                ], [])),
                ...loopOverContainer(fieldType, fieldName, state),
            ];
        case thrift_parser_1.SyntaxType.ListType:
            return [
                utils_1.createConstStatement(fieldName, types_1.typeNodeForFieldType(fieldType, state), ts.createNew(identifiers_1.COMMON_IDENTIFIERS.Array, [types_1.typeNodeForFieldType(fieldType.valueType, state)], [])),
                ...loopOverContainer(fieldType, fieldName, state),
            ];
        case thrift_parser_1.SyntaxType.SetType:
            return [
                utils_1.createConstStatement(fieldName, types_1.typeNodeForFieldType(fieldType, state), ts.createNew(identifiers_1.COMMON_IDENTIFIERS.Set, [types_1.typeNodeForFieldType(fieldType.valueType, state)], [])),
                ...loopOverContainer(fieldType, fieldName, state),
            ];
        case thrift_parser_1.SyntaxType.VoidKeyword:
            return [
                utils_1.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, 'skip', [
                    identifiers_1.COMMON_IDENTIFIERS.fieldType,
                ]),
            ];
        default:
            const msg = fieldType;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
exports.readValueForFieldType = readValueForFieldType;
function loopOverContainer(fieldType, fieldName, state) {
    const incrementer = ts.createUniqueName('i');
    const metadata = ts.createUniqueName('metadata');
    const size = ts.createUniqueName('size');
    return [
        utils_1.createConstStatement(metadata, metadataTypeForFieldType(fieldType), readBeginForFieldType(fieldType)),
        utils_1.createConstStatement(size, types_1.createNumberType(), utils_1.propertyAccessForIdentifier(metadata, 'size')),
        ts.createFor(utils_1.createLet(incrementer, types_1.createNumberType(), ts.createLiteral(0)), ts.createLessThan(incrementer, size), ts.createPostfixIncrement(incrementer), ts.createBlock(loopBody(fieldType, fieldName, state), true)),
        ts.createStatement(readEndForFieldType(fieldType)),
    ];
}
function metadataTypeForFieldType(fieldType) {
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.MapType:
            return ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IThriftMap, undefined);
        case thrift_parser_1.SyntaxType.SetType:
            return ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IThriftSet, undefined);
        case thrift_parser_1.SyntaxType.ListType:
            return ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IThriftList, undefined);
        default:
            const msg = fieldType;
            throw new Error(`Non-exhaustive match for: ${msg}`);
    }
}
exports.metadataTypeForFieldType = metadataTypeForFieldType;
function loopBody(fieldType, fieldName, state) {
    const value = ts.createUniqueName('value');
    switch (fieldType.type) {
        case thrift_parser_1.SyntaxType.MapType:
            const key = ts.createUniqueName('key');
            return [
                ...readValueForFieldType(fieldType.keyType, key, state),
                ...readValueForFieldType(fieldType.valueType, value, state),
                utils_1.createMethodCallStatement(fieldName, 'set', [key, value]),
            ];
        case thrift_parser_1.SyntaxType.ListType:
            return [
                ...readValueForFieldType(fieldType.valueType, value, state),
                utils_1.createMethodCallStatement(fieldName, 'push', [value]),
            ];
        case thrift_parser_1.SyntaxType.SetType:
            return [
                ...readValueForFieldType(fieldType.valueType, value, state),
                utils_1.createMethodCallStatement(fieldName, 'add', [value]),
            ];
    }
}
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
function readStructBegin() {
    return utils_1.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, identifiers_1.COMMON_IDENTIFIERS.readStructBegin);
}
exports.readStructBegin = readStructBegin;
function readStructEnd() {
    return utils_1.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, identifiers_1.COMMON_IDENTIFIERS.readStructEnd);
}
exports.readStructEnd = readStructEnd;
function readFieldBegin() {
    return utils_1.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, 'readFieldBegin');
}
exports.readFieldBegin = readFieldBegin;
function readFieldEnd() {
    return utils_1.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, 'readFieldEnd');
}
exports.readFieldEnd = readFieldEnd;
function readMapBegin() {
    return utils_1.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, 'readMapBegin');
}
exports.readMapBegin = readMapBegin;
function readMapEnd() {
    return utils_1.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, 'readMapEnd');
}
exports.readMapEnd = readMapEnd;
function readListBegin() {
    return utils_1.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, 'readListBegin');
}
exports.readListBegin = readListBegin;
function readListEnd() {
    return utils_1.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, 'readListEnd');
}
exports.readListEnd = readListEnd;
function readSetBegin() {
    return utils_1.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, 'readSetBegin');
}
exports.readSetBegin = readSetBegin;
function readSetEnd() {
    return utils_1.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, 'readSetEnd');
}
exports.readSetEnd = readSetEnd;
function createSkipBlock() {
    return ts.createBlock([createSkipStatement()], true);
}
exports.createSkipBlock = createSkipBlock;
function createSkipStatement() {
    return utils_1.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, 'skip', [
        identifiers_1.COMMON_IDENTIFIERS.fieldType,
    ]);
}
//# sourceMappingURL=decode.js.map