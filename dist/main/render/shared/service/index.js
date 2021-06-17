"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const identifiers_1 = require("../identifiers");
const types_1 = require("../types");
const resolver_1 = require("../../../resolver");
const utils_1 = require("../utils");
function funcToMethodReducer(acc, func, typeMapping, state) {
    return acc.concat([
        ts.createMethodSignature(undefined, [
            ...func.fields.map((field) => {
                return utils_1.createFunctionParameter(field.name.value, typeMapping(field.fieldType, state), undefined, field.requiredness === 'optional');
            }),
            utils_1.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.context, ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Context, undefined), undefined, true),
        ], ts.createUnionTypeNode([
            typeMapping(func.returnType, state, true),
            types_1.createPromiseType(typeMapping(func.returnType, state, true)),
        ]), func.name.value, undefined),
    ]);
}
function renderHandlerInterface(service, typeMapping, state) {
    const signatures = service.functions.reduce((acc, next) => {
        return funcToMethodReducer(acc, next, typeMapping, state);
    }, []);
    if (service.extends !== null) {
        return [
            ts.createInterfaceDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], identifiers_1.COMMON_IDENTIFIERS.ILocalHandler, [
                ts.createTypeParameterDeclaration(identifiers_1.COMMON_IDENTIFIERS.Context, undefined, types_1.createAnyType()),
            ], [], signatures),
            ts.createTypeAliasDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], identifiers_1.COMMON_IDENTIFIERS.IHandler, [
                ts.createTypeParameterDeclaration(identifiers_1.COMMON_IDENTIFIERS.Context, undefined, types_1.createAnyType()),
            ], ts.createIntersectionTypeNode([
                ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.ILocalHandler, [
                    ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Context, undefined),
                ]),
                ts.createTypeReferenceNode(ts.createIdentifier(`${resolver_1.Resolver.resolveIdentifierName(service.extends.value, {
                    currentNamespace: state.currentNamespace,
                    currentDefinitions: state.currentDefinitions,
                    namespaceMap: state.project.namespaces,
                }).fullName}.IHandler`), [
                    ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Context, undefined),
                ]),
            ])),
        ];
    }
    else {
        return [
            ts.createInterfaceDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], identifiers_1.COMMON_IDENTIFIERS.IHandler, [
                ts.createTypeParameterDeclaration(identifiers_1.COMMON_IDENTIFIERS.Context, undefined, types_1.createAnyType()),
            ], [], signatures),
        ];
    }
}
exports.renderHandlerInterface = renderHandlerInterface;
function serviceInheritanceChain(service, context) {
    if (service.extends !== null) {
        if (context.currentNamespace.exports[service.extends.value]) {
            const parentService = context.currentNamespace.exports[service.extends.value];
            if (parentService.type === thrift_parser_1.SyntaxType.ServiceDefinition) {
                return [
                    parentService,
                    ...serviceInheritanceChain(parentService, context),
                ];
            }
            else {
                throw new Error(`Services can only extends other services but found[${parentService.type}]`);
            }
        }
        else {
            const [path, ...tail] = service.extends.value.split('.');
            const nextPath = tail.join('.');
            const nextNamespacePath = context.currentNamespace.includedNamespaces[path];
            if (nextNamespacePath && nextPath) {
                const nextNamespace = context.namespaceMap[nextNamespacePath.accessor];
                if (nextNamespace) {
                    const parentService = nextNamespace.exports[nextPath];
                    if (parentService.type === thrift_parser_1.SyntaxType.ServiceDefinition) {
                        return [
                            parentService,
                            ...serviceInheritanceChain(parentService, {
                                currentNamespace: nextNamespace,
                                namespaceMap: context.namespaceMap,
                            }),
                        ];
                    }
                    else {
                        throw new Error(`Services can only extends other services but found[${parentService.type}]`);
                    }
                }
            }
            throw new Error(`Unable to resolve parent service: ${service.extends.value}`);
        }
    }
    else {
        return [];
    }
}
exports.serviceInheritanceChain = serviceInheritanceChain;
function collectInheritedMethods(service, context) {
    return serviceInheritanceChain(service, context).reduce((acc, next) => {
        return [...acc, ...next.functions];
    }, []);
}
exports.collectInheritedMethods = collectInheritedMethods;
function collectAllMethods(service, state) {
    return [
        ...collectInheritedMethods(service, {
            currentNamespace: state.currentNamespace,
            namespaceMap: state.project.namespaces,
        }),
        ...service.functions,
    ];
}
exports.collectAllMethods = collectAllMethods;
//# sourceMappingURL=index.js.map