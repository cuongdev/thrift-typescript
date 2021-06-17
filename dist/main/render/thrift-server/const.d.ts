import * as ts from 'typescript';
import { ConstDefinition } from '@creditkarma/thrift-parser';
import { TypeMapping } from './types';
import { IRenderState } from '../../types';
export declare function renderConst(node: ConstDefinition, typeMapping: TypeMapping, state: IRenderState): ts.Statement;
