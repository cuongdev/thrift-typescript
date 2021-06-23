import * as ts from 'typescript';
import { FieldRequired, InterfaceWithFields } from '@creditkarma/thrift-parser';
export declare function createNotNullCheck(obj: string | ts.Expression): ts.BinaryExpression;
export declare function createNullCheck(obj: string | ts.Expression): ts.BinaryExpression;
export declare function createNotEqualsCheck(left: ts.Expression, right: ts.Expression): ts.BinaryExpression;
export declare function createEqualsCheck(left: ts.Expression, right: ts.Expression): ts.BinaryExpression;
export declare function createClassConstructor(parameters: Array<ts.ParameterDeclaration>, statements: Array<ts.Statement>): ts.ConstructorDeclaration;
export declare function createPublicMethod(name: ts.Identifier, args: Array<ts.ParameterDeclaration>, type: ts.TypeNode, statements: Array<ts.Statement>): ts.MethodDeclaration;
export declare function createAssignmentStatement(left: ts.Expression, right: ts.Expression): ts.ExpressionStatement;
export declare function createLetStatement(name: string | ts.Identifier, type?: ts.TypeNode, initializer?: ts.Expression): ts.VariableStatement;
export declare function createConstStatement(name: string | ts.Identifier, type?: ts.TypeNode, initializer?: ts.Expression): ts.VariableStatement;
export declare function createConst(name: string | ts.Identifier, type?: ts.TypeNode, initializer?: ts.Expression): ts.VariableDeclarationList;
export declare function createLet(name: string | ts.Identifier, type?: ts.TypeNode, initializer?: ts.Expression): ts.VariableDeclarationList;
export declare function createPrivateProperty(name: string | ts.Identifier, type?: ts.TypeNode, initializer?: ts.Expression): ts.PropertyDeclaration;
export declare function createProtectedProperty(name: string | ts.Identifier, type?: ts.TypeNode, initializer?: ts.Expression): ts.PropertyDeclaration;
export declare function createPublicProperty(name: string | ts.Identifier, type?: ts.TypeNode, initializer?: ts.Expression): ts.PropertyDeclaration;
export declare function createCallStatement(obj: ts.Expression, args?: Array<ts.Expression>): ts.ExpressionStatement;
export declare function createMethodCallStatement(obj: string | ts.Identifier, methodName: string | ts.Identifier, args?: Array<ts.Expression>): ts.ExpressionStatement;
export declare function createMethodCall(obj: string | ts.Expression, method: string | ts.Identifier, args?: Array<ts.Expression>): ts.CallExpression;
export declare function propertyAccessForIdentifier(obj: string | ts.Expression, prop: string | ts.Identifier): ts.PropertyAccessExpression;
export declare function createFunctionParameter(name: string | ts.Identifier, typeNode: ts.TypeNode | undefined, initializer?: ts.Expression, isOptional?: boolean): ts.ParameterDeclaration;
export declare function renderOptional(value: FieldRequired | null): ts.Token<ts.SyntaxKind.QuestionToken> | undefined;
export declare function hasRequiredField(struct: InterfaceWithFields): boolean;
export declare function createPromise(type: ts.TypeNode, returnType: ts.TypeNode, body: Array<ts.Statement>): ts.NewExpression;