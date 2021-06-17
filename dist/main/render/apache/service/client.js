"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const types_1 = require("./types");
const utils_1 = require("./utils");
const values_1 = require("../values");
const identifiers_1 = require("../identifiers");
const utils_2 = require("../utils");
const types_2 = require("../types");
const resolver_1 = require("../../../resolver");
const types_3 = require("../../shared/types");
function renderClient(node, state) {
    const seqid = utils_2.createPublicProperty('_seqid', types_2.createNumberType());
    const reqs = utils_2.createPublicProperty('_reqs', types_1.createReqType());
    const output = utils_2.createPublicProperty('output', ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TTransport, undefined));
    const protocol = utils_2.createPublicProperty('protocol', types_1.createProtocolType());
    const ctor = utils_2.createClassConstructor([
        utils_2.createFunctionParameter('output', ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TTransport, undefined)),
        utils_2.createFunctionParameter('protocol', types_1.createProtocolType()),
    ], [
        ...createSuperCall(node),
        utils_2.createAssignmentStatement(ts.createIdentifier('this._seqid'), ts.createLiteral(0)),
        utils_2.createAssignmentStatement(ts.createIdentifier('this._reqs'), ts.createObjectLiteral()),
        utils_2.createAssignmentStatement(ts.createIdentifier('this.output'), identifiers_1.COMMON_IDENTIFIERS.output),
        utils_2.createAssignmentStatement(ts.createIdentifier('this.protocol'), ts.createIdentifier('protocol')),
    ]);
    const incrementSeqIdMethod = ts.createMethod(undefined, [ts.createToken(ts.SyntaxKind.PublicKeyword)], undefined, 'incrementSeqId', undefined, undefined, [], types_2.createNumberType(), ts.createBlock([
        ts.createReturn(ts.createBinary(ts.createIdentifier('this._seqid'), ts.SyntaxKind.PlusEqualsToken, ts.createLiteral(1))),
    ], true));
    const baseMethods = node.functions.map((next) => {
        return createBaseMethodForDefinition(next, state);
    });
    const sendMethods = node.functions.map((next) => {
        return createSendMethodForDefinition(next, state);
    });
    const recvMethods = node.functions.map((next) => {
        return createRecvMethodForDefinition(node, next);
    });
    const heritage = node.extends !== null
        ? [
            ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
                ts.createExpressionWithTypeArguments([], ts.createPropertyAccess(ts.createIdentifier(`${resolver_1.Resolver.resolveIdentifierName(node.extends.value, {
                    currentNamespace: state.currentNamespace,
                    currentDefinitions: state.currentDefinitions,
                    namespaceMap: state.project.namespaces,
                }).fullName}`), identifiers_1.COMMON_IDENTIFIERS.Client)),
            ]),
        ]
        : [];
    return ts.createClassDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], identifiers_1.COMMON_IDENTIFIERS.Client, [], heritage, [
        seqid,
        reqs,
        output,
        protocol,
        ctor,
        incrementSeqIdMethod,
        ...baseMethods,
        ...sendMethods,
        ...recvMethods,
    ]);
}
exports.renderClient = renderClient;
function createSuperCall(node) {
    if (node.extends !== null) {
        return [
            ts.createStatement(ts.createCall(ts.createSuper(), [], [
                ts.createIdentifier('output'),
                ts.createIdentifier('protocol'),
            ])),
        ];
    }
    else {
        return [];
    }
}
function createBaseMethodForDefinition(def, state) {
    return ts.createMethod(undefined, [ts.createToken(ts.SyntaxKind.PublicKeyword)], undefined, def.name.value, undefined, undefined, def.fields.map((field) => {
        return createParametersForField(field, state);
    }), types_3.createPromiseType(types_2.typeNodeForFieldType(def.returnType, state)), ts.createBlock([
        utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.requestId, types_2.createNumberType(), ts.createCall(ts.createIdentifier('this.incrementSeqId'), undefined, [])),
        ts.createReturn(utils_2.createPromise(types_2.typeNodeForFieldType(def.returnType, state), types_2.createVoidType(), [
            utils_2.createAssignmentStatement(ts.createElementAccess(ts.createIdentifier('this._reqs'), identifiers_1.COMMON_IDENTIFIERS.requestId), ts.createArrowFunction(undefined, undefined, [
                utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.error, undefined, undefined),
                utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.result, undefined, undefined),
            ], undefined, undefined, ts.createBlock([
                ts.createStatement(ts.createDelete(ts.createElementAccess(ts.createIdentifier('this._reqs'), identifiers_1.COMMON_IDENTIFIERS.requestId))),
                ts.createIf(utils_2.createNotNullCheck(identifiers_1.COMMON_IDENTIFIERS.error), ts.createBlock([
                    utils_2.createCallStatement(identifiers_1.COMMON_IDENTIFIERS.reject, [
                        identifiers_1.COMMON_IDENTIFIERS.error,
                    ]),
                ], true), ts.createBlock([
                    utils_2.createCallStatement(identifiers_1.COMMON_IDENTIFIERS.resolve, [
                        identifiers_1.COMMON_IDENTIFIERS.result,
                    ]),
                ], true)),
            ], true))),
            utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.this, `send_${def.name.value}`, [
                ...def.fields.map((next) => {
                    return ts.createIdentifier(next.name.value);
                }),
                identifiers_1.COMMON_IDENTIFIERS.requestId,
            ]),
        ])),
    ], true));
}
function createSendMethodForDefinition(def, state) {
    return ts.createMethod(undefined, [ts.createToken(ts.SyntaxKind.PublicKeyword)], undefined, `send_${def.name.value}`, undefined, undefined, [
        ...def.fields.map((field) => {
            const returnType = field.requiredness === 'optional'
                ? ts.createUnionTypeNode([
                    types_2.typeNodeForFieldType(field.fieldType, state),
                    types_3.createUndefinedType(),
                ])
                : types_2.typeNodeForFieldType(field.fieldType, state);
            return utils_2.createFunctionParameter(ts.createIdentifier(field.name.value), returnType);
        }),
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.requestId, types_2.createNumberType()),
    ], types_2.createVoidType(), ts.createBlock([
        utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.output, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TProtocol, undefined), ts.createNew(ts.createIdentifier('this.protocol'), undefined, [ts.createIdentifier('this.output')])),
        utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageBegin', [
            ts.createLiteral(def.name.value),
            identifiers_1.MESSAGE_TYPE.CALL,
            identifiers_1.COMMON_IDENTIFIERS.requestId,
        ]),
        utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.args, ts.createTypeReferenceNode(ts.createIdentifier(utils_1.createStructArgsName(def)), undefined), ts.createNew(ts.createIdentifier(utils_1.createStructArgsName(def)), undefined, createArgumentsObject(def))),
        utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.args, identifiers_1.COMMON_IDENTIFIERS.write, [identifiers_1.COMMON_IDENTIFIERS.output]),
        utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.output, 'writeMessageEnd'),
        ts.createStatement(utils_2.createMethodCall(ts.createIdentifier('this.output'), identifiers_1.COMMON_IDENTIFIERS.flush, [])),
        ts.createReturn(),
    ], true));
}
function createArgumentsObject(def) {
    if (def.fields.length > 0) {
        return [
            ts.createObjectLiteral(def.fields.map((next) => {
                return ts.createShorthandPropertyAssignment(next.name.value);
            })),
        ];
    }
    else {
        return [];
    }
}
function createRecvMethodForDefinition(service, def) {
    return ts.createMethod(undefined, [ts.createToken(ts.SyntaxKind.PublicKeyword)], undefined, `recv_${def.name.value}`, undefined, undefined, [
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.input, ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TProtocol, undefined)),
        utils_2.createFunctionParameter(ts.createIdentifier('mtype'), ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.MessageType, undefined)),
        utils_2.createFunctionParameter(identifiers_1.COMMON_IDENTIFIERS.requestId, types_2.createNumberType()),
    ], types_2.createVoidType(), ts.createBlock([
        utils_2.createConstStatement(ts.createIdentifier('noop'), undefined, ts.createArrowFunction(undefined, undefined, [], types_2.createAnyType(), undefined, ts.createIdentifier('null'))),
        utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.callback, undefined, ts.createBinary(ts.createElementAccess(ts.createIdentifier('this._reqs'), identifiers_1.COMMON_IDENTIFIERS.requestId), ts.SyntaxKind.BarBarToken, ts.createIdentifier('noop'))),
        ts.createIf(ts.createBinary(ts.createIdentifier('mtype'), ts.SyntaxKind.EqualsEqualsEqualsToken, identifiers_1.MESSAGE_TYPE.EXCEPTION), ts.createBlock([
            utils_2.createConstStatement(ts.createIdentifier('x'), ts.createTypeReferenceNode(identifiers_1.THRIFT_IDENTIFIERS.TApplicationException, undefined), ts.createNew(identifiers_1.THRIFT_IDENTIFIERS.TApplicationException, undefined, [])),
            utils_2.createMethodCallStatement(ts.createIdentifier('x'), 'read', [identifiers_1.COMMON_IDENTIFIERS.input]),
            utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, 'readMessageEnd'),
            ts.createReturn(ts.createCall(identifiers_1.COMMON_IDENTIFIERS.callback, undefined, [ts.createIdentifier('x')])),
        ], true), ts.createBlock([
            ...createNewResultInstance(def),
            utils_2.createMethodCallStatement(identifiers_1.COMMON_IDENTIFIERS.input, 'readMessageEnd'),
            createResultHandler(def),
        ], true)),
    ], true));
}
function createNewResultInstance(def) {
    if (def.returnType.type === thrift_parser_1.SyntaxType.VoidKeyword && !def.throws.length) {
        return [];
    }
    else {
        return [
            utils_2.createConstStatement(identifiers_1.COMMON_IDENTIFIERS.result, ts.createTypeReferenceNode(ts.createIdentifier(utils_1.createStructResultName(def)), undefined), ts.createCall(ts.createPropertyAccess(ts.createIdentifier(utils_1.createStructResultName(def)), identifiers_1.COMMON_IDENTIFIERS.read), undefined, [identifiers_1.COMMON_IDENTIFIERS.input])),
        ];
    }
}
function undefinedReturn() {
    return ts.createReturn(ts.createCall(identifiers_1.COMMON_IDENTIFIERS.callback, undefined, [
        identifiers_1.COMMON_IDENTIFIERS.undefined,
    ]));
}
function createResultReturn(def) {
    if (def.returnType.type === thrift_parser_1.SyntaxType.VoidKeyword) {
        return undefinedReturn();
    }
    else {
        return ts.createIf(utils_2.createNotNullCheck(ts.createIdentifier('result.success')), ts.createBlock([
            ts.createReturn(ts.createCall(identifiers_1.COMMON_IDENTIFIERS.callback, undefined, [
                identifiers_1.COMMON_IDENTIFIERS.undefined,
                ts.createIdentifier('result.success'),
            ])),
        ], true), ts.createBlock([
            ts.createReturn(ts.createCall(identifiers_1.COMMON_IDENTIFIERS.callback, undefined, [
                utils_2.createApplicationException('UNKNOWN', `${def.name.value} failed: unknown result`),
            ])),
        ], true));
    }
}
function createElseForExceptions(throwDef, remaining, funcDef) {
    if (remaining.length > 0) {
        const [next, ...tail] = remaining;
        return ts.createIf(utils_2.createNotNullCheck(`result.${next.name.value}`), createThenForException(next), createElseForExceptions(next, tail, funcDef));
    }
    else {
        return ts.createBlock([createResultReturn(funcDef)], true);
    }
}
function createThenForException(throwDef) {
    return ts.createBlock([
        ts.createReturn(ts.createCall(identifiers_1.COMMON_IDENTIFIERS.callback, undefined, [
            ts.createIdentifier(`result.${throwDef.name.value}`),
        ])),
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
        ? values_1.renderValue(field.fieldType, field.defaultValue, state)
        : undefined;
    return utils_2.createFunctionParameter(field.name.value, types_2.typeNodeForFieldType(field.fieldType, state), defaultValue, field.requiredness === 'optional');
}
//# sourceMappingURL=client.js.map