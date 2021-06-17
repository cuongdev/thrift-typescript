export declare type ReadMethodName = 'readString' | 'readBinary' | 'readDouble' | 'readI16' | 'readI32' | 'readI64' | 'readByte' | 'readBool';
export interface IReadMap {
    [name: string]: ReadMethodName;
}
export declare const READ_METHODS: IReadMap;
export declare type WriteMethodName = 'writeString' | 'writeBinary' | 'writeDouble' | 'writeI16' | 'writeI32' | 'writeI64' | 'writeByte' | 'writeBool';
export interface IWriteMap {
    [name: string]: WriteMethodName;
}
export declare const WRITE_METHODS: IWriteMap;
