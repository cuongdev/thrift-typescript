import * as ts from 'typescript';
import { ThriftStatement } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../types';
export declare function statementsUseThrift(statements: Array<ThriftStatement>): boolean;
export declare function statementsUseInt64(statements: Array<ThriftStatement>): boolean;
export declare function renderThriftImports(thriftLib: string): ts.ImportDeclaration;
export declare function renderIncludes(statements: Array<ThriftStatement>, state: IRenderState): Array<ts.ImportDeclaration>;
