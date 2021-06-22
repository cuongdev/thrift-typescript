"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const annotations_1 = require("../annotations");
const identifiers_1 = require("../identifiers");
const utils_1 = require("../utils");
const initializers_1 = require("../initializers");
const types_1 = require("../types");
const reader_1 = require("./reader");
const utils_2 = require("./utils");
function renderClass(node, state, isExported, extendError = false) {
    const fields = [
        ...createFieldsForStruct(node, state),
        annotations_1.renderAnnotations(node.annotations),
        annotations_1.renderFieldAnnotations(node.fields),
    ];
    if (state.options.withNameField) {
        const nameField = ts.createProperty(undefined, [
            ts.createToken(ts.SyntaxKind.PublicKeyword),
            ts.createToken(ts.SyntaxKind.ReadonlyKeyword),
        ], identifiers_1.COMMON_IDENTIFIERS.__name, undefined, undefined, ts.createLiteral(node.name.value));
        fields.splice(-2, 0, nameField);
    }
    const fieldAssignments = node.fields.map((field) => {
        return createFieldAssignment(field, state);
    });
    const argsParameter = createArgsParameterForStruct(node, state);
    const ctor = utils_1.createClassConstructor([argsParameter], [utils_2.createSuperCall(), ...fieldAssignments]);
    return ts.createClassDeclaration(undefined, utils_2.tokens(isExported), utils_2.classNameForStruct(node, state).replace('__NAMESPACE__', ''), [], [
        extendError ? utils_2.extendsAbstractError() : utils_2.extendsAbstract(),
        utils_2.implementsInterface(node, state),
    ], [
        ...fields,
        ctor,
        createStaticReadMethod(node, state),
        createStaticWriteMethod(node, state),
        createWriteMethod(node, state),
    ]);
}
exports.renderClass = renderClass;
function createWriteMethod(node, state) {
    return ts.createMethod(undefined, [ts.createToken(ts.SyntaxKind.PublicKeyword)], undefined, identifiers_1.COMMON_IDENTIFIERS.write, undefined, undefined, [createOutputParameter()], types_1.createVoidType(), ts.createBlock([
        ts.createReturn(ts.createCall(ts.createPropertyAccess(ts.createIdentifier(utils_2.toolkitNameForStruct(node, state)), identifiers_1.COMMON_IDENTIFIERS.encode), undefined, [identifiers_1.COMMON_IDENTIFIERS.this, identifiers_1.COMMON_IDENTIFIERS.output])),
    ], true));
}
exports.createWriteMethod = createWriteMethod;
function createStaticWriteMethod(node, state) {
    return ts.createMethod(undefined, [
        ts.createToken(ts.SyntaxKind.PublicKeyword),
        ts.createToken(ts.SyntaxKind.StaticKeyword),
    ], undefined, identifiers_1.COMMON_IDENTIFIERS.write, undefined, undefined, [
        utils_1.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.args, ts.createTypeReferenceNode(ts.createIdentifier(utils_2.looseNameForStruct(node, state)), undefined)),
        createOutputParameter(),
    ], types_1.createVoidType(), ts.createBlock([
        ts.createReturn(ts.createCall(ts.createPropertyAccess(ts.createIdentifier(utils_2.toolkitNameForStruct(node, state)), identifiers_1.COMMON_IDENTIFIERS.encode), undefined, [identifiers_1.COMMON_IDENTIFIERS.args, identifiers_1.COMMON_IDENTIFIERS.output])),
    ], true));
}
exports.createStaticWriteMethod = createStaticWriteMethod;
function createStaticReadMethod(node, state) {
    return ts.createMethod(undefined, [
        ts.createToken(ts.SyntaxKind.PublicKeyword),
        ts.createToken(ts.SyntaxKind.StaticKeyword),
    ], undefined, identifiers_1.COMMON_IDENTIFIERS.read, undefined, undefined, [createInputParameter()], ts.createTypeReferenceNode(ts.createIdentifier(utils_2.classNameForStruct(node, state)), undefined), ts.createBlock([
        ts.createReturn(ts.createNew(ts.createIdentifier(utils_2.classNameForStruct(node, state)), undefined, [
            ts.createCall(ts.createPropertyAccess(ts.createIdentifier(utils_2.toolkitNameForStruct(node, state)), identifiers_1.COMMON_IDENTIFIERS.decode), undefined, [identifiers_1.COMMON_IDENTIFIERS.input]),
        ])),
    ], true));
}
exports.createStaticReadMethod = createStaticReadMethod;
function createOutputParameter() {
    return utils_1.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.output, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TProtocol, undefined));
}
exports.createOutputParameter = createOutputParameter;
function createInputParameter() {
    return utils_1.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.input, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TProtocol, undefined));
}
exports.createInputParameter = createInputParameter;
function createFieldsForStruct(node, state) {
    return node.fields.map((field) => {
        return renderFieldDeclarations(field, state, true);
    });
}
exports.createFieldsForStruct = createFieldsForStruct;
function renderFieldDeclarations(field, state, withDefaults) {
    const defaultValue = withDefaults && field.defaultValue !== null
        ? initializers_1.renderValue(field.fieldType, field.defaultValue, state)
        : undefined;
    return ts.createProperty(undefined, [ts.createToken(ts.SyntaxKind.PublicKeyword)], ts.createIdentifier(field.name.value), field.requiredness === 'required'
        ? undefined
        : ts.createToken(ts.SyntaxKind.QuestionToken), types_1.typeNodeForFieldType(field.fieldType, state), defaultValue);
}
exports.renderFieldDeclarations = renderFieldDeclarations;
function createFieldAssignment(field, state) {
    const hasValue = utils_1.createNotNullCheck(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.args, `${field.name.value}`));
    const thenAssign = reader_1.assignmentForField(field, state);
    const elseThrow = utils_2.throwForField(field);
    return ts.createIf(hasValue, ts.createBlock([...thenAssign], true), elseThrow === undefined ? undefined : ts.createBlock([elseThrow], true));
}
exports.createFieldAssignment = createFieldAssignment;
function createDefaultInitializer(node) {
    if (utils_1.hasRequiredField(node)) {
        return undefined;
    }
    else {
        return ts.createObjectLiteral([]);
    }
}
function createArgsParameterForStruct(node, state) {
    return utils_1.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.args, createArgsTypeForStruct(node, state), createDefaultInitializer(node));
}
exports.createArgsParameterForStruct = createArgsParameterForStruct;
function createArgsTypeForStruct(node, state) {
    return ts.createTypeReferenceNode(ts.createIdentifier(utils_2.looseNameForStruct(node, state)), undefined);
}
//# sourceMappingURL=class.js.map