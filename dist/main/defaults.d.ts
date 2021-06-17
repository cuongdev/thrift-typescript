import { IMakeOptions } from './types';
export declare const DEFAULT_APACHE_LIB = "thrift";
export declare const DEFAULT_THRIFT_SERVER_LIB = "@creditkarma/thrift-server-core";
export declare const DEFAULT_OPTIONS: IMakeOptions;
export declare function defaultLibrary(options: Partial<IMakeOptions>): string;
export declare function mergeWithDefaults(options: Partial<IMakeOptions>): IMakeOptions;
