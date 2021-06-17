"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const utils_1 = require("../utils");
const values_1 = require("../values");
const identifiers_1 = require("../identifiers");
const types_1 = require("../types");
const interface_1 = require("../interface");
const read_1 = require("./read");
const write_1 = require("./write");
function renderStruct(node, state) {
    const fields = createFieldsForStruct(node, state);
    const fieldAssignments = node.fields.map(createFieldAssignment);
    const argsParameter = createArgsParameterForStruct(node);
    const ctor = utils_1.createClassConstructor(argsParameter, [...fieldAssignments]);
    const readMethod = read_1.createReadMethod(node, state);
    const writeMethod = write_1.createWriteMethod(node, state);
    return ts.createClassDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], node.name.value, [], [], [...fields, ctor, writeMethod, readMethod]);
}
exports.renderStruct = renderStruct;
function createFieldsForStruct(node, state) {
    return node.fields.map((next) => {
        return renderFieldDeclarations(next, state);
    });
}
exports.createFieldsForStruct = createFieldsForStruct;
function createArgsTypeForStruct(node) {
    return ts.createTypeReferenceNode(interface_1.interfaceNameForClass(node), undefined);
}
exports.createArgsTypeForStruct = createArgsTypeForStruct;
function assignmentForField(field) {
    if (field.fieldType.type === thrift_parser_1.SyntaxType.I64Keyword) {
        return ts.createIf(ts.createBinary(ts.createTypeOf(ts.createIdentifier(`args.${field.name.value}`)), ts.SyntaxKind.EqualsEqualsEqualsToken, ts.createLiteral('number')), ts.createBlock([
            utils_1.createAssignmentStatement(utils_1.propertyAccessForIdentifier('this', field.name.value), ts.createNew(identifiers_1.COMMON_IDENTIFIERS.Node_Int64, undefined, [
                ts.createIdentifier(`args.${field.name.value}`),
            ])),
        ], true), ts.createBlock([
            utils_1.createAssignmentStatement(utils_1.propertyAccessForIdentifier('this', field.name.value), utils_1.propertyAccessForIdentifier('args', field.name.value)),
        ], true));
    }
    else {
        return utils_1.createAssignmentStatement(utils_1.propertyAccessForIdentifier('this', field.name.value), utils_1.propertyAccessForIdentifier('args', field.name.value));
    }
}
exports.assignmentForField = assignmentForField;
function throwForField(field) {
    if (field.requiredness === 'required') {
        return utils_1.throwProtocolException('UNKNOWN', `Required field[${field.name.value}] is unset!`);
    }
    else {
        return undefined;
    }
}
exports.throwForField = throwForField;
function createFieldAssignment(field) {
    const isArgsNull = utils_1.createNotNullCheck('args');
    const isValue = utils_1.createNotNullCheck(`args.${field.name.value}`);
    const comparison = ts.createBinary(isArgsNull, ts.SyntaxKind.AmpersandAmpersandToken, isValue);
    const thenAssign = assignmentForField(field);
    const elseThrow = throwForField(field);
    return ts.createIf(comparison, ts.createBlock([thenAssign], true), elseThrow === undefined ? undefined : ts.createBlock([elseThrow], true));
}
exports.createFieldAssignment = createFieldAssignment;
function renderFieldDeclarations(field, state) {
    const defaultValue = field.defaultValue !== null
        ? values_1.renderValue(field.fieldType, field.defaultValue, state)
        : undefined;
    return ts.createProperty(undefined, [ts.createToken(ts.SyntaxKind.PublicKeyword)], ts.createIdentifier(field.name.value), utils_1.renderOptional(field.requiredness), types_1.typeNodeForFieldType(field.fieldType, state), defaultValue);
}
exports.renderFieldDeclarations = renderFieldDeclarations;
function createArgsParameterForStruct(node) {
    if (node.fields.length > 0) {
        return [
            utils_1.createFunctionParameter('args', createArgsTypeForStruct(node), undefined, !utils_1.hasRequiredField(node)),
        ];
    }
    else {
        return [];
    }
}
exports.createArgsParameterForStruct = createArgsParameterForStruct;
//# sourceMappingURL=create.js.map