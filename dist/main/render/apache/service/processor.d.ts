import * as ts from 'typescript';
import { ServiceDefinition } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../../types';
export declare function renderHandlerInterface(service: ServiceDefinition, state: IRenderState): Array<ts.Statement>;
export declare function renderProcessor(node: ServiceDefinition, state: IRenderState): ts.ClassDeclaration;
