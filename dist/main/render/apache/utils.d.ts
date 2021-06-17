import * as ts from 'typescript';
import { TApplicationException, TProtocolException } from './types';
export * from '../shared/utils';
export declare function createProtocolException(type: TProtocolException, message: string): ts.NewExpression;
export declare function throwProtocolException(type: TProtocolException, message: string): ts.ThrowStatement;
export declare function createApplicationException(type: TApplicationException, message: string | ts.Expression): ts.NewExpression;
export declare function throwApplicationException(type: TApplicationException, message: string): ts.ThrowStatement;
