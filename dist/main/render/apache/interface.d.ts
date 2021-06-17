import * as ts from 'typescript';
import { InterfaceWithFields } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../types';
export declare function interfaceNameForClass(statement: InterfaceWithFields): string;
export declare function renderInterface(statement: InterfaceWithFields, state: IRenderState): ts.InterfaceDeclaration;
