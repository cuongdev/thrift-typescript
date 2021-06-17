"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function readThriftFile(file, searchPaths) {
    for (const sourcePath of searchPaths) {
        const filePath = path.resolve(sourcePath, file);
        if (fs.existsSync(filePath)) {
            return {
                type: 'SourceFile',
                name: path.basename(filePath, '.thrift'),
                path: path.dirname(filePath),
                fullPath: filePath,
                source: fs.readFileSync(filePath, 'utf-8'),
            };
        }
    }
    throw new Error(`Unable to find file ${file}`);
}
exports.readThriftFile = readThriftFile;
//# sourceMappingURL=index.js.map