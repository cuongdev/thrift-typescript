import * as ts from 'typescript';
import { FieldDefinition, InterfaceWithFields } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../../types';
export declare function renderClass(node: InterfaceWithFields, state: IRenderState, isExported: boolean, extendError?: boolean): ts.ClassDeclaration;
export declare function createWriteMethod(node: InterfaceWithFields, state: IRenderState): ts.MethodDeclaration;
export declare function createStaticWriteMethod(node: InterfaceWithFields, state: IRenderState): ts.MethodDeclaration;
export declare function createStaticReadMethod(node: InterfaceWithFields, state: IRenderState): ts.MethodDeclaration;
export declare function createOutputParameter(): ts.ParameterDeclaration;
export declare function createInputParameter(): ts.ParameterDeclaration;
export declare function createFieldsForStruct(node: InterfaceWithFields, state: IRenderState): Array<ts.PropertyDeclaration>;
export declare function renderFieldDeclarations(field: FieldDefinition, state: IRenderState, withDefaults: boolean): ts.PropertyDeclaration;
export declare function createFieldAssignment(field: FieldDefinition, state: IRenderState): ts.IfStatement;
export declare function createArgsParameterForStruct(node: InterfaceWithFields, state: IRenderState): ts.ParameterDeclaration;