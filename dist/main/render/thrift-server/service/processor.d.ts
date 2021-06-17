import * as ts from 'typescript';
import { Identifier, ServiceDefinition } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../../types';
export declare function extendsService(service: Identifier, state: IRenderState): ts.HeritageClause;
export declare function extendsAbstract(): ts.HeritageClause;
export declare function renderProcessor(service: ServiceDefinition, state: IRenderState): ts.ClassDeclaration;
