"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const types_1 = require("./types");
const utils_1 = require("./utils");
const utils_2 = require("../utils");
const resolver_1 = require("../../../resolver");
const types_2 = require("../types");
const identifiers_1 = require("../identifiers");
const service_1 = require("../../shared/service");
const types_3 = require("../../shared/types");
function funcToMethodReducer(acc, func, state) {
    return acc.concat([
        ts.createMethodSignature(undefined, [
            ...func.fields.map((field) => {
                return utils_2.createFunctionParameter(field.name.value, types_2.typeNodeForFieldType(field.fieldType, state), undefined, field.requiredness === 'optional');
            }),
        ], ts.createUnionTypeNode([
            types_2.typeNodeForFieldType(func.returnType, state),
            types_3.createPromiseType(types_2.typeNodeForFieldType(func.returnType, state)),
        ]), func.name.value, undefined),
    ]);
}
function renderHandlerInterface(service, state) {
    const signatures = service.functions.reduce((acc, next) => {
        return funcToMethodReducer(acc, next, state);
    }, []);
    if (service.extends !== null) {
        return [
            ts.createInterfaceDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], identifiers_1.COMMON_IDENTIFIERS.ILocalHandler, undefined, [], signatures),
            ts.createTypeAliasDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], identifiers_1.COMMON_IDENTIFIERS.IHandler, undefined, ts.createIntersectionTypeNode([
                ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.ILocalHandler, undefined),
                ts.createTypeReferenceNode(ts.createIdentifier(`${resolver_1.Resolver.resolveIdentifierName(service.extends.value, {
                    currentNamespace: state.currentNamespace,
                    currentDefinitions: state.currentDefinitions,
                    namespaceMap: state.project.namespaces,
                }).fullName}.IHandler`), undefined),
            ])),
        ];
    }
    else {
        return [
            ts.createInterfaceDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], identifiers_1.COMMON_IDENTIFIERS.IHandler, undefined, [], signatures),
        ];
    }
}
exports.renderHandlerInterface = renderHandlerInterface;
function objectLiteralForServiceFunctions(service, state) {
    return ts.createObjectLiteral(service_1.collectInheritedMethods(service, {
        currentNamespace: state.currentNamespace,
        namespaceMap: state.project.namespaces,
    }).map((next) => {
        return ts.createPropertyAssignment(ts.createIdentifier(next.name.value), ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.handler, ts.createIdentifier(next.name.value)));
    }), true);
}
function handlerType(node) {
    return ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.IHandler, undefined);
}
function createSuperCall(service, state) {
    if (service.extends !== null) {
        return [
            ts.createStatement(ts.createCall(ts.createSuper(), [], [objectLiteralForServiceFunctions(service, state)])),
        ];
    }
    else {
        return [];
    }
}
function renderProcessor(node, state) {
    const handler = ts.createProperty(undefined, [ts.createToken(ts.SyntaxKind.PublicKeyword)], identifiers_1.COMMON_IDENTIFIERS._handler, undefined, handlerType(node), undefined);
    const ctor = utils_2.createClassConstructor([
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.handler, handlerType(node)),
    ], [
        ...createSuperCall(node, state),
        utils_2.createAssignmentStatement(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.this, identifiers_1.COMMON_IDENTIFIERS._handler), identifiers_1.COMMON_IDENTIFIERS.handler),
    ]);
    const processMethod = createProcessMethod(node, state);
    const processFunctions = node.functions.map((next) => {
        return createProcessFunctionMethod(next, state);
    });
    const heritage = node.extends !== null
        ? [
            ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
                ts.createExpressionWithTypeArguments([], ts.createPropertyAccess(ts.createIdentifier(`${resolver_1.Resolver.resolveIdentifierName(node.extends.value, {
                    currentNamespace: state.currentNamespace,
                    currentDefinitions: state.currentDefinitions,
                    namespaceMap: state.project.namespaces,
                }).fullName}`), identifiers_1.COMMON_IDENTIFIERS.Processor)),
            ]),
        ]
        : [];
    return ts.createClassDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], identifiers_1.COMMON_IDENTIFIERS.Processor, undefined, heritage, [handler, ctor, processMethod, ...processFunctions]);
}
exports.renderProcessor = renderProcessor;
function createProcessFunctionMethod(funcDef, state) {
    return utils_2.createPublicMethod(ts.createIdentifier(`process_${funcDef.name.value}`), [
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.requestId, types_2.createNumberType()),
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.input, types_1.TProtocolType),
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.output, types_1.TProtocolType),
    ], types_2.createVoidType(), [
        ts.createStatement(utils_2.createMethodCall(utils_2.createMethodCall(utils_2.createPromise(types_2.typeNodeForFieldType(funcDef.returnType, state), types_2.createVoidType(), [
            ts.createTry(ts.createBlock([
                ...createArgsVariable(funcDef),
                utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, 'readMessageEnd'),
                utils_2.createCallStatement(identifiers_1.COMMON_IDENTIFIERS.resolve, [
                    utils_2.createMethodCall(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.this, identifiers_1.COMMON_IDENTIFIERS._handler), funcDef.name.value, funcDef.fields.map((next) => {
                        return ts.createIdentifier(`args.${next.name.value}`);
                    })),
                ]),
            ], true), ts.createCatchClause(ts.createVariableDeclaration('err'), ts.createBlock([
                utils_2.createCallStatement(ts.createIdentifier('reject'), [identifiers_1.COMMON_IDENTIFIERS.err]),
            ], true)), undefined),
        ]), 'then', [
            ts.createArrowFunction(undefined, undefined, [
                utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.data, types_2.typeNodeForFieldType(funcDef.returnType, state)),
            ], types_2.createVoidType(), undefined, ts.createBlock([
                utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.result, ts.createTypeReferenceNode(ts.createIdentifier(utils_1.createStructResultName(funcDef)), undefined), ts.createNew(ts.createIdentifier(utils_1.createStructResultName(funcDef)), undefined, [
                    ts.createObjectLiteral([
                        ts.createPropertyAssignment(identifiers_1.COMMON_IDENTIFIERS.success, identifiers_1.COMMON_IDENTIFIERS.data),
                    ]),
                ])),
                utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageBegin', [
                    ts.createLiteral(funcDef.name.value),
                    identifiers_1.MESSAGE_TYPE.REPLY,
                    identifiers_1.COMMON_IDENTIFIERS.requestId,
                ]),
                utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.result, identifiers_1.COMMON_IDENTIFIERS.write, [identifiers_1.COMMON_IDENTIFIERS.output]),
                utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageEnd', []),
                ts.createStatement(ts.createCall(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.output, identifiers_1.COMMON_IDENTIFIERS.flush), undefined, [])),
                ts.createReturn(),
            ], true)),
        ]), 'catch', [
            ts.createArrowFunction(undefined, undefined, [
                utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.err, types_3.createErrorType()),
            ], types_2.createVoidType(), undefined, ts.createBlock([
                ...createExceptionHandlers(funcDef, state),
            ], true)),
        ])),
    ]);
}
function createArgsVariable(funcDef) {
    return [
        utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.args, ts.createTypeReferenceNode(ts.createIdentifier(utils_1.createStructArgsName(funcDef)), undefined), ts.createCall(ts.createPropertyAccess(ts.createIdentifier(utils_1.createStructArgsName(funcDef)), identifiers_1.COMMON_IDENTIFIERS.read), undefined, [identifiers_1.COMMON_IDENTIFIERS.input])),
    ];
}
function createElseForExceptions(remaining, funcDef, state) {
    if (remaining.length > 0) {
        const [next, ...tail] = remaining;
        return ts.createIf(ts.createBinary(identifiers_1.COMMON_IDENTIFIERS.err, ts.SyntaxKind.InstanceOfKeyword, types_2.constructorNameForFieldType(next.fieldType, (name) => {
            return resolver_1.Resolver.resolveIdentifierName(name, {
                currentNamespace: state.currentNamespace,
                currentDefinitions: state.currentDefinitions,
                namespaceMap: state.project.namespaces,
            }).fullName;
        }, state)), createThenForException(next, funcDef), createElseForExceptions(tail, funcDef, state));
    }
    else {
        return ts.createBlock([
            utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.result, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TApplicationException, undefined), utils_2.createApplicationException('UNKNOWN', ts.createIdentifier('err.message'))),
            utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageBegin', [
                ts.createLiteral(funcDef.name.value),
                identifiers_1.MESSAGE_TYPE.EXCEPTION,
                identifiers_1.COMMON_IDENTIFIERS.requestId,
            ]),
            utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.result, identifiers_1.COMMON_IDENTIFIERS.write, [identifiers_1.COMMON_IDENTIFIERS.output]),
            utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageEnd'),
            utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, identifiers_1.COMMON_IDENTIFIERS.flush),
            ts.createReturn(),
        ], true);
    }
}
function createThenForException(throwDef, funcDef) {
    return ts.createBlock([
        utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.result, ts.createTypeReferenceNode(ts.createIdentifier(utils_1.createStructResultName(funcDef)), undefined), ts.createNew(ts.createIdentifier(utils_1.createStructResultName(funcDef)), undefined, [
            ts.createObjectLiteral([
                ts.createPropertyAssignment(ts.createIdentifier(throwDef.name.value), identifiers_1.COMMON_IDENTIFIERS.err),
            ]),
        ])),
        utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageBegin', [
            ts.createLiteral(funcDef.name.value),
            identifiers_1.MESSAGE_TYPE.REPLY,
            identifiers_1.COMMON_IDENTIFIERS.requestId,
        ]),
        utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.result, identifiers_1.COMMON_IDENTIFIERS.write, [identifiers_1.COMMON_IDENTIFIERS.output]),
        utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageEnd'),
        utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, identifiers_1.COMMON_IDENTIFIERS.flush),
        ts.createReturn(),
    ], true);
}
function createIfForExceptions(exps, funcDef, state) {
    const [throwDef, ...tail] = exps;
    return ts.createIf(ts.createBinary(identifiers_1.COMMON_IDENTIFIERS.err, ts.SyntaxKind.InstanceOfKeyword, types_2.constructorNameForFieldType(throwDef.fieldType, (name) => {
        return resolver_1.Resolver.resolveIdentifierName(name, {
            currentNamespace: state.currentNamespace,
            currentDefinitions: state.currentDefinitions,
            namespaceMap: state.project.namespaces,
        }).fullName;
    }, state)), createThenForException(throwDef, funcDef), createElseForExceptions(tail, funcDef, state));
}
function createExceptionHandlers(funcDef, state) {
    if (funcDef.throws.length > 0) {
        return [createIfForExceptions(funcDef.throws, funcDef, state)];
    }
    else {
        return [
            utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.result, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TApplicationException, undefined), utils_2.createApplicationException('UNKNOWN', ts.createIdentifier('err.message'))),
            utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageBegin', [
                ts.createLiteral(funcDef.name.value),
                identifiers_1.MESSAGE_TYPE.EXCEPTION,
                identifiers_1.COMMON_IDENTIFIERS.requestId,
            ]),
            utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.result, identifiers_1.COMMON_IDENTIFIERS.write, [identifiers_1.COMMON_IDENTIFIERS.output]),
            utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageEnd'),
            utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, identifiers_1.COMMON_IDENTIFIERS.flush),
            ts.createReturn(),
        ];
    }
}
function createProcessMethod(service, state) {
    return utils_2.createPublicMethod(identifiers_1.COMMON_IDENTIFIERS.process, [
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.input, types_1.TProtocolType),
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.output, types_1.TProtocolType),
    ], types_2.createVoidType(), [
        utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.metadata, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TMessage, undefined), utils_2.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, 'readMessageBegin', [])),
        utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.fname, types_2.createStringType(), ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.metadata, identifiers_1.COMMON_IDENTIFIERS.fname)),
        utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.requestId, types_2.createNumberType(), ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.metadata, identifiers_1.COMMON_IDENTIFIERS.rseqid)),
        utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.methodName, types_2.createStringType(), ts.createBinary(ts.createLiteral('process_'), ts.SyntaxKind.PlusToken, identifiers_1.COMMON_IDENTIFIERS.fname)),
        createMethodCallForFname(service, state),
    ]);
}
function createMethodCallForFunction(func) {
    const processMethodName = `process_${func.name.value}`;
    return ts.createCaseClause(ts.createLiteral(processMethodName), [
        ts.createBlock([
            ts.createStatement(utils_2.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.this, processMethodName, [
                identifiers_1.COMMON_IDENTIFIERS.requestId,
                identifiers_1.COMMON_IDENTIFIERS.input,
                identifiers_1.COMMON_IDENTIFIERS.output,
            ])),
            ts.createReturn(),
        ], true),
    ]);
}
function createMethodCallForFname(service, state) {
    return ts.createSwitch(identifiers_1.COMMON_IDENTIFIERS.methodName, ts.createCaseBlock([
        ...service_1.collectAllMethods(service, state).map(createMethodCallForFunction),
        ts.createDefaultClause([
            ts.createBlock([
                utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, 'skip', [identifiers_1.THRIFT_TYPES.STRUCT]),
                utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, 'readMessageEnd'),
                utils_2.createConstStatement(ts.createIdentifier('errMessage'), undefined, ts.createBinary(ts.createLiteral('Unknown function '), ts.SyntaxKind.PlusToken, identifiers_1.COMMON_IDENTIFIERS.fname)),
                utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.err, undefined, utils_2.createApplicationException('UNKNOWN_METHOD', ts.createIdentifier('errMessage'))),
                utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageBegin', [
                    identifiers_1.COMMON_IDENTIFIERS.fname,
                    identifiers_1.MESSAGE_TYPE.EXCEPTION,
                    identifiers_1.COMMON_IDENTIFIERS.requestId,
                ]),
                utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.err, identifiers_1.COMMON_IDENTIFIERS.write, [identifiers_1.COMMON_IDENTIFIERS.output]),
                utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageEnd'),
                utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, identifiers_1.COMMON_IDENTIFIERS.flush),
                ts.createReturn(),
            ], true),
        ]),
    ]));
}
//# sourceMappingURL=processor.js.map