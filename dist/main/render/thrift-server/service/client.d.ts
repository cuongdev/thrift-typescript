import * as ts from 'typescript';
import { ServiceDefinition } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../../types';
export declare function renderClient(service: ServiceDefinition, state: IRenderState): ts.ClassDeclaration;
