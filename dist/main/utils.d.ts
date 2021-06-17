import { Identifier, TextLocation } from '@creditkarma/thrift-parser';
export declare function valuesForObject<T>(obj: {
    [key: string]: T;
}): Array<T>;
export declare function deepCopy<T extends object>(obj: T): T;
export declare function deepMerge<Base extends object, Update extends object>(base: Base, update: Update): Base & Update;
export declare function collectSourceFiles(sourceDir: string, files?: Array<string>): Array<string>;
export declare function stubIdentifier(value: string): Identifier;
export declare function emptyLocation(): TextLocation;
