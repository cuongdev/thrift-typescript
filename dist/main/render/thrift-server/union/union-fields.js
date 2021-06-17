"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const identifiers_1 = require("../../shared/identifiers");
const types_1 = require("../../shared/types");
const utils_1 = require("../struct/utils");
const types_2 = require("../types");
function renderUnionTypes(node, state, isExported) {
    return ts.createEnumDeclaration(undefined, utils_1.tokens(isExported), renderUnionTypeName(node.name.value, state), node.fields.map((field) => {
        return ts.createEnumMember(fieldTypeName(node.name.value, field.name.value, true), ts.createLiteral(field.name.value));
    }));
}
exports.renderUnionTypes = renderUnionTypes;
function fieldTypeAccess(node, field, state) {
    return `${renderUnionTypeName(node.name.value, state)}.${fieldTypeName(node.name.value, field.name.value, true)}`;
}
exports.fieldTypeAccess = fieldTypeAccess;
function unionTypeName(name, state, strict) {
    if (strict) {
        return utils_1.className(name, state);
    }
    else {
        return `${utils_1.className(name, state)}Args`;
    }
}
exports.unionTypeName = unionTypeName;
function renderUnionTypeName(name, state) {
    if (state.options.strictUnionsComplexNames) {
        return `${unionTypeName(name, state, true)}__Type`;
    }
    else {
        return `${unionTypeName(name, state, true)}Type`;
    }
}
exports.renderUnionTypeName = renderUnionTypeName;
function capitalize(str) {
    if (str.length > 0) {
        const head = str[0];
        const tail = str.substring(1);
        return `${head.toUpperCase()}${tail}`;
    }
    else {
        return '';
    }
}
function fieldTypeName(nodeName, fieldName, strict) {
    if (strict) {
        return `${nodeName}With${capitalize(fieldName)}`;
    }
    else {
        return `${nodeName}With${capitalize(fieldName)}Args`;
    }
}
exports.fieldTypeName = fieldTypeName;
function fieldInterfaceName(nodeName, fieldName, strict) {
    if (strict) {
        return `I${fieldTypeName(nodeName, fieldName, strict)}`;
    }
    else {
        return `I${fieldTypeName(nodeName, fieldName, strict)}`;
    }
}
exports.fieldInterfaceName = fieldInterfaceName;
function renderInterfaceForField(node, field, state, isStrict, isExported) {
    const signatures = node.fields.map((next) => {
        if (field.name.value === next.name.value) {
            return ts.createPropertySignature(undefined, field.name.value, undefined, types_2.typeNodeForFieldType(next.fieldType, state, !isStrict), undefined);
        }
        else {
            return ts.createPropertySignature(undefined, next.name.value, ts.createToken(ts.SyntaxKind.QuestionToken), types_1.createUndefinedType(), undefined);
        }
    });
    if (isStrict) {
        signatures.unshift(ts.createPropertySignature(undefined, identifiers_1.COMMON_IDENTIFIERS.__type, undefined, ts.createTypeReferenceNode(ts.createIdentifier(fieldTypeAccess(node, field, state)), undefined), undefined));
        if (state.options.withNameField) {
            signatures.unshift(ts.createPropertySignature(undefined, identifiers_1.COMMON_IDENTIFIERS.__name, undefined, ts.createLiteralTypeNode(ts.createLiteral(node.name.value)), undefined));
        }
    }
    return ts.createInterfaceDeclaration(undefined, utils_1.tokens(isExported), ts.createIdentifier(fieldInterfaceName(node.name.value, field.name.value, isStrict)), [], [], signatures);
}
function renderUnionsForFields(node, state, isExported, isStrict) {
    return [
        ts.createTypeAliasDeclaration(undefined, utils_1.tokens(isExported), unionTypeName(node.name.value, state, isStrict), undefined, ts.createUnionTypeNode([
            ...node.fields.map((next) => {
                return ts.createTypeReferenceNode(fieldInterfaceName(node.name.value, next.name.value, isStrict), undefined);
            }),
        ])),
        ...node.fields.map((next) => {
            return renderInterfaceForField(node, next, state, isStrict, true);
        }),
    ];
}
exports.renderUnionsForFields = renderUnionsForFields;
//# sourceMappingURL=union-fields.js.map