import { IThriftError } from '../errors';
import { INamespace, ISourceFile } from '../types';
interface IErrorFile {
    sourceFile: ISourceFile;
    errors: Array<IThriftError>;
}
export declare function printErrorsForFiles<T extends IErrorFile>(files: Array<T>): void;
export declare function printErrors(files: Array<INamespace>): void;
export declare function collectInvalidFiles<T extends {
    errors: Array<IThriftError>;
}>(resolvedFiles: Array<T>, errors?: Array<T>): Array<T>;
export {};
