"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const identifiers_1 = require("../identifiers");
const utils_1 = require("../utils");
const utils_2 = require("../struct/utils");
const class_1 = require("../struct/class");
const utils_3 = require("./utils");
const values_1 = require("../../apache/values");
const annotations_1 = require("../annotations");
function renderClass(node, state, isExported) {
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
    const fieldAssignments = node.fields.map((next) => {
        return utils_3.createFieldAssignment(next, state);
    });
    const argsParameter = class_1.createArgsParameterForStruct(node, state);
    const ctor = utils_1.createClassConstructor([argsParameter], [
        utils_2.createSuperCall(),
        utils_3.createFieldIncrementer(),
        ...fieldAssignments,
        utils_3.createFieldValidation(thenBlockForFieldValidation(node, state)),
    ]);
    return ts.createClassDeclaration(undefined, utils_2.tokens(isExported), utils_2.classNameForStruct(node, state), [], [utils_2.extendsAbstract(), utils_2.implementsInterface(node, state)], [
        ...fields,
        ctor,
        class_1.createStaticReadMethod(node, state),
        class_1.createStaticWriteMethod(node, state),
        class_1.createWriteMethod(node, state),
    ]);
}
exports.renderClass = renderClass;
function thenBlockForFieldValidation(node, state) {
    const defaultField = utils_3.fieldWithDefault(node);
    if (defaultField !== null) {
        return ts.createBlock([
            ts.createStatement(ts.createAssignment(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.this, ts.createIdentifier(defaultField.name.value)), values_1.renderValue(defaultField.fieldType, defaultField.defaultValue, state))),
        ], true);
    }
    else {
        return utils_3.throwBlockForFieldValidation();
    }
}
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
        return class_1.renderFieldDeclarations(field, state, false);
    });
}
exports.createFieldsForStruct = createFieldsForStruct;
//# sourceMappingURL=class.js.map