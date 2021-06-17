"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const types_1 = require("./types");
const utils_1 = require("./utils");
const types_2 = require("./types");
const struct_1 = require("./struct");
const identifiers_1 = require("./identifiers");
function renderUnion(node, state) {
    const fields = struct_1.createFieldsForStruct(node, state);
    const fieldAssignments = node.fields.map(createFieldAssignment);
    const isArgsNull = utils_1.createNotNullCheck('args');
    const argsCheckWithAssignments = ts.createIf(isArgsNull, ts.createBlock([...fieldAssignments, createFieldValidation(node)], true), undefined);
    const argsParameter = struct_1.createArgsParameterForStruct(node);
    const fieldsSet = createFieldIncrementer();
    const ctor = utils_1.createClassConstructor(argsParameter, [fieldsSet, argsCheckWithAssignments]);
    const factories = createUnionFactories(node, state);
    const readMethod = createReadMethod(node, state);
    const writeMethod = struct_1.createWriteMethod(node, state);
    return ts.createClassDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], node.name.value, [], [], [...fields, ctor, ...factories, writeMethod, readMethod]);
}
exports.renderUnion = renderUnion;
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function createFactoryNameForField(field) {
    return `from${capitalize(field.name.value)}`;
}
function createUnionFactories(node, state) {
    return node.fields.map((next) => {
        return ts.createMethod(undefined, [
            ts.createToken(ts.SyntaxKind.PublicKeyword),
            ts.createToken(ts.SyntaxKind.StaticKeyword),
        ], undefined, ts.createIdentifier(createFactoryNameForField(next)), undefined, undefined, [
            utils_1.createFunctionParameter(ts.createIdentifier(next.name.value), types_1.typeNodeForFieldType(next.fieldType, state)),
        ], ts.createTypeReferenceNode(ts.createIdentifier(node.name.value), undefined), ts.createBlock([
            ts.createReturn(ts.createNew(ts.createIdentifier(node.name.value), undefined, [
                ts.createObjectLiteral([
                    ts.createShorthandPropertyAssignment(next.name.value),
                ]),
            ])),
        ], true));
    });
}
function createFieldAssignment(field) {
    const comparison = utils_1.createNotNullCheck(`args.${field.name.value}`);
    const thenAssign = struct_1.assignmentForField(field);
    const incrementer = incrementFieldsSet();
    const elseThrow = struct_1.throwForField(field);
    return ts.createIf(comparison, ts.createBlock([incrementer, thenAssign], true), elseThrow !== undefined ? ts.createBlock([elseThrow], true) : undefined);
}
function createReadMethod(node, state) {
    const inputParameter = struct_1.createInputParameter();
    const returnVariable = utils_1.createLetStatement(identifiers_1.COMMON_IDENTIFIERS._returnValue, ts.createUnionTypeNode([
        ts.createTypeReferenceNode(ts.createIdentifier(node.name.value), undefined),
        ts.createNull(),
    ]), ts.createNull());
    const fieldsSet = createFieldIncrementer();
    const ret = utils_1.createConstStatement('ret', ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TField, undefined), struct_1.readFieldBegin());
    const fieldType = utils_1.createConstStatement('fieldType', ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.Thrift_Type, undefined), utils_1.propertyAccessForIdentifier('ret', 'ftype'));
    const fieldId = utils_1.createConstStatement('fieldId', types_2.createNumberType(), utils_1.propertyAccessForIdentifier('ret', 'fid'));
    const checkStop = ts.createIf(utils_1.createEqualsCheck(identifiers_1.COMMON_IDENTIFIERS.fieldType, identifiers_1.THRIFT_TYPES.STOP), ts.createBlock([ts.createBreak()], true));
    const caseStatements = node.fields.map((field) => {
        return createCaseForField(node, field, state);
    });
    const switchStatement = ts.createSwitch(identifiers_1.COMMON_IDENTIFIERS.fieldId, ts.createCaseBlock([
        ...caseStatements,
        ts.createDefaultClause([struct_1.createSkipBlock()]),
    ]));
    const whileBlock = ts.createBlock([ret, fieldType, fieldId, checkStop, switchStatement, struct_1.readFieldEnd()], true);
    const whileLoop = ts.createWhile(ts.createLiteral(true), whileBlock);
    return ts.createMethod(undefined, [
        ts.createToken(ts.SyntaxKind.PublicKeyword),
        ts.createToken(ts.SyntaxKind.StaticKeyword),
    ], undefined, identifiers_1.COMMON_IDENTIFIERS.read, undefined, undefined, [inputParameter], ts.createTypeReferenceNode(ts.createIdentifier(node.name.value), undefined), ts.createBlock([
        fieldsSet,
        returnVariable,
        struct_1.readStructBegin(),
        whileLoop,
        struct_1.readStructEnd(),
        createFieldValidation(node, true),
        ts.createIf(ts.createBinary(identifiers_1.COMMON_IDENTIFIERS._returnValue, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.createNull()), ts.createBlock([ts.createReturn(identifiers_1.COMMON_IDENTIFIERS._returnValue)], true), ts.createBlock([
            utils_1.throwProtocolException('UNKNOWN', 'Unable to read data for TUnion'),
        ], true)),
    ], true));
}
function createCaseForField(node, field, state) {
    const fieldAlias = ts.createUniqueName('value');
    const checkType = ts.createIf(utils_1.createEqualsCheck(identifiers_1.COMMON_IDENTIFIERS.fieldType, types_1.thriftTypeForFieldType(field.fieldType, state)), ts.createBlock([
        incrementFieldsSet(),
        ...struct_1.readValueForFieldType(field.fieldType, fieldAlias, state),
        ...endReadForField(node, fieldAlias, field),
    ], true), struct_1.createSkipBlock());
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
function endReadForField(node, fieldName, field) {
    switch (field.fieldType.type) {
        case thrift_parser_1.SyntaxType.VoidKeyword:
            return [];
        default:
            return [
                ts.createStatement(ts.createAssignment(identifiers_1.COMMON_IDENTIFIERS._returnValue, ts.createCall(ts.createPropertyAccess(ts.createIdentifier(node.name.value), createFactoryNameForField(field)), undefined, [fieldName]))),
            ];
    }
}
function createFieldValidation(node, withElse = false) {
    return ts.createIf(ts.createBinary(identifiers_1.COMMON_IDENTIFIERS._fieldsSet, ts.SyntaxKind.GreaterThanToken, ts.createLiteral(1)), ts.createBlock([
        utils_1.throwProtocolException('INVALID_DATA', 'Cannot read a TUnion with more than one set value!'),
    ], true), ts.createIf(ts.createBinary(identifiers_1.COMMON_IDENTIFIERS._fieldsSet, ts.SyntaxKind.LessThanToken, ts.createLiteral(1)), ts.createBlock([
        utils_1.throwProtocolException('INVALID_DATA', 'Cannot read a TUnion with no set value!'),
    ], true)));
}
exports.createFieldValidation = createFieldValidation;
function createFieldIncrementer() {
    return utils_1.createLetStatement(identifiers_1.COMMON_IDENTIFIERS._fieldsSet, types_2.createNumberType(), ts.createLiteral(0));
}
exports.createFieldIncrementer = createFieldIncrementer;
function incrementFieldsSet() {
    return ts.createStatement(ts.createPostfixIncrement(identifiers_1.COMMON_IDENTIFIERS._fieldsSet));
}
exports.incrementFieldsSet = incrementFieldsSet;
//# sourceMappingURL=union.js.map