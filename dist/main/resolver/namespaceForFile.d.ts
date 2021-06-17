import { ThriftStatement } from '@creditkarma/thrift-parser';
import { INamespacePath } from '../types';
export declare function namespaceForFile(fileBody: Array<ThriftStatement>, fallbackNamespace: string): INamespacePath;
