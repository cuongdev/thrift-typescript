import * as ts from 'typescript';
import { InterfaceWithFields } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../../types';
export declare function renderToolkit(node: InterfaceWithFields, state: IRenderState, isExported: boolean): ts.Statement;
