"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const types_1 = require("./types");
const utils_1 = require("./utils");
const identifiers_1 = require("../identifiers");
const utils_2 = require("../utils");
const types_2 = require("../types");
const initializers_1 = require("../initializers");
const annotations_1 = require("../annotations");
const resolver_1 = require("../../../resolver");
const types_3 = require("../../shared/types");
const utils_3 = require("../../shared/utils");
const utils_4 = require("../struct/utils");
function extendsAbstract() {
    return ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
        ts.createExpressionWithTypeArguments([ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Context, undefined)], identifiers_1.THRIFT_IDENTIFIERS.ThriftClient),
    ]);
}
function extendsService(service, state) {
    return ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
        ts.createExpressionWithTypeArguments([ts.createTypeReferenceNode(identifiers_1.COMMON_IDENTIFIERS.Context, undefined)], ts.createPropertyAccess(ts.createIdentifier(`${resolver_1.Resolver.resolveIdentifierName(service.value, {
            currentNamespace: state.currentNamespace,
            currentDefinitions: state.currentDefinitions,
            namespaceMap: state.project.namespaces,
        }).fullName}`), identifiers_1.COMMON_IDENTIFIERS.Client)),
    ]);
}
function renderClient(service, state) {
    const staticServiceName = utils_1.renderServiceNameStaticProperty();
    const staticAnnotations = annotations_1.renderServiceAnnotationsStaticProperty();
    const staticMethodAnnotations = annotations_1.renderMethodAnnotationsStaticProperty();
    const staticMethodNames = utils_1.renderMethodNamesStaticProperty();
    const serviceName = utils_1.renderServiceNameProperty();
    const annotations = annotations_1.renderServiceAnnotationsProperty();
    const methodAnnotations = annotations_1.renderMethodAnnotationsProperty();
    const methodNames = utils_1.renderMethodNamesProperty();
    const methodParameters = utils_1.renderMethodParametersProperty();
    const baseMethods = service.functions.map((func) => {
        return createBaseMethodForDefinition(func, state);
    });
    const heritage = service.extends !== null
        ? [extendsService(service.extends, state)]
        : [extendsAbstract()];
    return ts.createClassDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], identifiers_1.COMMON_IDENTIFIERS.Client, [
        ts.createTypeParameterDeclaration(identifiers_1.COMMON_IDENTIFIERS.Context, undefined, types_2.createAnyType()),
    ], heritage, [
        staticServiceName,
        staticAnnotations,
        staticMethodAnnotations,
        staticMethodNames,
        serviceName,
        annotations,
        methodAnnotations,
        methodNames,
        methodParameters,
        ...createCtor(service),
        ...baseMethods,
    ]);
}
exports.renderClient = renderClient;
function createCtor(service) {
    if (service.extends !== null) {
        return [
            utils_3.createClassConstructor([utils_2.createFunctionParameter('connection', types_1.createConnectionType())], [createSuperCall()]),
        ];
    }
    else {
        return [];
    }
}
function createSuperCall() {
    return ts.createStatement(ts.createCall(ts.createSuper(), [], [identifiers_1.COMMON_IDENTIFIERS.connection]));
}
function createBaseMethodForDefinition(def, state) {
    return ts.createMethod(undefined, [ts.createToken(ts.SyntaxKind.PublicKeyword)], undefined, def.name.value, undefined, undefined, [
        ...def.fields.map((field) => {
            return createParametersForField(field, state);
        }),
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.context, types_1.ContextType, undefined, true),
    ], types_3.createPromiseType(types_2.typeNodeForFieldType(def.returnType, state)), ts.createBlock([
        utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.writer, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TTransport, undefined), ts.createNew(ts.createIdentifier('this.transport'), undefined, [])),
        utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.output, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TProtocol, undefined), ts.createNew(ts.createIdentifier('this.protocol'), undefined, [identifiers_1.COMMON_IDENTIFIERS.writer])),
        utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageBegin', [
            ts.createLiteral(def.name.value),
            identifiers_1.MESSAGE_TYPE.CALL,
            ts.createCall(ts.createIdentifier('this.incrementRequestId'), undefined, []),
        ]),
        utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.args, ts.createTypeReferenceNode(ts.createIdentifier(utils_4.looseName(utils_1.createStructArgsName(def), def.type, state)), undefined), ts.createObjectLiteral(def.fields.map((next) => {
            return ts.createShorthandPropertyAssignment(next.name.value);
        }))),
        utils_2.createMethodCallStatement(ts.createIdentifier(utils_4.toolkitName(utils_1.createStructArgsName(def), state)), 'encode', [identifiers_1.COMMON_IDENTIFIERS.args, identifiers_1.COMMON_IDENTIFIERS.output]),
        utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageEnd'),
        ts.createReturn(ts.createCall(ts.createPropertyAccess(createConnectionSend(), ts.createIdentifier('then')), undefined, [
            ts.createArrowFunction(undefined, undefined, [
                utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.data, types_3.createBufferType()),
            ], undefined, undefined, ts.createBlock([
                utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.reader, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TTransport, undefined), ts.createCall(ts.createIdentifier('this.transport.receiver'), undefined, [identifiers_1.COMMON_IDENTIFIERS.data])),
                utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.input, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TProtocol, undefined), ts.createNew(ts.createIdentifier('this.protocol'), undefined, [identifiers_1.COMMON_IDENTIFIERS.reader])),
                ts.createTry(ts.createBlock([
                    ts.createVariableStatement(undefined, ts.createVariableDeclarationList([
                        ts.createVariableDeclaration(ts.createObjectBindingPattern([
                            ts.createBindingElement(undefined, identifiers_1.COMMON_IDENTIFIERS.fieldName, identifiers_1.COMMON_IDENTIFIERS.fieldName),
                            ts.createBindingElement(undefined, identifiers_1.COMMON_IDENTIFIERS.messageType, identifiers_1.COMMON_IDENTIFIERS.messageType),
                        ]), ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.IThriftMessage, undefined), ts.createCall(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.input, 'readMessageBegin'), undefined, [])),
                    ], ts.NodeFlags.Const)),
                    ts.createIf(ts.createBinary(identifiers_1.COMMON_IDENTIFIERS.fieldName, ts.SyntaxKind
                        .EqualsEqualsEqualsToken, ts.createLiteral(def.name.value)), ts.createBlock([
                        ts.createIf(ts.createBinary(identifiers_1.COMMON_IDENTIFIERS.messageType, ts
                            .SyntaxKind
                            .EqualsEqualsEqualsToken, identifiers_1.MESSAGE_TYPE.EXCEPTION), ts.createBlock([
                            utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.err, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TApplicationException, undefined), ts.createCall(ts.createPropertyAccess(identifiers_1.THRIFT_IDENTIFIERS.TApplicationExceptionCodec, ts.createIdentifier('decode')), undefined, [
                                identifiers_1.COMMON_IDENTIFIERS.input,
                            ])),
                            utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, 'readMessageEnd'),
                            ts.createReturn(rejectPromiseWith(identifiers_1.COMMON_IDENTIFIERS.err)),
                        ], true), ts.createBlock([
                            ...createNewResultInstance(def, state),
                            utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, 'readMessageEnd'),
                            createResultHandler(def),
                        ], true)),
                    ], true), ts.createBlock([
                        ts.createReturn(rejectPromiseWith(ts.createNew(identifiers_1.THRIFT_IDENTIFIERS.TApplicationException, undefined, [
                            identifiers_1.APPLICATION_EXCEPTION.WRONG_METHOD_NAME,
                            ts.createBinary(ts.createLiteral('Received a response to an unknown RPC function: '), ts
                                .SyntaxKind
                                .PlusToken, identifiers_1.COMMON_IDENTIFIERS.fieldName),
                        ]))),
                    ], true)),
                ], true), ts.createCatchClause(ts.createVariableDeclaration(identifiers_1.COMMON_IDENTIFIERS.err), ts.createBlock([
                    ts.createReturn(rejectPromiseWith(identifiers_1.COMMON_IDENTIFIERS.err)),
                ], true)), undefined),
            ], true)),
        ])),
    ], true));
}
function createConnectionSend() {
    return ts.createCall(ts.createIdentifier('this.connection.send'), undefined, [
        ts.createCall(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.writer, 'flush'), undefined, []),
        identifiers_1.COMMON_IDENTIFIERS.context,
    ]);
}
function createNewResultInstance(def, state) {
    return [
        utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.result, ts.createTypeReferenceNode(ts.createIdentifier(utils_4.strictName(utils_1.createStructResultName(def), def.type, state)), undefined), ts.createCall(ts.createPropertyAccess(ts.createIdentifier(utils_4.toolkitName(utils_1.createStructResultName(def), state)), identifiers_1.COMMON_IDENTIFIERS.decode), undefined, [identifiers_1.COMMON_IDENTIFIERS.input])),
    ];
}
function resolvePromiseWith(result) {
    return ts.createCall(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.Promise, identifiers_1.COMMON_IDENTIFIERS.resolve), undefined, [result]);
}
function rejectPromiseWith(result) {
    return ts.createCall(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.Promise, identifiers_1.COMMON_IDENTIFIERS.reject), undefined, [result]);
}
function createResultReturn(def) {
    if (def.returnType.type === thrift_parser_1.SyntaxType.VoidKeyword) {
        return ts.createReturn(resolvePromiseWith(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.result, identifiers_1.COMMON_IDENTIFIERS.success)));
    }
    else {
        return ts.createIf(utils_2.createNotNullCheck(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.result, identifiers_1.COMMON_IDENTIFIERS.success)), ts.createBlock([
            ts.createReturn(resolvePromiseWith(ts.createPropertyAccess(identifiers_1.COMMON_IDENTIFIERS.result, identifiers_1.COMMON_IDENTIFIERS.success))),
        ], true), ts.createBlock([
            ts.createReturn(rejectPromiseWith(utils_2.createApplicationException('UNKNOWN', `${def.name.value} failed: unknown result`))),
        ], true));
    }
}
function createElseForExceptions(throwDef, remaining, funcDef) {
    if (remaining.length > 0) {
        const [next, ...tail] = remaining;
        return ts.createIf(utils_2.createNotNullCheck(`result.${next.name.value}`), createThenForException(next), createElseForExceptions(next, tail, funcDef));
    }
    else {
        return createResultReturn(funcDef);
    }
}
function createThenForException(throwDef) {
    return ts.createBlock([
        ts.createReturn(rejectPromiseWith(ts.createIdentifier(`result.${throwDef.name.value}`))),
    ], true);
}
function createIfForExceptions(exps, funcDef) {
    const [throwDef, ...tail] = exps;
    return ts.createIf(utils_2.createNotNullCheck(`result.${throwDef.name.value}`), createThenForException(throwDef), createElseForExceptions(throwDef, tail, funcDef));
}
function createResultHandler(def) {
    if (def.throws.length > 0) {
        return createIfForExceptions(def.throws, def);
    }
    else {
        return createResultReturn(def);
    }
}
function createParametersForField(field, state) {
    const defaultValue = field.defaultValue !== null
        ? initializers_1.renderValue(field.fieldType, field.defaultValue, state)
        : undefined;
    return utils_2.createFunctionParameter(field.name.value, types_2.typeNodeForFieldType(field.fieldType, state, true), defaultValue, field.requiredness === 'optional');
}
//# sourceMappingURL=client.js.map