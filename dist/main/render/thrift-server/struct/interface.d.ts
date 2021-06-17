import * as ts from 'typescript';
import { InterfaceWithFields } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../../types';
export declare function renderInterface(node: InterfaceWithFields, state: IRenderState, isExported: boolean): Array<ts.InterfaceDeclaration>;
