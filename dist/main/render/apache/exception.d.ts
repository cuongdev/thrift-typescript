import * as ts from 'typescript';
import { ExceptionDefinition } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../types';
export declare function renderException(node: ExceptionDefinition, state: IRenderState): ts.ClassDeclaration;
