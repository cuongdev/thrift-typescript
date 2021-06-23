import { exportsForFile } from './exportsForFile';
import { identifiersForStatements } from './identifiersForStatements';
import { includesForFile } from './includesForFile';
import { namespaceForFile } from './namespaceForFile';
import { namespaceForInclude } from './namespaceForInclude';
import { organizeByNamespace } from './organizeByNamespace';
import { resolveConstValue } from './resolveConstValue';
import { resolveIdentifierDefinition } from './resolveIdentifierDefinition';
import { resolveIdentifierName } from './resolveIdentifierName';
import { resolveNamespace } from './resolveNamespace';
export declare const Resolver: {
    exportsForFile: typeof exportsForFile;
    identifiersForStatements: typeof identifiersForStatements;
    includesForFile: typeof includesForFile;
    namespaceForFile: typeof namespaceForFile;
    namespaceForInclude: typeof namespaceForInclude;
    organizeByNamespace: typeof organizeByNamespace;
    resolveConstValue: typeof resolveConstValue;
    resolveIdentifierName: typeof resolveIdentifierName;
    resolveIdentifierDefinition: typeof resolveIdentifierDefinition;
    resolveNamespace: typeof resolveNamespace;
};