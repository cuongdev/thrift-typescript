"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exception_1 = require("./exception");
const interface_1 = require("./interface");
const service_1 = require("./service");
const includes_1 = require("../shared/includes");
const const_1 = require("./const");
const enum_1 = require("./enum");
const includes_2 = require("./includes");
const struct_1 = require("./struct");
const typedef_1 = require("./typedef");
const union_1 = require("./union");
const shared_1 = require("../shared");
const types_1 = require("./types");
function renderImports(statements, state) {
    const includes = [
        ...includes_1.renderIncludes(statements, state),
    ];
    if (includes_1.statementsUseThrift(statements)) {
        includes.unshift(includes_1.renderThriftImports(state.options.library));
    }
    if (includes_1.statementsUseInt64(statements)) {
        includes.unshift(includes_2.renderInt64Import());
    }
    return includes;
}
exports.renderImports = renderImports;
function renderConst(statement, state) {
    return [const_1.renderConst(statement, types_1.typeNodeForFieldType, state)];
}
exports.renderConst = renderConst;
function renderTypeDef(statement, state) {
    return typedef_1.renderTypeDef(statement, types_1.typeNodeForFieldType, state);
}
exports.renderTypeDef = renderTypeDef;
function renderEnum(statement, state) {
    return [enum_1.renderEnum(statement)];
}
exports.renderEnum = renderEnum;
function renderStruct(statement, state) {
    return [interface_1.renderInterface(statement, state), struct_1.renderStruct(statement, state)];
}
exports.renderStruct = renderStruct;
function renderException(statement, state) {
    return [
        interface_1.renderInterface(statement, state),
        exception_1.renderException(statement, state),
    ];
}
exports.renderException = renderException;
function renderUnion(statement, state) {
    return [interface_1.renderInterface(statement, state), union_1.renderUnion(statement, state)];
}
exports.renderUnion = renderUnion;
function renderService(statement, state) {
    return [
        ...service_1.renderArgsStruct(statement, state),
        ...service_1.renderResultStruct(statement, state),
        service_1.renderClient(statement, state),
        ...service_1.renderHandlerInterface(statement, state),
        service_1.renderProcessor(statement, state),
    ];
}
exports.renderService = renderService;
exports.renderer = {
    renderImports,
    renderConst,
    renderTypeDef,
    renderEnum,
    renderStruct,
    renderException,
    renderUnion,
    renderService,
    renderIndex: shared_1.renderIndex,
};
//# sourceMappingURL=index.js.map