"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const identifiers_1 = require("../identifiers");
const service_1 = require("../../shared/service");
const types_1 = require("../../shared/types");
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitalize = capitalize;
function createStructArgsName(def) {
    return `${capitalize(def.name.value)}__Args`;
}
exports.createStructArgsName = createStructArgsName;
function createStructResultName(def) {
    return `${capitalize(def.name.value)}__Result`;
}
exports.createStructResultName = createStructResultName;
function renderServiceName(service) {
    return ts.createVariableStatement([ts.createToken(ts.SyntaxKind.ExportKeyword)], ts.createVariableDeclarationList([
        ts.createVariableDeclaration(identifiers_1.COMMON_IDENTIFIERS.serviceName, types_1.createStringType(), ts.createLiteral(service.name.value)),
    ], ts.NodeFlags.Const));
}
exports.renderServiceName = renderServiceName;
function renderServiceNameProperty() {
    return ts.createProperty(undefined, [
        ts.createToken(ts.SyntaxKind.PublicKeyword),
        ts.createToken(ts.SyntaxKind.ReadonlyKeyword),
    ], identifiers_1.COMMON_IDENTIFIERS._serviceName, undefined, types_1.createStringType(), identifiers_1.COMMON_IDENTIFIERS.serviceName);
}
exports.renderServiceNameProperty = renderServiceNameProperty;
function renderServiceNameStaticProperty() {
    return ts.createProperty(undefined, [
        ts.createToken(ts.SyntaxKind.PublicKeyword),
        ts.createToken(ts.SyntaxKind.StaticKeyword),
        ts.createToken(ts.SyntaxKind.ReadonlyKeyword),
    ], identifiers_1.COMMON_IDENTIFIERS.serviceName, undefined, types_1.createStringType(), identifiers_1.COMMON_IDENTIFIERS.serviceName);
}
exports.renderServiceNameStaticProperty = renderServiceNameStaticProperty;
function renderMethodNames(service, state) {
    return ts.createVariableStatement([ts.createToken(ts.SyntaxKind.ExportKeyword)], ts.createVariableDeclarationList([
        ts.createVariableDeclaration(identifiers_1.COMMON_IDENTIFIERS.methodNames, types_1.createArrayType(types_1.createStringType()), ts.createArrayLiteral([
            ...service_1.collectAllMethods(service, state).map((next) => {
                return ts.createLiteral(next.name.value);
            }),
        ])),
    ], ts.NodeFlags.Const));
}
exports.renderMethodNames = renderMethodNames;
function renderMethodNamesProperty() {
    return ts.createProperty(undefined, [
        ts.createToken(ts.SyntaxKind.PublicKeyword),
        ts.createToken(ts.SyntaxKind.ReadonlyKeyword),
    ], identifiers_1.COMMON_IDENTIFIERS._methodNames, undefined, types_1.createArrayType(types_1.createStringType()), identifiers_1.COMMON_IDENTIFIERS.methodNames);
}
exports.renderMethodNamesProperty = renderMethodNamesProperty;
function renderMethodNamesStaticProperty() {
    return ts.createProperty(undefined, [
        ts.createToken(ts.SyntaxKind.PublicKeyword),
        ts.createToken(ts.SyntaxKind.StaticKeyword),
        ts.createToken(ts.SyntaxKind.ReadonlyKeyword),
    ], identifiers_1.COMMON_IDENTIFIERS.methodNames, undefined, types_1.createArrayType(types_1.createStringType()), identifiers_1.COMMON_IDENTIFIERS.methodNames);
}
exports.renderMethodNamesStaticProperty = renderMethodNamesStaticProperty;
const methodParamMapType = ts.createTypeLiteralNode([
    ts.createIndexSignature(undefined, undefined, [
        ts.createParameter(undefined, undefined, undefined, identifiers_1.COMMON_IDENTIFIERS.methodName, undefined, types_1.createStringType()),
    ], types_1.createNumberType()),
]);
function renderMethodParameters(service, state) {
    return ts.createVariableStatement([ts.createToken(ts.SyntaxKind.ExportKeyword)], ts.createVariableDeclarationList([
        ts.createVariableDeclaration(identifiers_1.COMMON_IDENTIFIERS.methodParameters, methodParamMapType, ts.createObjectLiteral([
            ...service_1.collectAllMethods(service, state).map((next) => {
                return ts.createPropertyAssignment(next.name.value, ts.createLiteral(next.fields.length + 1));
            }),
        ], true)),
    ], ts.NodeFlags.Const));
}
exports.renderMethodParameters = renderMethodParameters;
function renderMethodParametersProperty() {
    return ts.createProperty(undefined, [
        ts.createToken(ts.SyntaxKind.PublicKeyword),
        ts.createToken(ts.SyntaxKind.ReadonlyKeyword),
    ], identifiers_1.COMMON_IDENTIFIERS._methodParameters, ts.createToken(ts.SyntaxKind.QuestionToken), methodParamMapType, identifiers_1.COMMON_IDENTIFIERS.methodParameters);
}
exports.renderMethodParametersProperty = renderMethodParametersProperty;
function getRawAnnotations(service, context) {
    const baseAnnotations = service.annotations
        ? service.annotations.annotations
        : [];
    return service_1.serviceInheritanceChain(service, context).reduce((acc, next) => {
        if (next.annotations) {
            return [...acc, ...next.annotations.annotations];
        }
        else {
            return acc;
        }
    }, baseAnnotations);
}
function collectAllAnnotations(service, state) {
    const temp = new Map();
    const rawAnnotations = getRawAnnotations(service, {
        currentNamespace: state.currentNamespace,
        namespaceMap: state.project.namespaces,
    });
    for (const annotation of rawAnnotations) {
        temp.set(annotation.name.value, annotation);
    }
    return {
        type: thrift_parser_1.SyntaxType.Annotations,
        loc: service.loc,
        annotations: Array.from(temp.values()),
    };
}
exports.collectAllAnnotations = collectAllAnnotations;
//# sourceMappingURL=utils.js.map