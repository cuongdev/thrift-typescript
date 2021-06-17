import * as ts from 'typescript';
import { FieldDefinition, UnionDefinition } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../../types';
export declare function createCreateMethod(node: UnionDefinition, state: IRenderState): ts.MethodDeclaration;
export declare function createCaseForField(node: UnionDefinition, field: FieldDefinition, state: IRenderState): ts.CaseClause;
