"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const utils_1 = require("./utils");
const struct_1 = require("../struct");
const client_1 = require("./client");
const processor_1 = require("./processor");
const service_1 = require("../../shared/service");
const types_1 = require("../types");
const annotations_1 = require("../annotations");
function emptyLocation() {
    return {
        start: { line: 0, column: 0, index: 0 },
        end: { line: 0, column: 0, index: 0 },
    };
}
function renderService(service, state) {
    return [
        utils_1.renderServiceName(service),
        annotations_1.renderServiceAnnotations(utils_1.collectAllAnnotations(service, state)),
        annotations_1.renderMethodAnnotations(service_1.collectAllMethods(service, state)),
        utils_1.renderMethodNames(service, state),
        utils_1.renderMethodParameters(service, state),
        ...renderArgsStruct(service, state),
        ...renderResultStruct(service, state),
        client_1.renderClient(service, state),
        ...service_1.renderHandlerInterface(service, types_1.typeNodeForFieldType, state),
        processor_1.renderProcessor(service, state),
    ];
}
exports.renderService = renderService;
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
        return [...acc, ...struct_1.renderStruct(argsStruct, state)];
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
        return [...acc, ...struct_1.renderStruct(resultStruct, state)];
    }, []);
}
exports.renderResultStruct = renderResultStruct;
//# sourceMappingURL=index.js.map