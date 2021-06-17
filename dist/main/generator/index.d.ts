import * as ts from 'typescript';
import { ThriftStatement } from '@creditkarma/thrift-parser';
import { IGeneratedFile, IRenderer, IRenderState, IThriftProject } from '../types';
export { processStatements } from './iterator';
export declare function generateFile(renderer: IRenderer, statements: Array<ThriftStatement>, state: IRenderState): Array<ts.Statement>;
export declare function generateProject(thriftProject: IThriftProject): Array<IGeneratedFile>;
