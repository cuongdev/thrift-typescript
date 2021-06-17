import * as ts from 'typescript';
import { FunctionDefinition, ServiceDefinition } from '@creditkarma/thrift-parser';
import { TypeMapping } from '../types';
import { IRenderState, IResolveContext } from '../../../types';
export declare function renderHandlerInterface(service: ServiceDefinition, typeMapping: TypeMapping, state: IRenderState): Array<ts.Statement>;
export declare function serviceInheritanceChain(service: ServiceDefinition, context: IResolveContext): Array<ServiceDefinition>;
export declare function collectInheritedMethods(service: ServiceDefinition, context: IResolveContext): Array<FunctionDefinition>;
export declare function collectAllMethods(service: ServiceDefinition, state: IRenderState): Array<FunctionDefinition>;
