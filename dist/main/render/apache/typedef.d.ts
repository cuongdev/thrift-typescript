import * as ts from 'typescript';
import { TypedefDefinition } from '@creditkarma/thrift-parser';
import { TypeMapping } from './types';
import { IRenderState } from '../../types';
export declare function renderTypeDef(node: TypedefDefinition, typeMapping: TypeMapping, state: IRenderState): Array<ts.Statement>;
