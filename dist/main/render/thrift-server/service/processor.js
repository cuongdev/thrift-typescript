"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const types_1 = require("./types");
const utils_1 = require("./utils");
const identifiers_1 = require("../identifiers");
const utils_2 = require("../utils");
const types_2 = require("../types");
const annotations_1 = require("../annotations");
const resolver_1 = require("../../../resolver");
const service_1 = require("../../shared/service");
const types_3 = require("../../shared/types");
const utils_3 = require("../struct/utils");
function objectLiteralForServiceFunctions(node) {
    switch (node.type) {
        case thrift_parser_1.SyntaxType.ServiceDefinition:
            return ts.createObjectLiteral(node.functions.map((next) => {
                return ts.createPropertyAssignment(ts.createIdentifier(next.name.value), ts.createIdentifier(`handler.${next.name.value}`));
            }), true);
        default:
            throw new TypeError(`A service can only extend another service. Found: ${node.type}`);
    }
}
function createHandlerType(node) {
    return ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.IHandler, [
        ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Context, undefined),
    ]);
}
function extendsService(service, state) {
    return ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
        ts.createExpressionWithTypeArguments([ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Context, undefined)], ts.createIdentifier(`${resolver_1.Resolver.resolveIdentifierName(service.value, {
            currentNamespace: state.currentNamespace,
            currentDefinitions: state.currentDefinitions,
            namespaceMap: state.project.namespaces,
        }).fullName}.Processor`)),
    ]);
}
exports.extendsService = extendsService;
function extendsAbstract() {
    return ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
        ts.createExpressionWithTypeArguments([
            ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Context, undefined),
            ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.IHandler, [
                ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Context, undefined),
            ]),
        ], identifiers_1.THRIFT_IDENTIFIERS.ThriftProcessor),
    ]);
}
exports.extendsAbstract = extendsAbstract;
function renderProcessor(service, state) {
    const handler = ts.createProperty(undefined, [
        ts.createToken(ts.SyntaxKind.ProtectedKeyword),
        ts.createToken(ts.SyntaxKind.ReadonlyKeyword),
    ], identifiers_1.COMMON_IDENTIFIERS._handler, undefined, ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.IHandler, [
        ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Context, undefined),
    ]), undefined);
    const staticServiceName = utils_1.renderServiceNameStaticProperty();
    const staticAnnotations = annotations_1.renderServiceAnnotationsStaticProperty();
    const staticMethodAnnotations = annotations_1.renderMethodAnnotationsStaticProperty();
    const staticMethodNames = utils_1.renderMethodNamesStaticProperty();
    const serviceName = utils_1.renderServiceNameProperty();
    const annotations = annotations_1.renderServiceAnnotationsProperty();
    const methodAnnotations = annotations_1.renderMethodAnnotationsProperty();
    const methodNames = utils_1.renderMethodNamesProperty();
    const processMethod = createProcessMethod(service, state);
    const processFunctions = service.functions.map((next) => {
        return createProcessFunctionMethod(service, next, state);
    });
    const heritage = service.extends !== null
        ? [extendsService(service.extends, state)]
        : [extendsAbstract()];
    return ts.createClassDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], 'Processor', [
        ts.createTypeParameterDeclaration('Context', undefined, types_2.createAnyType()),
    ], heritage, [
        handler,
        staticServiceName,
        staticAnnotations,
        staticMethodAnnotations,
        staticMethodNames,
        serviceName,
        annotations,
        methodAnnotations,
        methodNames,
        createCtor(service, state),
        processMethod,
        ...processFunctions,
    ]);
}
exports.renderProcessor = renderProcessor;
function createCtor(service, state) {
    if (service.extends !== null) {
        return utils_2.createClassConstructor([utils_2.createFunctionParameter('handler', createHandlerType(service))], [
            createSuperCall(service.extends, state),
            utils_2.createAssignmentStatement(ts.createIdentifier('this._handler'), ts.createIdentifier('handler')),
        ]);
    }
    else {
        return utils_2.createClassConstructor([utils_2.createFunctionParameter('handler', createHandlerType(service))], [
            ts.createStatement(ts.createCall(ts.createSuper(), [], [])),
            utils_2.createAssignmentStatement(ts.createIdentifier('this._handler'), ts.createIdentifier('handler')),
        ]);
    }
}
function createSuperCall(service, state) {
    return ts.createStatement(ts.createCall(ts.createSuper(), [], [
        objectLiteralForServiceFunctions(resolver_1.Resolver.resolveIdentifierDefinition(service, {
            currentNamespace: state.currentNamespace,
            namespaceMap: state.project.namespaces,
        }).definition),
    ]));
}
function createProcessFunctionMethod(service, funcDef, state) {
    return utils_2.createPublicMethod(ts.createIdentifier(`process_${funcDef.name.value}`), [
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.requestId, types_2.createNumberType()),
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.input, types_1.TProtocolType),
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.output, types_1.TProtocolType),
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.context, types_1.ContextType, undefined),
    ], types_3.createPromiseType(types_3.createBufferType()), [
        ts.createReturn(utils_2.createMethodCall(utils_2.createMethodCall(utils_2.createPromise(types_2.typeNodeForFieldType(funcDef.returnType, state, true), types_2.createVoidType(), [
            ts.createTry(ts.createBlock([
                ...createArgsVariable(funcDef, state),
                utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, 'readMessageEnd'),
                utils_2.createCallStatement(identifiers_1.COMMON_IDENTIFIERS.resolve, [
                    utils_2.createMethodCall(ts.createIdentifier('this._handler'), funcDef.name.value, [
                        ...funcDef.fields.map((next) => {
                            return ts.createIdentifier(`args.${next.name.value}`);
                        }),
                        identifiers_1.COMMON_IDENTIFIERS.context,
                    ]),
                ]),
            ], true), ts.createCatchClause(ts.createVariableDeclaration('err'), ts.createBlock([
                utils_2.createCallStatement(identifiers_1.COMMON_IDENTIFIERS.reject, [identifiers_1.COMMON_IDENTIFIERS.err]),
            ], true)), undefined),
        ]), identifiers_1.COMMON_IDENTIFIERS.then, [
            ts.createArrowFunction(undefined, undefined, [
                utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.data, types_2.typeNodeForFieldType(funcDef.returnType, state, true)),
            ], types_3.createBufferType(), undefined, ts.createBlock([
                utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.result, ts.createTypeReferenceNode(ts.createIdentifier(utils_3.looseName(utils_1.createStructResultName(funcDef), thrift_parser_1.SyntaxType.StructDefinition, state)), undefined), ts.createObjectLiteral([
                    ts.createPropertyAssignment(identifiers_1.COMMON_IDENTIFIERS.success, identifiers_1.COMMON_IDENTIFIERS.data),
                ])),
                utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageBegin', [
                    ts.createLiteral(funcDef.name.value),
                    identifiers_1.MESSAGE_TYPE.REPLY,
                    identifiers_1.COMMON_IDENTIFIERS.requestId,
                ]),
                utils_2.createMethodCallStatement(ts.createIdentifier(utils_3.toolkitName(utils_1.createStructResultName(funcDef), state)), 'encode', [
                    identifiers_1.COMMON_IDENTIFIERS.result,
                    identifiers_1.COMMON_IDENTIFIERS.output,
                ]),
                utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageEnd', []),
                ts.createReturn(ts.createCall(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.output, 'flush'), undefined, [])),
            ], true)),
        ]), 'catch', [
            ts.createArrowFunction(undefined, undefined, [
                utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.err, types_3.createErrorType()),
            ], types_3.createBufferType(), undefined, ts.createBlock([
                ...createExceptionHandlers(funcDef, state),
            ], true)),
        ])),
    ]);
}
function createArgsVariable(funcDef, state) {
    if (funcDef.fields.length > 0) {
        return [
            utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.args, ts.createTypeReferenceNode(ts.createIdentifier(utils_3.strictName(utils_1.createStructArgsName(funcDef), thrift_parser_1.SyntaxType.StructDefinition, state)), undefined), ts.createCall(ts.createPropertyAccess(ts.createIdentifier(utils_3.toolkitName(utils_1.createStructArgsName(funcDef), state)), ts.createIdentifier('decode')), undefined, [identifiers_1.COMMON_IDENTIFIERS.input])),
        ];
    }
    else {
        return [];
    }
}
function createElseForExceptions(exp, remaining, funcDef, state) {
    if (remaining.length > 0) {
        const [next, ...tail] = remaining;
        return ts.createIf(ts.createBinary(identifiers_1.COMMON_IDENTIFIERS.err, ts.SyntaxKind.InstanceOfKeyword, types_2.constructorNameForFieldType(next.fieldType, utils_3.className, state)), createThenForException(next, funcDef, state), createElseForExceptions(next, tail, funcDef, state));
    }
    else {
        return ts.createBlock([
            utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.result, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TApplicationException, undefined), utils_2.createApplicationException('UNKNOWN', ts.createIdentifier('err.message'))),
            utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageBegin', [
                ts.createLiteral(funcDef.name.value),
                identifiers_1.MESSAGE_TYPE.EXCEPTION,
                identifiers_1.COMMON_IDENTIFIERS.requestId,
            ]),
            utils_2.createMethodCallStatement(identifiers_1.THRIFT_IDENTIFIERS.TApplicationExceptionCodec, 'encode', [identifiers_1.COMMON_IDENTIFIERS.result, identifiers_1.COMMON_IDENTIFIERS.output]),
            utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageEnd'),
            ts.createReturn(ts.createCall(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.output, 'flush'), undefined, [])),
        ], true);
    }
}
function createThenForException(throwDef, funcDef, state) {
    return ts.createBlock([
        utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.result, ts.createTypeReferenceNode(ts.createIdentifier(utils_3.looseName(utils_1.createStructResultName(funcDef), thrift_parser_1.SyntaxType.StructDefinition, state)), undefined), ts.createObjectLiteral([
            ts.createPropertyAssignment(ts.createIdentifier(throwDef.name.value), identifiers_1.COMMON_IDENTIFIERS.err),
        ])),
        utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageBegin', [
            ts.createLiteral(funcDef.name.value),
            identifiers_1.MESSAGE_TYPE.REPLY,
            identifiers_1.COMMON_IDENTIFIERS.requestId,
        ]),
        utils_2.createMethodCallStatement(ts.createIdentifier(utils_3.toolkitName(utils_1.createStructResultName(funcDef), state)), 'encode', [identifiers_1.COMMON_IDENTIFIERS.result, identifiers_1.COMMON_IDENTIFIERS.output]),
        utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageEnd'),
        ts.createReturn(ts.createCall(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.output, 'flush'), undefined, [])),
    ], true);
}
function createIfForExceptions(exps, funcDef, state) {
    const [throwDef, ...tail] = exps;
    return ts.createIf(ts.createBinary(identifiers_1.COMMON_IDENTIFIERS.err, ts.SyntaxKind.InstanceOfKeyword, types_2.constructorNameForFieldType(throwDef.fieldType, utils_3.className, state)), createThenForException(throwDef, funcDef, state), createElseForExceptions(throwDef, tail, funcDef, state));
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
            utils_2.createMethodCallStatement(identifiers_1.THRIFT_IDENTIFIERS.TApplicationExceptionCodec, 'encode', [identifiers_1.COMMON_IDENTIFIERS.result, identifiers_1.COMMON_IDENTIFIERS.output]),
            utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageEnd'),
            ts.createReturn(ts.createCall(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.output, 'flush'), undefined, [])),
        ];
    }
}
function createProcessMethod(service, state) {
    return utils_2.createPublicMethod(identifiers_1.COMMON_IDENTIFIERS.process, [
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.input, types_1.TProtocolType),
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.output, types_1.TProtocolType),
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.context, types_1.ContextType, undefined),
    ], types_3.createPromiseType(types_3.createBufferType()), [
        ts.createReturn(utils_2.createPromise(types_3.createBufferType(), types_2.createVoidType(), [
            utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.metadata, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IThriftMessage, undefined), utils_2.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.input, 'readMessageBegin', [])),
            utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.fieldName, types_2.createStringType(), ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.metadata, identifiers_1.COMMON_IDENTIFIERS.fieldName)),
            utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.requestId, types_2.createNumberType(), ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.metadata, identifiers_1.COMMON_IDENTIFIERS.requestId)),
            utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.methodName, types_2.createStringType(), ts.createBinary(ts.createLiteral('process_'), ts.SyntaxKind.PlusToken, identifiers_1.COMMON_IDENTIFIERS.fieldName)),
            createMethodCallForFname(service, state),
        ])),
    ]);
}
function createMethodCallForFunction(func) {
    const processMethodName = `process_${func.name.value}`;
    return ts.createCaseClause(ts.createLiteral(processMethodName), [
        ts.createBlock([
            ts.createStatement(ts.createCall(identifiers_1.COMMON_IDENTIFIERS.resolve, undefined, [
                utils_2.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.this, processMethodName, [
                    identifiers_1.COMMON_IDENTIFIERS.requestId,
                    identifiers_1.COMMON_IDENTIFIERS.input,
                    identifiers_1.COMMON_IDENTIFIERS.output,
                    identifiers_1.COMMON_IDENTIFIERS.context,
                ]),
            ])),
            ts.createStatement(identifiers_1.COMMON_IDENTIFIERS.break),
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
                utils_2.createConstStatement(ts.createIdentifier('errMessage'), undefined, ts.createBinary(ts.createLiteral('Unknown function '), ts.SyntaxKind.PlusToken, identifiers_1.COMMON_IDENTIFIERS.fieldName)),
                utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.err, undefined, utils_2.createApplicationException('UNKNOWN_METHOD', ts.createIdentifier('errMessage'))),
                utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageBegin', [
                    identifiers_1.COMMON_IDENTIFIERS.fieldName,
                    identifiers_1.MESSAGE_TYPE.EXCEPTION,
                    identifiers_1.COMMON_IDENTIFIERS.requestId,
                ]),
                utils_2.createMethodCallStatement(identifiers_1.THRIFT_IDENTIFIERS.TApplicationExceptionCodec, 'encode', [identifiers_1.COMMON_IDENTIFIERS.err, identifiers_1.COMMON_IDENTIFIERS.output]),
                utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageEnd'),
                ts.createStatement(ts.createCall(identifiers_1.COMMON_IDENTIFIERS.resolve, undefined, [
                    utils_2.createMethodCall(identifiers_1.COMMON_IDENTIFIERS.output, 'flush'),
                ])),
                ts.createStatement(identifiers_1.COMMON_IDENTIFIERS.break),
            ], true),
        ]),
    ]));
}
//# sourceMappingURL=processor.js.map