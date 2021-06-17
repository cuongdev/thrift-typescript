"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exportsForFile_1 = require("./exportsForFile");
const identifiersForStatements_1 = require("./identifiersForStatements");
const includesForFile_1 = require("./includesForFile");
const namespaceForFile_1 = require("./namespaceForFile");
const namespaceForInclude_1 = require("./namespaceForInclude");
const organizeByNamespace_1 = require("./organizeByNamespace");
const resolveConstValue_1 = require("./resolveConstValue");
const resolveIdentifierDefinition_1 = require("./resolveIdentifierDefinition");
const resolveIdentifierName_1 = require("./resolveIdentifierName");
const resolveNamespace_1 = require("./resolveNamespace");
exports.Resolver = {
    exportsForFile: exportsForFile_1.exportsForFile,
    identifiersForStatements: identifiersForStatements_1.identifiersForStatements,
    includesForFile: includesForFile_1.includesForFile,
    namespaceForFile: namespaceForFile_1.namespaceForFile,
    namespaceForInclude: namespaceForInclude_1.namespaceForInclude,
    organizeByNamespace: organizeByNamespace_1.organizeByNamespace,
    resolveConstValue: resolveConstValue_1.resolveConstValue,
    resolveIdentifierName: resolveIdentifierName_1.resolveIdentifierName,
    resolveIdentifierDefinition: resolveIdentifierDefinition_1.resolveIdentifierDefinition,
    resolveNamespace: resolveNamespace_1.resolveNamespace,
};
//# sourceMappingURL=index.js.map