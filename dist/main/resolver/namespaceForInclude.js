"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const namespaceForFile_1 = require("./namespaceForFile");
function fileForInclude(includePath, fileMap, sourceDir) {
    const relativeToFile = path.resolve(includePath.importedFrom, includePath.path);
    const relativeToRoot = path.resolve(sourceDir, includePath.path);
    if (fileMap[relativeToFile]) {
        return fileMap[relativeToFile];
    }
    else if (fileMap[relativeToRoot]) {
        return fileMap[relativeToRoot];
    }
    else {
        throw new Error(`No file for include: ${includePath.path}`);
    }
}
function namespaceForInclude(includePath, fileMap, sourceDir, fallbackNamespace) {
    const file = fileForInclude(includePath, fileMap, sourceDir);
    const namespace = namespaceForFile_1.namespaceForFile(file.body, fallbackNamespace);
    return namespace;
}
exports.namespaceForInclude = namespaceForInclude;
//# sourceMappingURL=namespaceForInclude.js.map