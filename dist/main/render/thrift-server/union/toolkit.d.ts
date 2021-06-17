import * as ts from 'typescript';
import { UnionDefinition } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../../types';
export declare function renderToolkit(node: UnionDefinition, state: IRenderState, isExported: boolean): ts.Statement;
