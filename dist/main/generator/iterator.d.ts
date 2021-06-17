import * as ts from 'typescript';
import { ThriftStatement } from '@creditkarma/thrift-parser';
import { IRenderer, IRenderState } from '../types';
export declare function renderStatement(statement: ThriftStatement, state: IRenderState, renderer: IRenderer): Array<ts.Statement>;
export declare function processStatements(statements: Array<ThriftStatement>, state: IRenderState, renderer: IRenderer): Array<ts.Statement>;
