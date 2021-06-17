import { ThriftStatement } from '@creditkarma/thrift-parser';
import { IFileIncludes, ISourceFile } from '../types';
export declare function includesForFile(fileBody: Array<ThriftStatement>, sourceFile: ISourceFile): IFileIncludes;
