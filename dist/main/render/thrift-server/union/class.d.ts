import * as ts from 'typescript';
import { InterfaceWithFields, UnionDefinition } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../../types';
export declare function renderClass(node: UnionDefinition, state: IRenderState, isExported: boolean): ts.ClassDeclaration;
export declare function createOutputParameter(): ts.ParameterDeclaration;
export declare function createInputParameter(): ts.ParameterDeclaration;
export declare function createFieldsForStruct(node: InterfaceWithFields, state: IRenderState): Array<ts.PropertyDeclaration>;
