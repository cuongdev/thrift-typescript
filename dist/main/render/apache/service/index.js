"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./client"));
__export(require("./processor"));
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const utils_1 = require("./utils");
const struct_1 = require("../struct");
const interface_1 = require("../interface");
function emptyLocation() {
    return {
        start: { line: 0, column: 0, index: 0 },
        end: { line: 0, column: 0, index: 0 },
    };
}
function renderArgsStruct(service, state) {
    return service.functions.reduce((acc, func) => {
        const argsStruct = {
            type: thrift_parser_1.SyntaxType.StructDefinition,
            name: {
                type: thrift_parser_1.SyntaxType.Identifier,
                value: utils_1.createStructArgsName(func),
                loc: emptyLocation(),
            },
            fields: func.fields.map((next) => {
                next.requiredness =
                    next.requiredness === 'optional'
                        ? 'optional'
                        : 'required';
                return next;
            }),
            comments: [],
            loc: emptyLocation(),
        };
        return [
            ...acc,
            interface_1.renderInterface(argsStruct, state),
            struct_1.renderStruct(argsStruct, state),
        ];
    }, []);
}
exports.renderArgsStruct = renderArgsStruct;
function renderResultStruct(service, state) {
    return service.functions.reduce((acc, func) => {
        let fieldID = 0;
        const resultStruct = {
            type: thrift_parser_1.SyntaxType.StructDefinition,
            name: {
                type: thrift_parser_1.SyntaxType.Identifier,
                value: utils_1.createStructResultName(func),
                loc: emptyLocation(),
            },
            fields: [
                {
                    type: thrift_parser_1.SyntaxType.FieldDefinition,
                    name: {
                        type: thrift_parser_1.SyntaxType.Identifier,
                        value: 'success',
                        loc: emptyLocation(),
                    },
                    fieldID: {
                        type: thrift_parser_1.SyntaxType.FieldID,
                        value: fieldID++,
                        loc: emptyLocation(),
                    },
                    requiredness: 'optional',
                    fieldType: func.returnType,
                    defaultValue: null,
                    comments: [],
                    loc: emptyLocation(),
                },
                ...func.throws.map((next) => {
                    return {
                        type: thrift_parser_1.SyntaxType.FieldDefinition,
                        name: next.name,
                        fieldID: {
                            type: thrift_parser_1.SyntaxType.FieldID,
                            value: fieldID++,
                            loc: emptyLocation(),
                        },
                        requiredness: 'optional',
                        fieldType: next.fieldType,
                        defaultValue: null,
                        comments: [],
                        loc: emptyLocation(),
                    };
                }),
            ],
            comments: [],
            loc: emptyLocation(),
        };
        return [
            ...acc,
            interface_1.renderInterface(resultStruct, state),
            struct_1.renderStruct(resultStruct, state),
        ];
    }, []);
}
exports.renderResultStruct = renderResultStruct;
//# sourceMappingURL=index.js.map