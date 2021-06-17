import { TextLocation } from '@creditkarma/thrift-parser';
export declare const enum ErrorType {
    ValidationError = "ValidationError",
    ResolutionError = "ResolutionError",
    GenerationError = "GenerationError"
}
export interface IThriftError {
    type: ErrorType;
    message: string;
    loc: TextLocation;
}
export declare class ValidationError extends Error {
    message: string;
    loc: TextLocation;
    constructor(msg: string, loc: TextLocation);
}
export declare function createValidationError(message: string, loc?: TextLocation): IThriftError;
