export * from './client';
export * from './processor';
import * as ts from 'typescript';
import { ServiceDefinition } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../../types';
export declare function renderArgsStruct(service: ServiceDefinition, state: IRenderState): Array<ts.InterfaceDeclaration | ts.ClassDeclaration>;
export declare function renderResultStruct(service: ServiceDefinition, state: IRenderState): Array<ts.InterfaceDeclaration | ts.ClassDeclaration>;
