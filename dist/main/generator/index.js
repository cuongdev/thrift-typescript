"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const render_1 = require("../render");
const iterator_1 = require("./iterator");
const resolver_1 = require("../resolver");
var iterator_2 = require("./iterator");
exports.processStatements = iterator_2.processStatements;
function generateFile(renderer, statements, state) {
    return iterator_1.processStatements(statements, state, renderer);
}
exports.generateFile = generateFile;
function generateFileFromStatements(statements, namespace, thriftProject, renderer) {
    const result = [];
    statements.forEach((statement) => {
        const state = {
            options: thriftProject.options,
            currentNamespace: namespace,
            currentDefinitions: resolver_1.Resolver.exportsForFile([statement]),
            project: thriftProject,
        };
        const generatedFile = {
            type: 'GeneratedFile',
            name: statement.name.value,
            ext: 'ts',
            path: namespace.namespace.path,
            body: iterator_1.renderStatement(statement, state, renderer),
        };
        generatedFile.body = [
            ...renderer.renderImports([statement], state),
            ...generatedFile.body,
        ];
        result.push(generatedFile);
    });
    return result;
}
function generateFilesFromKey(key, namespace, thriftProject, renderer) {
    const result = [];
    const statements = namespace[key];
    if (statements.length > 0) {
        const constantsFile = {
            type: 'GeneratedFile',
            name: key,
            ext: 'ts',
            path: namespace.namespace.path,
            body: [],
        };
        const state = {
            options: thriftProject.options,
            currentNamespace: namespace,
            currentDefinitions: resolver_1.Resolver.exportsForFile(statements),
            project: thriftProject,
        };
        statements.forEach((statement) => {
            constantsFile.body = [
                ...constantsFile.body,
                ...iterator_1.renderStatement(statement, state, renderer),
            ];
        });
        constantsFile.body = [
            ...renderer.renderImports(statements, state),
            ...constantsFile.body,
        ];
        result.push(constantsFile);
    }
    return result;
}
function generateProject(thriftProject) {
    let result = [];
    const renderer = render_1.rendererForTarget(thriftProject.options.target);
    Object.keys(thriftProject.namespaces).forEach((namespaceName) => {
        const namespace = thriftProject.namespaces[namespaceName];
        result = result.concat(generateFilesFromKey('constants', namespace, thriftProject, renderer), generateFileFromStatements([
            ...namespace.enums,
            ...namespace.typedefs,
            ...namespace.structs,
            ...namespace.unions,
            ...namespace.exceptions,
        ], namespace, thriftProject, renderer), generateFileFromStatements(namespace.services, namespace, thriftProject, renderer));
        result.push({
            type: 'GeneratedFile',
            name: 'index',
            ext: 'ts',
            path: namespace.namespace.path,
            body: renderer.renderIndex({
                options: thriftProject.options,
                currentNamespace: namespace,
                currentDefinitions: {},
                project: thriftProject,
            }),
        });
    });
    return result;
}
exports.generateProject = generateProject;
//# sourceMappingURL=index.js.map