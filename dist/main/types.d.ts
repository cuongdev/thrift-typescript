import * as ts from 'typescript';
import { ConstDefinition, EnumDefinition, ExceptionDefinition, ServiceDefinition, StructDefinition, ThriftStatement, TypedefDefinition, UnionDefinition } from '@creditkarma/thrift-parser';
import { IThriftError } from './errors';
export interface IResolveContext {
    currentNamespace: INamespace;
    currentDefinitions?: IFileExports;
    namespaceMap: INamespaceMap;
}
export interface IResolveResult {
    namespace: INamespace;
    definition: DefinitionType;
}
export interface IThriftProject {
    type: 'ThriftProject';
    rootDir: string;
    outDir: string;
    sourceDir: string;
    namespaces: INamespaceMap;
    options: IMakeOptions;
}
export interface INamespaceFiles {
    [name: string]: Array<IParsedFile>;
}
export interface INamespacePathMap {
    [namespaceAccessor: string]: INamespacePath;
}
export interface INamespacePath {
    type: 'NamespacePath';
    scope: string;
    name: string;
    path: string;
    accessor: string;
}
export interface INamespaceMap {
    [path: string]: INamespace;
}
export interface INamespace {
    type: 'Namespace';
    namespace: INamespacePath;
    exports: IFileExports;
    includedNamespaces: INamespacePathMap;
    namespaceIncludes: INamespaceToIncludeMap;
    errors: Array<IThriftError>;
    constants: Array<ConstDefinition>;
    enums: Array<EnumDefinition>;
    typedefs: Array<TypedefDefinition>;
    structs: Array<StructDefinition>;
    unions: Array<UnionDefinition>;
    exceptions: Array<ExceptionDefinition>;
    services: Array<ServiceDefinition>;
}
export interface IRenderState {
    options: IMakeOptions;
    currentNamespace: INamespace;
    currentDefinitions: IFileExports;
    project: IThriftProject;
}
export declare type CompileTarget = 'apache' | 'thrift-server';
export interface IMakeOptions {
    rootDir: string;
    outDir: string;
    sourceDir: string;
    files: Array<string>;
    target: CompileTarget;
    fallbackNamespace: string;
    library: string;
    strictUnions: boolean;
    strictUnionsComplexNames: boolean;
    withNameField: boolean;
}
export interface IThriftFiles {
    [absolutePath: string]: ISourceFile;
}
export interface ISourceFile {
    type: 'SourceFile';
    name: string;
    path: string;
    fullPath: string;
    source: string;
}
export interface IParsedFileMap {
    [absolutePath: string]: IParsedFile;
}
export interface IParsedFile {
    type: 'ParsedFile';
    sourceFile: ISourceFile;
    namespace: INamespacePath;
    includes: IFileIncludes;
    exports: IFileExports;
    body: Array<ThriftStatement>;
    errors: Array<IThriftError>;
}
export interface INamespaceToIncludeMap {
    [rawPath: string]: string;
}
export interface IFileIncludes {
    [includeName: string]: IIncludePath;
}
export declare type DefinitionType = ConstDefinition | StructDefinition | UnionDefinition | ExceptionDefinition | EnumDefinition | TypedefDefinition | ServiceDefinition;
export interface IFileExports {
    [name: string]: DefinitionType;
}
export interface IIncludePath {
    type: 'IncludePath';
    path: string;
    importedFrom: string;
}
export interface IRenderer {
    renderIndex(state: IRenderState): Array<ts.Statement>;
    renderImports(files: Array<ThriftStatement>, state: IRenderState): Array<ts.Statement>;
    renderConst(statement: ConstDefinition, state: IRenderState): Array<ts.Statement>;
    renderTypeDef(statement: TypedefDefinition, state: IRenderState): Array<ts.Statement>;
    renderEnum(statement: EnumDefinition, state: IRenderState): Array<ts.Statement>;
    renderStruct(statement: StructDefinition, state: IRenderState): Array<ts.Statement>;
    renderException(statement: ExceptionDefinition, state: IRenderState): Array<ts.Statement>;
    renderUnion(statement: UnionDefinition, state: IRenderState): Array<ts.Statement>;
    renderService(statement: ServiceDefinition, state: IRenderState): Array<ts.Statement>;
}
export interface IResolvedIdentifier {
    rawName: string;
    name: string;
    baseName: string;
    pathName?: string;
    fullName: string;
}
export interface IGeneratedFile {
    type: 'GeneratedFile';
    name: string;
    ext: string;
    path: string;
    body: Array<ts.Statement>;
}
