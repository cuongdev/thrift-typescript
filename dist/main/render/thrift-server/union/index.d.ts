import * as ts from 'typescript';
import { UnionDefinition } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../../types';
export declare function renderUnion(node: UnionDefinition, state: IRenderState, isExported?: boolean): Array<ts.Statement>;
export declare function renderStrictUnion(node: UnionDefinition, state: IRenderState, isExported?: boolean): Array<ts.Statement>;
