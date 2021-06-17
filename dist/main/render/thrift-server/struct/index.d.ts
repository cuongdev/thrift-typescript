import * as ts from 'typescript';
import { InterfaceWithFields } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../../types';
export declare function renderStruct(node: InterfaceWithFields, state: IRenderState): Array<ts.Statement>;
