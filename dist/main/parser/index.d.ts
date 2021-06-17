import { ThriftDocument } from '@creditkarma/thrift-parser';
import { IParsedFile, ISourceFile } from '../types';
declare function parseThriftString(source: string): ThriftDocument;
declare function parseFromSource(source: string, fallbackNamespace: string): IParsedFile;
declare function parseThriftFile(file: ISourceFile, fallbackNamespace: string): IParsedFile;
export declare const Parser: {
    parseFromSource: typeof parseFromSource;
    parseThriftString: typeof parseThriftString;
    parseThriftFile: typeof parseThriftFile;
};
export {};
