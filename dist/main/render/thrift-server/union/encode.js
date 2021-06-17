"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const identifiers_1 = require("../identifiers");
const encode_1 = require("../struct/encode");
const utils_1 = require("../utils");
const types_1 = require("../types");
const utils_2 = require("./utils");
const initializers_1 = require("../initializers");
const utils_3 = require("../struct/utils");
function createEncodeMethod(node, state) {
    return ts.createMethod(undefined, undefined, undefined, identifiers_1.COMMON_IDENTIFIERS.encode, undefined, undefined, [
        utils_1.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.args, ts.createTypeReferenceNode(ts.createIdentifier(utils_3.looseNameForStruct(node, state)), undefined)),
        utils_1.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.output, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TProtocol, undefined)),
    ], types_1.createVoidType(), ts.createBlock([
        utils_2.createFieldIncrementer(),
        ...encode_1.createTempVariables(node, state, false),
        ...checkDefaults(node, state),
        encode_1.writeStructBegin(node.name.value),
        ...node.fields.filter(utils_1.isNotVoid).map((field) => {
            return createWriteForField(node, field, state);
        }),
        encode_1.writeFieldStop(),
        encode_1.writeStructEnd(),
        utils_2.createFieldValidation(utils_2.throwBlockForFieldValidation()),
        ts.createReturn(),
    ], true));
}
exports.createEncodeMethod = createEncodeMethod;
function nullCheckForFields(fields) {
    if (fields.length > 1) {
        const [field, ...remaining] = fields;
        return ts.createBinary(ts.createBinary(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.obj, ts.createIdentifier(field.name.value)), ts.SyntaxKind.EqualsEqualsToken, ts.createNull()), ts.SyntaxKind.AmpersandAmpersandToken, nullCheckForFields(remaining));
    }
    else {
        return ts.createBinary(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.obj, ts.createIdentifier(fields[0].name.value)), ts.SyntaxKind.EqualsEqualsToken, ts.createNull());
    }
}
function checkDefaults(node, state) {
    const defaultField = utils_2.fieldWithDefault(node);
    if (defaultField !== null) {
        return [
            ts.createIf(nullCheckForFields(node.fields), ts.createBlock([
                ts.createStatement(ts.createAssignment(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.obj, ts.createIdentifier(defaultField.name.value)), initializers_1.renderValue(defaultField.fieldType, defaultField.defaultValue, state))),
            ], true)),
        ];
    }
    else {
        return [];
    }
}
function createWriteForField(node, field, state) {
    const isFieldNull = utils_1.createNotNullCheck(`obj.${field.name.value}`);
    const thenWrite = createWriteForFieldType(node, field, ts.createIdentifier(`obj.${field.name.value}`), state);
    const elseThrow = utils_3.throwForField(field);
    return ts.createIf(isFieldNull, thenWrite, elseThrow === undefined ? undefined : ts.createBlock([elseThrow], true));
}
exports.createWriteForField = createWriteForField;
function createWriteForFieldType(node, field, fieldName, state) {
    return ts.createBlock([
        utils_2.incrementFieldsSet(),
        encode_1.writeFieldBegin(field, state),
        ...encode_1.writeValueForField(node, field.fieldType, fieldName, state),
        encode_1.writeFieldEnd(),
    ], true);
}
exports.createWriteForFieldType = createWriteForFieldType;
//# sourceMappingURL=encode.js.map