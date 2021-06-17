import { IIncludePath, INamespacePath, IParsedFileMap } from '../types';
export declare function namespaceForInclude(includePath: IIncludePath, fileMap: IParsedFileMap, sourceDir: string, fallbackNamespace: string): INamespacePath;
