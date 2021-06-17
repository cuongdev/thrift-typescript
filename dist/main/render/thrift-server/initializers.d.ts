import * as ts from 'typescript';
import { ConstValue, DoubleConstant, FunctionType, IntConstant } from '@creditkarma/thrift-parser';
import { IRenderState } from '../../types';
export declare function renderValue(fieldType: FunctionType, node: ConstValue, state: IRenderState): ts.Expression;
export declare function renderIntConstant(node: IntConstant, fieldType?: FunctionType): ts.Expression;
export declare function renderDoubleConstant(node: DoubleConstant): ts.Expression;
