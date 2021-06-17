"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const identifiers_1 = require("../identifiers");
const types_1 = require("../types");
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const decode_1 = require("../struct/decode");
const decode_2 = require("./decode");
const utils_3 = require("../struct/utils");
const union_fields_1 = require("./union-fields");
const utils_4 = require("./utils");
const values_1 = require("../../apache/values");
function createArgsParameter(node, state) {
    return utils_1.createFunctionParameter('args', ts.createTypeReferenceNode(ts.createIdentifier(union_fields_1.unionTypeName(node.name.value, state, false)), undefined));
}
function createCreateMethod(node, state) {
    const inputParameter = createArgsParameter(node, state);
    const returnVariable = utils_4.createReturnVariable();
    const fieldsSet = utils_4.createFieldIncrementer();
    const fieldAssignments = node.fields.map((next) => {
        return utils_4.createFieldAssignment(next, state);
    });
    return ts.createMethod(undefined, undefined, undefined, identifiers_1.COMMON_IDENTIFIERS.create, undefined, undefined, [inputParameter], ts.createTypeReferenceNode(ts.createIdentifier(utils_3.strictNameForStruct(node, state)), undefined), ts.createBlock([
        fieldsSet,
        returnVariable,
        ...fieldAssignments,
        utils_4.createFieldValidation(thenBlockForFieldValidation(node, state)),
        ts.createIf(ts.createBinary(identifiers_1.COMMON_IDENTIFIERS._returnValue, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.createNull()), ts.createBlock([decode_2.createReturnForFields(node, node.fields, state)], true), ts.createBlock([
            utils_2.throwProtocolException('UNKNOWN', 'Unable to read data for TUnion'),
        ], true)),
    ], true));
}
exports.createCreateMethod = createCreateMethod;
function thenBlockForFieldValidation(node, state) {
    const defaultField = utils_4.fieldWithDefault(node);
    if (defaultField !== null) {
        return ts.createBlock([
            ts.createStatement(ts.createAssignment(identifiers_1.COMMON_IDENTIFIERS._returnValue, ts.createObjectLiteral([
                ts.createPropertyAssignment(defaultField.name.value, values_1.renderValue(defaultField.fieldType, defaultField.defaultValue, state)),
            ]))),
        ], true);
    }
    else {
        return utils_4.throwBlockForFieldValidation();
    }
}
function createCaseForField(node, field, state) {
    const fieldAlias = ts.createUniqueName('value');
    const checkType = ts.createIf(utils_2.createEqualsCheck(identifiers_1.COMMON_IDENTIFIERS.fieldType, types_1.thriftTypeForFieldType(field.fieldType, state)), ts.createBlock([
        utils_4.incrementFieldsSet(),
        ...decode_1.readValueForFieldType(field.fieldType, fieldAlias, state),
        ...decode_2.endReadForField(fieldAlias, field),
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
//# sourceMappingURL=create.js.map