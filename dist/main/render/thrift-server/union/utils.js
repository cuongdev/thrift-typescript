"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const utils_1 = require("../utils");
const identifiers_1 = require("../../shared/identifiers");
const reader_1 = require("../struct/reader");
const types_1 = require("../types");
const utils_2 = require("../utils");
function createReturnVariable() {
    return utils_1.createLetStatement(identifiers_1.COMMON_IDENTIFIERS._returnValue, types_1.createAnyType(), ts.createNull());
}
exports.createReturnVariable = createReturnVariable;
function createFieldIncrementer() {
    return utils_1.createLetStatement(identifiers_1.COMMON_IDENTIFIERS._fieldsSet, types_1.createNumberType(), ts.createLiteral(0));
}
exports.createFieldIncrementer = createFieldIncrementer;
function incrementFieldsSet() {
    return ts.createStatement(ts.createPostfixIncrement(identifiers_1.COMMON_IDENTIFIERS._fieldsSet));
}
exports.incrementFieldsSet = incrementFieldsSet;
function fieldWithDefault(node) {
    const len = node.fields.length;
    for (let i = 0; i < len; i++) {
        const field = node.fields[i];
        if (field.defaultValue !== null) {
            return field;
        }
    }
    return null;
}
exports.fieldWithDefault = fieldWithDefault;
function createFieldValidation(thenBlock) {
    return ts.createIf(ts.createBinary(identifiers_1.COMMON_IDENTIFIERS._fieldsSet, ts.SyntaxKind.GreaterThanToken, ts.createLiteral(1)), ts.createBlock([
        utils_1.throwProtocolException('INVALID_DATA', 'TUnion cannot have more than one value'),
    ], true), ts.createIf(ts.createBinary(identifiers_1.COMMON_IDENTIFIERS._fieldsSet, ts.SyntaxKind.LessThanToken, ts.createLiteral(1)), thenBlock));
}
exports.createFieldValidation = createFieldValidation;
function throwBlockForFieldValidation() {
    return ts.createBlock([
        utils_1.throwProtocolException('INVALID_DATA', 'TUnion must have one value set'),
    ], true);
}
exports.throwBlockForFieldValidation = throwBlockForFieldValidation;
function returnAssignment(valueName, field) {
    return ts.createStatement(ts.createAssignment(identifiers_1.COMMON_IDENTIFIERS._returnValue, ts.createObjectLiteral([
        ts.createPropertyAssignment(field.name.value, valueName),
    ])));
}
function assignmentForField(field, state) {
    if (state.options.strictUnions) {
        return [
            incrementFieldsSet(),
            ...reader_1.assignmentForField(field, state, returnAssignment),
        ];
    }
    else {
        return [incrementFieldsSet(), ...reader_1.assignmentForField(field, state)];
    }
}
exports.assignmentForField = assignmentForField;
function createFieldAssignment(field, state) {
    const hasValue = utils_2.createNotNullCheck(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.args, `${field.name.value}`));
    const thenAssign = assignmentForField(field, state);
    return ts.createIf(hasValue, ts.createBlock([...thenAssign], true));
}
exports.createFieldAssignment = createFieldAssignment;
//# sourceMappingURL=utils.js.map