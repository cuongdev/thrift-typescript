"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const identifiers_1 = require("./identifiers");
function createNotNullCheck(obj) {
    return ts.createBinary(typeof obj === 'string' ? ts.createIdentifier(obj) : obj, ts.SyntaxKind.ExclamationEqualsToken, ts.createNull());
}
exports.createNotNullCheck = createNotNullCheck;
function createNullCheck(obj) {
    return ts.createBinary(typeof obj === 'string' ? ts.createIdentifier(obj) : obj, ts.SyntaxKind.EqualsEqualsToken, ts.createNull());
}
exports.createNullCheck = createNullCheck;
function createNotEqualsCheck(left, right) {
    return ts.createBinary(left, ts.SyntaxKind.ExclamationEqualsEqualsToken, right);
}
exports.createNotEqualsCheck = createNotEqualsCheck;
function createEqualsCheck(left, right) {
    return ts.createBinary(left, ts.SyntaxKind.EqualsEqualsEqualsToken, right);
}
exports.createEqualsCheck = createEqualsCheck;
function createClassConstructor(parameters, statements) {
    return ts.createConstructor(undefined, undefined, parameters, ts.createBlock(statements, true));
}
exports.createClassConstructor = createClassConstructor;
function createPublicMethod(name, args, type, statements) {
    return ts.createMethod(undefined, [ts.createToken(ts.SyntaxKind.PublicKeyword)], undefined, name, undefined, undefined, args, type, ts.createBlock(statements, true));
}
exports.createPublicMethod = createPublicMethod;
function createAssignmentStatement(left, right) {
    return ts.createStatement(ts.createAssignment(left, right));
}
exports.createAssignmentStatement = createAssignmentStatement;
function createLetStatement(name, type, initializer) {
    return ts.createVariableStatement(undefined, createLet(name, type, initializer));
}
exports.createLetStatement = createLetStatement;
function createConstStatement(name, type, initializer) {
    return ts.createVariableStatement(undefined, createConst(name, type, initializer));
}
exports.createConstStatement = createConstStatement;
function createConst(name, type, initializer) {
    return ts.createVariableDeclarationList([ts.createVariableDeclaration(name, type, initializer)], ts.NodeFlags.Const);
}
exports.createConst = createConst;
function createLet(name, type, initializer) {
    return ts.createVariableDeclarationList([ts.createVariableDeclaration(name, type, initializer)], ts.NodeFlags.Let);
}
exports.createLet = createLet;
function createPrivateProperty(name, type, initializer) {
    return ts.createProperty(undefined, [ts.createToken(ts.SyntaxKind.PrivateKeyword)], name, undefined, type, initializer);
}
exports.createPrivateProperty = createPrivateProperty;
function createProtectedProperty(name, type, initializer) {
    return ts.createProperty(undefined, [ts.createToken(ts.SyntaxKind.ProtectedKeyword)], name, undefined, type, initializer);
}
exports.createProtectedProperty = createProtectedProperty;
function createPublicProperty(name, type, initializer) {
    return ts.createProperty(undefined, [ts.createToken(ts.SyntaxKind.PublicKeyword)], name, undefined, type, initializer);
}
exports.createPublicProperty = createPublicProperty;
function createCallStatement(obj, args = []) {
    return ts.createStatement(ts.createCall(typeof obj === 'string' ? ts.createIdentifier(obj) : obj, undefined, args));
}
exports.createCallStatement = createCallStatement;
function createMethodCallStatement(obj, methodName, args = []) {
    return createCallStatement(propertyAccessForIdentifier(obj, methodName), args);
}
exports.createMethodCallStatement = createMethodCallStatement;
function createMethodCall(obj, method, args = []) {
    return ts.createCall(propertyAccessForIdentifier(obj, method), undefined, args);
}
exports.createMethodCall = createMethodCall;
function propertyAccessForIdentifier(obj, prop) {
    switch (obj) {
        case 'this':
            return ts.createPropertyAccess(ts.createThis(), prop);
        default:
            return ts.createPropertyAccess(typeof obj === 'string' ? ts.createIdentifier(obj) : obj, prop);
    }
}
exports.propertyAccessForIdentifier = propertyAccessForIdentifier;
function createFunctionParameter(name, typeNode, initializer, isOptional) {
    return ts.createParameter(undefined, undefined, undefined, typeof name === 'string' ? ts.createIdentifier(name) : name, isOptional ? ts.createToken(ts.SyntaxKind.QuestionToken) : undefined, typeNode, initializer);
}
exports.createFunctionParameter = createFunctionParameter;
function renderOptional(value) {
    if (value !== 'required') {
        return ts.createToken(ts.SyntaxKind.QuestionToken);
    }
    else {
        return undefined;
    }
}
exports.renderOptional = renderOptional;
function hasRequiredField(struct) {
    return struct.fields.reduce((acc, next) => {
        if (acc === false) {
            acc = next.requiredness === 'required';
        }
        return acc;
    }, false);
}
exports.hasRequiredField = hasRequiredField;
function createPromise(type, returnType, body) {
    return ts.createNew(identifiers_1.COMMON_IDENTIFIERS.Promise, [type], [
        ts.createArrowFunction(undefined, undefined, [
            createFunctionParameter('resolve', undefined),
            createFunctionParameter('reject', undefined),
        ], returnType, undefined, ts.createBlock([...body], true)),
    ]);
}
exports.createPromise = createPromise;
//# sourceMappingURL=utils.js.map