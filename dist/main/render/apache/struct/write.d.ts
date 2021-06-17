import * as ts from 'typescript';
import { FieldDefinition, FunctionType, InterfaceWithFields } from '@creditkarma/thrift-parser';
import { DefinitionType, IRenderState } from '../../../types';
export declare function createWriteMethod(struct: InterfaceWithFields, state: IRenderState): ts.MethodDeclaration;
export declare function createWriteForField(struct: InterfaceWithFields, field: FieldDefinition, state: IRenderState): ts.IfStatement;
export declare function createWriteForFieldType(struct: InterfaceWithFields, field: FieldDefinition, fieldName: ts.Identifier, state: IRenderState): ts.Block;
export declare function writeValueForIdentifier(definition: DefinitionType, node: InterfaceWithFields, fieldName: ts.Identifier, state: IRenderState): Array<ts.Expression>;
export declare function writeValueForType(struct: InterfaceWithFields, fieldType: FunctionType, fieldName: ts.Identifier, state: IRenderState): Array<ts.Expression>;
