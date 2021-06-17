"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const identifiers_1 = require("../identifiers");
const resolver_1 = require("../../../resolver");
const utils_1 = require("../utils");
function makeNameForNode(name, state, mapping) {
    const resolvedId = resolver_1.Resolver.resolveIdentifierName(name, {
        currentNamespace: state.currentNamespace,
        currentDefinitions: state.currentDefinitions,
        namespaceMap: state.project.namespaces,
    });
    if (resolvedId.pathName) {
        return `${resolvedId.pathName}.${mapping(resolvedId.baseName)}`;
    }
    else {
        return mapping(name);
    }
}
function renderOptional(field, loose = false) {
    if (field.requiredness !== 'required' ||
        (loose && field.defaultValue !== null)) {
        return ts.createToken(ts.SyntaxKind.QuestionToken);
    }
    else {
        return undefined;
    }
}
exports.renderOptional = renderOptional;
function tokens(isExported) {
    if (isExported) {
        return [ts.createToken(ts.SyntaxKind.ExportKeyword)];
    }
    else {
        return [];
    }
}
exports.tokens = tokens;
function looseNameForStruct(node, state) {
    return looseName(node.name.value, node.type, state);
}
exports.looseNameForStruct = looseNameForStruct;
function classNameForStruct(node, state) {
    return className(node.name.value, state);
}
exports.classNameForStruct = classNameForStruct;
function strictNameForStruct(node, state) {
    return strictName(node.name.value, node.type, state);
}
exports.strictNameForStruct = strictNameForStruct;
function toolkitNameForStruct(node, state) {
    return toolkitName(node.name.value, state);
}
exports.toolkitNameForStruct = toolkitNameForStruct;
function className(name, state) {
    return makeNameForNode(name, state, (part) => {
        return part;
    });
}
exports.className = className;
function looseName(name, type, state) {
    if (type === thrift_parser_1.SyntaxType.UnionDefinition && state.options.strictUnions) {
        return `${className(name, state)}Args`;
    }
    else {
        return makeNameForNode(name, state, (part) => {
            return `I${part}Args`;
        });
    }
}
exports.looseName = looseName;
function strictName(name, type, state) {
    if (type === thrift_parser_1.SyntaxType.UnionDefinition && state.options.strictUnions) {
        return className(name, state);
    }
    else {
        return makeNameForNode(name, state, (part) => {
            return `I${part}`;
        });
    }
}
exports.strictName = strictName;
function toolkitName(name, state) {
    return makeNameForNode(name, state, (part) => {
        return `${part}Codec`;
    });
}
exports.toolkitName = toolkitName;
function extendsAbstract() {
    return ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
        ts.createExpressionWithTypeArguments([], identifiers_1.THRIFT_IDENTIFIERS.StructLike),
    ]);
}
exports.extendsAbstract = extendsAbstract;
function implementsInterface(node, state) {
    return ts.createHeritageClause(ts.SyntaxKind.ImplementsKeyword, [
        ts.createExpressionWithTypeArguments([], ts.createIdentifier(strictNameForStruct(node, state))),
    ]);
}
exports.implementsInterface = implementsInterface;
function createSuperCall() {
    return ts.createStatement(ts.createCall(identifiers_1.COMMON_IDENTIFIERS.super, undefined, []));
}
exports.createSuperCall = createSuperCall;
function throwForField(field) {
    if (field.requiredness === 'required' && field.defaultValue === null) {
        return utils_1.throwProtocolException('UNKNOWN', `Required field[${field.name.value}] is unset!`);
    }
    else {
        return undefined;
    }
}
exports.throwForField = throwForField;
//# sourceMappingURL=utils.js.map