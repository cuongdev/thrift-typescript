"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const defaults_1 = require("./defaults");
const Debugger = require("./debugger");
const generator_1 = require("./generator");
exports.generateProject = generator_1.generateProject;
const printer_1 = require("./printer");
const reader_1 = require("./reader");
const render_1 = require("./render");
const parser_1 = require("./parser");
const resolver_1 = require("./resolver");
const Sys = require("./sys");
exports.Sys = Sys;
const Utils = require("./utils");
exports.Utils = Utils;
const Validator = require("./validator");
__export(require("./resolver"));
__export(require("./parser"));
__export(require("@creditkarma/thrift-parser"));
function make(source, options = {}) {
    const mergedOptions = defaults_1.mergeWithDefaults(options);
    const sourceFile = {
        type: 'SourceFile',
        name: 'source.thrift',
        path: '',
        fullPath: '',
        source,
    };
    const thriftProject = thriftProjectFromSourceFiles([sourceFile], mergedOptions);
    const currentNamespace = thriftProject.namespaces['__ROOT_NAMESPACE__'];
    const state = {
        options: mergedOptions,
        currentNamespace,
        currentDefinitions: currentNamespace.exports,
        project: {
            type: 'ThriftProject',
            rootDir: '',
            sourceDir: '',
            outDir: '',
            namespaces: {},
            options: mergedOptions,
        },
    };
    const statements = Object.keys(currentNamespace.exports).map((next) => {
        return currentNamespace.exports[next];
    });
    return printer_1.print(generator_1.processStatements(statements, state, render_1.rendererForTarget(mergedOptions.target)));
}
exports.make = make;
async function readThriftFiles(options) {
    const rootDir = path.resolve(process.cwd(), options.rootDir);
    const sourceDir = path.resolve(rootDir, options.sourceDir);
    const fileNames = Utils.collectSourceFiles(sourceDir, options.files);
    const thriftFiles = await Promise.all(fileNames.map((next) => {
        return reader_1.readThriftFile(next, [sourceDir]);
    }));
    return thriftFiles;
}
exports.readThriftFiles = readThriftFiles;
function thriftProjectFromSourceFiles(sourceFiles, options = {}) {
    const mergedOptions = defaults_1.mergeWithDefaults(options);
    const rootDir = path.resolve(process.cwd(), mergedOptions.rootDir);
    const outDir = path.resolve(rootDir, mergedOptions.outDir);
    const sourceDir = path.resolve(rootDir, mergedOptions.sourceDir);
    const parsedFiles = sourceFiles.map((next) => parser_1.Parser.parseThriftFile(next, mergedOptions.fallbackNamespace));
    const namespaces = resolver_1.Resolver.organizeByNamespace(parsedFiles, sourceDir, mergedOptions.fallbackNamespace);
    const resolvedNamespaces = Object.keys(namespaces).reduce((acc, next) => {
        const nextNamespace = namespaces[next];
        acc[next] = resolver_1.Resolver.resolveNamespace(nextNamespace, namespaces);
        return acc;
    }, {});
    const resolvedInvalidFiles = Debugger.collectInvalidFiles(Utils.valuesForObject(resolvedNamespaces));
    if (resolvedInvalidFiles.length > 0) {
        Debugger.printErrors(resolvedInvalidFiles);
        throw new Error(`Unable to parse Thrift files`);
    }
    else {
        const validatedNamespaces = Object.keys(resolvedNamespaces).reduce((acc, next) => {
            const nextNamespace = namespaces[next];
            acc[next] = Validator.validateNamespace(nextNamespace, namespaces);
            return acc;
        }, {});
        const validatedInvalidFiles = Debugger.collectInvalidFiles(Utils.valuesForObject(validatedNamespaces));
        if (validatedInvalidFiles.length > 0) {
            Debugger.printErrors(validatedInvalidFiles);
            throw new Error(`Unable to parse Thrift files`);
        }
        else {
            return {
                type: 'ThriftProject',
                rootDir,
                outDir,
                sourceDir,
                namespaces: resolvedNamespaces,
                options: mergedOptions,
            };
        }
    }
}
exports.thriftProjectFromSourceFiles = thriftProjectFromSourceFiles;
async function processThriftProject(options = {}) {
    const mergedOptions = defaults_1.mergeWithDefaults(options);
    const rootDir = path.resolve(process.cwd(), mergedOptions.rootDir);
    const sourceDir = path.resolve(rootDir, mergedOptions.sourceDir);
    const sourceFiles = await readThriftFiles({
        rootDir,
        sourceDir,
        files: mergedOptions.files,
    });
    return thriftProjectFromSourceFiles(sourceFiles, mergedOptions);
}
exports.processThriftProject = processThriftProject;
async function generate(options = {}) {
    const thriftProject = await processThriftProject(options);
    const generatedFiles = generator_1.generateProject(thriftProject);
    Sys.saveFiles(generatedFiles, thriftProject.outDir);
}
exports.generate = generate;
//# sourceMappingURL=index.js.map