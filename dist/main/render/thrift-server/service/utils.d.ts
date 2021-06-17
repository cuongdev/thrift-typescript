import * as ts from 'typescript';
import { Annotations, FieldDefinition, FunctionDefinition, ServiceDefinition } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../../types';
export declare function capitalize(str: string): string;
export declare function createStructArgsName(def: FunctionDefinition | FieldDefinition): string;
export declare function createStructResultName(def: FunctionDefinition | FieldDefinition): string;
export declare function renderServiceName(service: ServiceDefinition): ts.VariableStatement;
export declare function renderServiceNameProperty(): ts.PropertyDeclaration;
export declare function renderServiceNameStaticProperty(): ts.PropertyDeclaration;
export declare function renderMethodNames(service: ServiceDefinition, state: IRenderState): ts.VariableStatement;
export declare function renderMethodNamesProperty(): ts.PropertyDeclaration;
export declare function renderMethodNamesStaticProperty(): ts.PropertyDeclaration;
export declare function renderMethodParameters(service: ServiceDefinition, state: IRenderState): ts.VariableStatement;
export declare function renderMethodParametersProperty(): ts.PropertyDeclaration;
export declare function collectAllAnnotations(service: ServiceDefinition, state: IRenderState): Annotations;
