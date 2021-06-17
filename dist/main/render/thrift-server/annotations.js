"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const identifiers_1 = require("./identifiers");
const validIdentifierPattern = /^[a-z$_][0-9a-z$_]*$/i;
function renderAnnotationValue(annotations) {
    return ts.createObjectLiteral(annotations !== undefined
        ? annotations.annotations.map((annotation) => {
            const name = annotation.name.value;
            const identifier = validIdentifierPattern.test(name)
                ? name
                : `'${name}'`;
            return ts.createPropertyAssignment(identifier, annotation.value !== undefined
                ? ts.createLiteral(annotation.value.value)
                : ts.createLiteral(''));
        })
        : [], true);
}
function renderAnnotations(annotations) {
    return ts.createProperty(undefined, [
        ts.createToken(ts.SyntaxKind.PublicKeyword),
        ts.createToken(ts.SyntaxKind.ReadonlyKeyword),
    ], identifiers_1.COMMON_IDENTIFIERS._annotations, undefined, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IThriftAnnotations, undefined), renderAnnotationValue(annotations));
}
exports.renderAnnotations = renderAnnotations;
function renderServiceAnnotations(annotations) {
    return ts.createVariableStatement([ts.createToken(ts.SyntaxKind.ExportKeyword)], ts.createVariableDeclarationList([
        ts.createVariableDeclaration(identifiers_1.COMMON_IDENTIFIERS.annotations, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IThriftAnnotations, undefined), renderAnnotationValue(annotations)),
    ], ts.NodeFlags.Const));
}
exports.renderServiceAnnotations = renderServiceAnnotations;
function renderServiceAnnotationsProperty() {
    return ts.createProperty(undefined, [
        ts.createToken(ts.SyntaxKind.PublicKeyword),
        ts.createToken(ts.SyntaxKind.ReadonlyKeyword),
    ], identifiers_1.COMMON_IDENTIFIERS._annotations, undefined, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IThriftAnnotations, undefined), identifiers_1.COMMON_IDENTIFIERS.annotations);
}
exports.renderServiceAnnotationsProperty = renderServiceAnnotationsProperty;
function renderServiceAnnotationsStaticProperty() {
    return ts.createProperty(undefined, [
        ts.createToken(ts.SyntaxKind.PublicKeyword),
        ts.createToken(ts.SyntaxKind.StaticKeyword),
        ts.createToken(ts.SyntaxKind.ReadonlyKeyword),
    ], identifiers_1.COMMON_IDENTIFIERS.annotations, undefined, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IThriftAnnotations, undefined), identifiers_1.COMMON_IDENTIFIERS.annotations);
}
exports.renderServiceAnnotationsStaticProperty = renderServiceAnnotationsStaticProperty;
function renderFieldAnnotationValue(fields) {
    return ts.createObjectLiteral(fields
        .filter((field) => {
        return field.annotations !== undefined;
    })
        .map((field) => {
        return ts.createPropertyAssignment(ts.createIdentifier(field.name.value), renderAnnotationValue(field.annotations));
    }), true);
}
function renderFieldAnnotations(fields) {
    return ts.createProperty(undefined, [
        ts.createToken(ts.SyntaxKind.PublicKeyword),
        ts.createToken(ts.SyntaxKind.ReadonlyKeyword),
    ], identifiers_1.COMMON_IDENTIFIERS._fieldAnnotations, undefined, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IFieldAnnotations, undefined), renderFieldAnnotationValue(fields));
}
exports.renderFieldAnnotations = renderFieldAnnotations;
function renderMethodAnnotationValue(functions) {
    return ts.createObjectLiteral(functions.map((func) => {
        return ts.createPropertyAssignment(ts.createIdentifier(func.name.value), ts.createObjectLiteral([
            ts.createPropertyAssignment(ts.createIdentifier('annotations'), renderAnnotationValue(func.annotations)),
            ts.createPropertyAssignment(ts.createIdentifier('fieldAnnotations'), renderFieldAnnotationValue(func.fields)),
        ], true));
    }), true);
}
function renderMethodAnnotations(functions) {
    return ts.createVariableStatement([ts.createToken(ts.SyntaxKind.ExportKeyword)], ts.createVariableDeclarationList([
        ts.createVariableDeclaration(identifiers_1.COMMON_IDENTIFIERS.methodAnnotations, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IMethodAnnotations, undefined), renderMethodAnnotationValue(functions)),
    ], ts.NodeFlags.Const));
}
exports.renderMethodAnnotations = renderMethodAnnotations;
function renderMethodAnnotationsProperty() {
    return ts.createProperty(undefined, [
        ts.createToken(ts.SyntaxKind.PublicKeyword),
        ts.createToken(ts.SyntaxKind.ReadonlyKeyword),
    ], identifiers_1.COMMON_IDENTIFIERS._methodAnnotations, undefined, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IMethodAnnotations, undefined), identifiers_1.COMMON_IDENTIFIERS.methodAnnotations);
}
exports.renderMethodAnnotationsProperty = renderMethodAnnotationsProperty;
function renderMethodAnnotationsStaticProperty() {
    return ts.createProperty(undefined, [
        ts.createToken(ts.SyntaxKind.PublicKeyword),
        ts.createToken(ts.SyntaxKind.StaticKeyword),
        ts.createToken(ts.SyntaxKind.ReadonlyKeyword),
    ], identifiers_1.COMMON_IDENTIFIERS.methodAnnotations, undefined, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IMethodAnnotations, undefined), identifiers_1.COMMON_IDENTIFIERS.methodAnnotations);
}
exports.renderMethodAnnotationsStaticProperty = renderMethodAnnotationsStaticProperty;
//# sourceMappingURL=annotations.js.map