"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const identifiers_1 = require("../identifiers");
const types_1 = require("../types");
const utils_1 = require("../utils");
const decode_1 = require("../struct/decode");
const utils_2 = require("../struct/utils");
const union_fields_1 = require("./union-fields");
const utils_3 = require("./utils");
function createDecodeMethod(node, state) {
    const inputParameter = decode_1.createInputParameter();
    const returnVariable = utils_3.createReturnVariable();
    const fieldsSet = utils_3.createFieldIncrementer();
    const ret = utils_1.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.ret, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IThriftField, undefined), decode_1.readFieldBegin());
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
                return createCaseForField(node, next, state);
            }),
            ts.createDefaultClause([decode_1.createSkipBlock()]),
        ])),
        decode_1.readFieldEnd(),
    ], true));
    return ts.createMethod(undefined, undefined, undefined, identifiers_1.COMMON_IDENTIFIERS.decode, undefined, undefined, [inputParameter], ts.createTypeReferenceNode(ts.createIdentifier(utils_2.strictNameForStruct(node, state)), undefined), ts.createBlock([
        fieldsSet,
        returnVariable,
        decode_1.readStructBegin(),
        whileLoop,
        decode_1.readStructEnd(),
        utils_3.createFieldValidation(utils_3.throwBlockForFieldValidation()),
        createEndReturn(node, state),
    ], true));
}
exports.createDecodeMethod = createDecodeMethod;
function createEndReturn(node, state) {
    if (node.fields.length > 0) {
        return ts.createIf(ts.createBinary(identifiers_1.COMMON_IDENTIFIERS._returnValue, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.createNull()), ts.createBlock([createReturnForFields(node, node.fields, state)], true), ts.createBlock([
            utils_1.throwProtocolException('UNKNOWN', 'Unable to read data for TUnion'),
        ], true));
    }
    else {
        return utils_1.throwProtocolException('UNKNOWN', 'Unable to read data for TUnion');
    }
}
function createUnionObjectForField(node, field, state) {
    const properties = [
        ts.createPropertyAssignment(ts.createIdentifier(field.name.value), ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS._returnValue, field.name.value)),
    ];
    if (state.options.strictUnions) {
        properties.unshift(ts.createPropertyAssignment(identifiers_1.COMMON_IDENTIFIERS.__type, ts.createIdentifier(union_fields_1.fieldTypeAccess(node, field, state))));
    }
    if (state.options.withNameField) {
        properties.unshift(ts.createPropertyAssignment(identifiers_1.COMMON_IDENTIFIERS.__name, ts.createLiteral(node.name.value)));
    }
    return ts.createObjectLiteral(properties, true);
}
function createReturnForFields(node, fields, state) {
    const [head, ...tail] = fields;
    if (tail.length > 0) {
        return ts.createIf(ts.createBinary(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS._returnValue, head.name.value), ts.SyntaxKind.ExclamationEqualsEqualsToken, identifiers_1.COMMON_IDENTIFIERS.undefined), ts.createBlock([ts.createReturn(createUnionObjectForField(node, head, state))], true), ts.createBlock([createReturnForFields(node, tail, state)]));
    }
    else {
        return ts.createReturn(createUnionObjectForField(node, head, state));
    }
}
exports.createReturnForFields = createReturnForFields;
function createCaseForField(node, field, state) {
    const fieldAlias = ts.createUniqueName('value');
    const checkType = ts.createIf(utils_1.createEqualsCheck(identifiers_1.COMMON_IDENTIFIERS.fieldType, types_1.thriftTypeForFieldType(field.fieldType, state)), ts.createBlock([
        utils_3.incrementFieldsSet(),
        ...decode_1.readValueForFieldType(field.fieldType, fieldAlias, state),
        ...endReadForField(fieldAlias, field),
    ], true), decode_1.createSkipBlock());
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
                ts.createStatement(ts.createAssignment(identifiers_1.COMMON_IDENTIFIERS._returnValue, ts.createObjectLiteral([
                    ts.createPropertyAssignment(field.name.value, fieldName),
                ]))),
            ];
    }
}
exports.endReadForField = endReadForField;
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
//# sourceMappingURL=decode.js.map