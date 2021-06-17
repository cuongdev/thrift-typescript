import * as ts from 'typescript';
import { FieldDefinition, UnionDefinition } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../types';
export declare function renderUnion(node: UnionDefinition, state: IRenderState): ts.ClassDeclaration;
export declare function createCaseForField(node: UnionDefinition, field: FieldDefinition, state: IRenderState): ts.CaseClause;
export declare function createFieldValidation(node: UnionDefinition, withElse?: boolean): ts.IfStatement;
export declare function createFieldIncrementer(): ts.VariableStatement;
export declare function incrementFieldsSet(): ts.ExpressionStatement;
