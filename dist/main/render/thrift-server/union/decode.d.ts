import * as ts from 'typescript';
import { ContainerType, FieldDefinition, UnionDefinition } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../../types';
export declare function createDecodeMethod(node: UnionDefinition, state: IRenderState): ts.MethodDeclaration;
export declare function createReturnForFields(node: UnionDefinition, fields: Array<FieldDefinition>, state: IRenderState): ts.Statement;
export declare function createCaseForField(node: UnionDefinition, field: FieldDefinition, state: IRenderState): ts.CaseClause;
export declare function endReadForField(fieldName: ts.Identifier, field: FieldDefinition): Array<ts.Statement>;
export declare function metadataTypeForFieldType(fieldType: ContainerType): ts.TypeNode;
