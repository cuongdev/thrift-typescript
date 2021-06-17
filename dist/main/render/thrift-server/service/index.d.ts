import * as ts from 'typescript';
import { ServiceDefinition } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../../types';
export declare function renderService(service: ServiceDefinition, state: IRenderState): Array<ts.Statement>;
export declare function renderArgsStruct(service: ServiceDefinition, state: IRenderState): Array<ts.Statement>;
export declare function renderResultStruct(service: ServiceDefinition, state: IRenderState): Array<ts.Statement>;
