import { FieldDefinition, FunctionDefinition } from '@creditkarma/thrift-parser';
export declare function capitalize(str: string): string;
export declare function createStructArgsName(def: FunctionDefinition | FieldDefinition): string;
export declare function createStructResultName(def: FunctionDefinition | FieldDefinition): string;
