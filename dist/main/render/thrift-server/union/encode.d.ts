import * as ts from 'typescript';
import { FieldDefinition, UnionDefinition } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../../types';
export declare function createEncodeMethod(node: UnionDefinition, state: IRenderState): ts.MethodDeclaration;
export declare function createWriteForField(node: UnionDefinition, field: FieldDefinition, state: IRenderState): ts.IfStatement;
export declare function createWriteForFieldType(node: UnionDefinition, field: FieldDefinition, fieldName: ts.Identifier, state: IRenderState): ts.Block;
