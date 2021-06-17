"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
function emptyNamespace() {
    return {
        type: 'NamespacePath',
        scope: '',
        name: '__ROOT_NAMESPACE__',
        path: createPathForNamespace(''),
        accessor: '__ROOT_NAMESPACE__',
    };
}
function createPathForNamespace(ns) {
    return ns.split('.').join('/');
}
function resolveNamespaceAccessor(namespaceName) {
    return namespaceName
        .split('')
        .map((next) => {
        if (next === '.') {
            return '_';
        }
        else {
            return next;
        }
    })
        .join('');
}
function collectNamespaces(fileBody) {
    return fileBody
        .filter((next) => {
        return next.type === thrift_parser_1.SyntaxType.NamespaceDefinition;
    })
        .reduce((acc, def) => {
        const includeAccessor = resolveNamespaceAccessor(def.name.value);
        acc[def.scope.value] = {
            type: 'NamespacePath',
            scope: def.scope.value,
            name: def.name.value,
            path: createPathForNamespace(def.name.value),
            accessor: includeAccessor,
        };
        return acc;
    }, {});
}
function namespaceForFile(fileBody, fallbackNamespace) {
    const namespaceMap = collectNamespaces(fileBody);
    if (namespaceMap.js) {
        return namespaceMap.js;
    }
    else if (fallbackNamespace !== 'none' &&
        namespaceMap[fallbackNamespace]) {
        return namespaceMap[fallbackNamespace];
    }
    else {
        return emptyNamespace();
    }
}
exports.namespaceForFile = namespaceForFile;
//# sourceMappingURL=namespaceForFile.js.map