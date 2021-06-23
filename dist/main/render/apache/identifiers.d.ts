import * as ts from 'typescript';
export * from '../shared/identifiers';
export declare const THRIFT_IDENTIFIERS: {
    TMessage: ts.Identifier;
    TField: ts.Identifier;
    TMap: ts.Identifier;
    TSet: ts.Identifier;
    TList: ts.Identifier;
    TProtocol: ts.Identifier;
    TTransport: ts.Identifier;
    Thrift: ts.Identifier;
    Thrift_Type: ts.Identifier;
    MessageType: ts.Identifier;
    TApplicationException: ts.Identifier;
    TProtocolException: ts.Identifier;
    TStructLike: ts.Identifier;
};
export declare const THRIFT_TYPES: {
    STRUCT: ts.Identifier;
    SET: ts.Identifier;
    MAP: ts.Identifier;
    LIST: ts.Identifier;
    STRING: ts.Identifier;
    BOOL: ts.Identifier;
    DOUBLE: ts.Identifier;
    BYTE: ts.Identifier;
    I16: ts.Identifier;
    I32: ts.Identifier;
    I64: ts.Identifier;
    VOID: ts.Identifier;
    STOP: ts.Identifier;
};
export declare const MESSAGE_TYPE: {
    CALL: ts.Identifier;
    EXCEPTION: ts.Identifier;
    REPLY: ts.Identifier;
};
export declare const PROTOCOL_EXCEPTION: {
    UNKNOWN: ts.Identifier;
    INVALID_DATA: ts.Identifier;
    NEGATIVE_SIZE: ts.Identifier;
    SIZE_LIMIT: ts.Identifier;
    BAD_VERSION: ts.Identifier;
    NOT_IMPLEMENTED: ts.Identifier;
    DEPTH_LIMIT: ts.Identifier;
};
export declare const APPLICATION_EXCEPTION: {
    UNKNOWN: ts.Identifier;
    UNKNOWN_METHOD: ts.Identifier;
    INVALID_MESSAGE_TYPE: ts.Identifier;
    WRONG_METHOD_NAME: ts.Identifier;
    BAD_SEQUENCE_ID: ts.Identifier;
    MISSING_RESULT: ts.Identifier;
    INTERNAL_ERROR: ts.Identifier;
    PROTOCOL_ERROR: ts.Identifier;
    INVALID_TRANSFORM: ts.Identifier;
    INVALID_PROTOCOL: ts.Identifier;
    UNSUPPORTED_CLIENT_TYPE: ts.Identifier;
};